// src/data/use-stock-adjustment.js
import useSWR from 'swr'
import axios from '../utility/axiosIsntance'
import { getCurrentUser, isCurrentUserAdmin } from './use-auth'

const fetcher = (url) => axios.get(url).then(res => res.data?.data)

export const api = {
    create: async (params) => {
        const { data } = await axios.post('stock-adjustments', params)
        return data?.data
    },

    approve: async (id, notes = '') => {
        const { data } = await axios.post(`stock-adjustments/${id}/approve`, { notes })
        return data?.data
    },

    reject: async (id, reason) => {
        const { data } = await axios.post(`stock-adjustments/${id}/reject`, { reason })
        return data?.data
    },

    getPending: async (params = {}) => {
        const { data } = await axios.get('stock-adjustments', { params })
        return data?.data
    },

    getMyRequests: async (params = {}) => {
        const { data } = await axios.get('stock-adjustments/my-requests', { params })
        return data?.data
    },

    getAllRequests: async (params = {}) => {
        const isAdmin = isCurrentUserAdmin()
        const endpoint = isAdmin ? 'stock-adjustments/all-requests' : 'stock-adjustments/my-requests'

        // Remove 'all' from status if present (backend handles 'all' as show all)
        const cleanedParams = { ...params }
        if (cleanedParams.status === 'all') {
            delete cleanedParams.status
        }

        const { data } = await axios.get(endpoint, { params: cleanedParams })
        return data?.data
    },

    getHistory: async (params = {}) => {
        // Remove 'all' from status if present
        const cleanedParams = { ...params }
        if (cleanedParams.status === 'all') {
            delete cleanedParams.status
        }

        const { data } = await axios.get('stock-adjustments/datatable', { params: cleanedParams })
        return data?.data
    },

    getStatistics: async (params = {}) => {
        const { data } = await axios.get('stock-adjustments/statistics', { params })
        return data?.data
    },

    bulkApprove: async (ids, notes = '') => {
        const { data } = await axios.post('stock-adjustments/bulk-approve', { ids, notes })
        return data?.data
    },

    bulkReject: async (ids, reason) => {
        const { data } = await axios.post('stock-adjustments/bulk-reject', { ids, reason })
        return data?.data
    },

    productHistory: async (productId, params = {}) => {
        const { data } = await axios.get(`stock-adjustments/product/${productId}/history`, { params })
        return data?.data
    }
}

export function useStockAdjustment() {
    const isAdmin = isCurrentUserAdmin()

    // Determine endpoint based on user role
    const endpoint = isAdmin ? 'stock-adjustments/all-requests' : 'stock-adjustments/my-requests'

    const { data: adjustmentData, mutate: mutateAdjustments, error: adjustmentsError } = useSWR(
        endpoint,
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000
        }
    )

    const { data: myRequestsData, mutate: mutateMyRequests, error: myRequestsError } = useSWR(
        'stock-adjustments/my-requests',
        fetcher,
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000
        }
    )

    const loading = (!adjustmentData && !adjustmentsError) || (!myRequestsData && !myRequestsError)
    const error = adjustmentsError || myRequestsError

    return {
        loading,
        error,
        adjustments: adjustmentData?.items || [],
        myRequests: myRequestsData?.items || [],
        isAdmin,

        createRequest: async (params) => {
            const result = await api.create(params)
            await Promise.all([mutateAdjustments(), mutateMyRequests()])
            return result
        },

        approveRequest: async (id, notes = '') => {
            const result = await api.approve(id, notes)
            await Promise.all([mutateAdjustments(), mutateMyRequests()])
            return result
        },

        rejectRequest: async (id, reason) => {
            const result = await api.reject(id, reason)
            await Promise.all([mutateAdjustments(), mutateMyRequests()])
            return result
        }
    }
}

export function useAllRequests({ page = 1, limit = 20, search = '', filters = {} } = {}) {
    const isAdmin = isCurrentUserAdmin()

    // For admin users, use all-requests endpoint
    const endpoint = isAdmin ? 'stock-adjustments/all-requests' : 'stock-adjustments/my-requests'

    // Build query params
    const params = new URLSearchParams()
    params.append('page', page)
    params.append('limit', limit)
    if (search) params.append('search', search)

    // Add filters - skip 'all' status (backend will return all)
    if (filters.status && filters.status !== 'all') {
        params.append('status', filters.status)
    }
    if (filters.user_id) {
        params.append('user_id', filters.user_id)
    }
    if (filters.start_date) {
        params.append('start_date', filters.start_date)
    }
    if (filters.end_date) {
        params.append('end_date', filters.end_date)
    }

    const url = `${endpoint}?${params.toString()}`

    const { data, mutate, error } = useSWR(url, fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 30000
    })

    const loading = !data && !error

    return {
        loading,
        error,
        isAdmin,
        data: data?.items || [],
        total: data?.total || 0,
        mutate
    }
}

export function useStockAdjustmentHistory({ page = 1, limit = 20, search = '', filters = {} } = {}) {
    const params = new URLSearchParams()
    params.append('page', page)
    params.append('limit', limit)
    if (search) params.append('search', search)

    // Skip 'all' status
    if (filters.status && filters.status !== 'all') {
        params.append('status', filters.status)
    }
    if (filters.user_id) {
        params.append('user_id', filters.user_id)
    }
    if (filters.start_date) {
        params.append('start_date', filters.start_date)
    }
    if (filters.end_date) {
        params.append('end_date', filters.end_date)
    }

    const url = `stock-adjustments/datatable?${params.toString()}`

    const { data, mutate, error } = useSWR(url, fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 30000
    })

    const loading = !data && !error

    return {
        loading,
        error,
        data: data?.items || [],
        total: data?.total || 0,
        mutate
    }
}