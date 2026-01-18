import useSWR from 'swr'
import axios from '../utility/axiosIsntance'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { isUserLoggedIn } from '../utility/Utils'
import ability from "../configs/acl/ability"

const fetcher = async url => {
    if (isUserLoggedIn()) {
        const { data } = await axios.get(url)
        return data?.data
    }
}

export const login = async (params) => {
    const { data } = await axios.post(`auth/login`, params)
    localStorage.setItem('auth', JSON.stringify({token : data?.data?.token}))
    localStorage.setItem('user', JSON.stringify(data?.data?.user || data?.data))
    ability.update(data?.data?.user?.permissions || data?.data?.permissions || [])
}

export const logout = async () => {
    try {
        await axios.post(`/api/auth/logout`)
    } catch (e) {
    } finally {
        localStorage.removeItem('access_token')
    }
}

// Helper function to get current user from localStorage
export const getCurrentUser = () => {
    try {
        const userStr = localStorage.getItem('user')
        if (userStr) {
            const parsed = JSON.parse(userStr)
            return parsed.user || parsed
        }
        return null
    } catch (e) {
        console.error('Error parsing user from localStorage:', e)
        return null
    }
}

// Helper to check if current user is admin
export const isCurrentUserAdmin = () => {
    const user = getCurrentUser()
    if (!user) return false

    // Check roles
    const roles = user.roles || []
    const adminRoles = ['super', 'admin', 'Stock Manager']

    return roles.some(role => {
        const roleName = typeof role === 'string' ? role : (role.name || role)
        return adminRoles.includes(roleName)
    })
}

// Helper to get user roles
export const getUserRoles = () => {
    const user = getCurrentUser()
    if (!user) return []
    return user.roles || []
}

// Helper to check if user has specific role
export const hasRole = (roleName) => {
    const roles = getUserRoles()
    return roles.some(role => {
        const rName = typeof role === 'string' ? role : (role.name || role)
        return rName === roleName
    })
}

// Helper to check if user has permission
export const hasPermission = (permissionName) => {
    const user = getCurrentUser()
    if (!user) return false

    const permissions = user.permissions || []
    return permissions.some(perm => {
        const pName = typeof perm === 'string' ? perm : (perm.name || perm)
        return pName === permissionName
    })
}

// Main useAuth hook
export default function useAuth({ ability, redirectTo = false, redirectIfFound = false } = {}) {
    const history = useHistory()
    const { data: user, error } = useSWR('auth', fetcher, {
        revalidateOnFocus: false
    })

    useEffect(() => {
        if (error && redirectTo && !redirectIfFound) history.push(redirectTo)
        if (user && redirectIfFound) history.push(redirectTo)

        if (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('auth')
                localStorage.removeItem('user')
            }
        }
        if (user) {
            localStorage.setItem('user', JSON.stringify(user))
        }
    }, [user, error, redirectTo, history])

    return {
        user,
        logout,
        loading: !user && !error,
        authenticated: !!user,
        isAdmin: isCurrentUserAdmin(),
        hasRole,
        hasPermission
    }
}