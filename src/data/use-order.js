import useSWR, { mutate } from 'swr'
import axios from '../utility/axiosIsntance'

const fetcher = (url) => axios.get(url).then(res => res.data?.data)

export const api = {
    create: async (params) => {
        const { data } = await axios.post(`order`, params)
        return data?.data
    },
    update: async (id, params) => {
        const { data } = await axios.put(`order/${id}`, params)
        return data?.data
    },
    status: async (id, params) => {
        const { data } = await axios.post(`order/${id}/status`, params)
        return data?.data
    },
    supplier: async (id, params) => {
        const { data } = await axios.post(`order/${id}/supplier`, params)
        return data?.data
    },
    shippingStatus: async (id, { status: shipping_status }) => {
        const { data } = await axios.post(`order/${id}/shipping-status`, { shipping_status })
        return data?.data
    }
}

export function useOrder(id) {

    const url = `order/${id}`

    const { data, error } = useSWR(`order/${id}`, fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshWhenOffline: false,
        refreshWhenHidden: false,
        refreshInterval: 0
    })

    const loading = !data && !error


    const update = async (params) => {
        await api.update(id, params)
        await mutate(url)
    }

    const updateStatus = async (params) => {
        await api.status(id, params)
        await mutate(url, { ...data, ...params}, false)
    }

    const updateSupplier = async (params) => {
        await api.supplier(id, params)
        await mutate(url, { ...data, status: params.status}, false)
    }

    return {
        loading,
        error,
        data,
        mutate,
        update,
        updateStatus,
        updateSupplier,
        updateShippingStatus: (params) => api.shippingStatus(id, params)
    }
}

export function useDatatable({ page, limit, search, order = {}, conditions = {} }) {

    const url = `order/datatable?page=${page}&limit=${limit}&search=${search}&order=${JSON.stringify(order)}&conditions=${JSON.stringify(conditions)}`

    const { data, mutate, error } = useSWR(url, fetcher)

    const loading = !data && !error

    const mutates = {
    }

    return {
        loading,
        error,
        data: data?.items || [],
        total: data?.total || 0,
        mutates
    }

}
