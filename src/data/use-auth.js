import useSWR from 'swr'
import axios from '../utility/axiosIsntance'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { isUserLoggedIn } from '../utility/Utils'

const fetcher = async url => {
    if (isUserLoggedIn()) {
        const { data } = await axios.get(url)
        return data?.data
    }
}

export const login = async (params) => {
    const { data } = await axios.post(`auth/login`, params)
    localStorage.setItem('auth', JSON.stringify(data?.data))
}

export const logout = async () => {
    try {
        await axios.post(`/api/auth/logout`)
    } catch (e) {
    } finally {
        localStorage.removeItem('access_token')
    }
}

export default function useAuth({ redirectTo = false, redirectIfFound = false } = {}) {

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
        if (user) localStorage.setItem('user', JSON.stringify(user))

    }, [user, error, redirectTo])


    return {
        user,
        logout,
        loading: !user && !error,
        authenticated: !!user
    }

}

