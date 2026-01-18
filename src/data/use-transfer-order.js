// src/data/use-transfer-order.js
import { useState, useEffect } from 'react'
import axios from '../utility/axiosIsntance'

export const useTransferOrder = (id = null) => {
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchData = async () => {
        if (id === null) return

        setIsLoading(true)
        try {
            const response = await axios.get(`/transfer-orders/${id}`)
            setData(response.data)
        } catch (err) {
            setError(err)
            console.error('Error fetching transfer order:', err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [id])

    const refetch = () => {
        fetchData()
    }

    return {
        data,
        isLoading,
        error,
        refetch,
        mutate: setData
    }
}

export const useTransferOrders = (params = {}) => {
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [total, setTotal] = useState(0)

    const fetchData = async (customParams = {}) => {
        setIsLoading(true)
        try {
            const allParams = { ...params, ...customParams }
            const response = await axios.get('/transfer-orders', { params: allParams })

            if (response.data.success) {
                setData(response.data.data.items || [])
                setTotal(response.data.data.total || 0)
            } else {
                setData([])
                setTotal(0)
            }
        } catch (err) {
            setError(err)
            console.error('Error fetching transfer orders:', err)
            setData([])
            setTotal(0)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [JSON.stringify(params)])

    const refetch = (customParams = {}) => {
        fetchData(customParams)
    }

    return {
        data,
        isLoading,
        error,
        refetch,
        total,
        mutate: setData
    }
}

// Direct API calls
export const api = {
    create: async (data) => {
        const response = await axios.post('/transfer-orders', data)
        return response.data
    },

    update: async (id, data) => {
        const response = await axios.put(`/transfer-orders/${id}`, data)
        return response.data
    },

    delete: async (id) => {
        const response = await axios.delete(`/transfer-orders/${id}`)
        return response.data
    },

    complete: async (id) => {
        const response = await axios.post(`/transfer-orders/${id}/complete`)
        return response.data
    },

    cancel: async (id) => {
        const response = await axios.post(`/transfer-orders/${id}/cancel`)
        return response.data
    },

    getStatistics: async () => {
        const response = await axios.get('/transfer-orders/statistics/overview')
        return response.data
    }
}