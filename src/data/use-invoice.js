import useSWR, { mutate } from 'swr'
import axios from '../utility/axiosIsntance'

const fetcher = (url) => axios.get(url).then(res => res.data?.data)

export const api = {
    create: async (params) => {
        const { data } = await axios.post(`invoice`, params)
        return data?.data
    },
    update: async (id, params) => {
        const { data } = await axios.put(`invoice/${id}`, params)
        return data?.data
    },
    status: async (id, params) => {
        const { data } = await axios.post(`invoice/${id}/status`, params)
        return data?.data
    }
}

export function useInvoice(id) {

    const url = `invoice/${id}`

    const { data, error } = useSWR(`invoice/${id}`, fetcher, {
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

    return {
        loading,
        error,
        data,
        mutate,
        update,
        updateStatus
    }
}

export function useDatatable({ page, limit, search, order = {}, conditions = {} }) {

    const url = `invoice/datatable?page=${page}&limit=${limit}&search=${search}&order=${JSON.stringify(order)}&conditions=${JSON.stringify(conditions)}`

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
