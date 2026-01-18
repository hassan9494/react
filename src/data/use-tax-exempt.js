import useSWR from 'swr'
import axios from '../utility/axiosIsntance'
import { datatable, model, api as apiCalls } from "./use-data"

const fetcher = (url) => axios.get(url).then(res => res.data?.data)

export const api = {

    create: async (params) => {
        const { data } = await axios.post('tax_exempt', params)
        return data?.data
    },

    update: async (id, params) => {
        // If params is FormData (for file upload), use POST
        if (params instanceof FormData) {
            const { data } = await axios.post(`tax_exempt/${id}`, params, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return data?.data
        } else {
            // Regular JSON update
            const { data } = await axios.put(`tax_exempt/${id}`, params)
            return data?.data
        }
    },

    delete: async (id) => {
        await axios.delete(`tax_exempt/${id}`)
    },
    autocomplete: async (q) => {
        const { data } = await axios.get(`tax_exempt_autocomplete?q=${q}`)
        return data?.data
    }
}

export function useTaxExempt(id) {

    const { data, mutate, error } = useSWR(`tax_exempt/${id}`, fetcher)

    const loading = !data && !error

    return {
        loading,
        error,
        data,
        mutate,
        update: async (params) => api.update(id, params)
    }
}

export function useTaxExempts() {

    const { data, mutate, error } = useSWR('tax_exempt', fetcher)

    const loading = !data && !error

    return {
        loading,
        error,
        data: data || [],
        mutate,
        create: async (params) => api.create(params)
    }
}

export function useTaxExemptDatatable({ page, limit, search, order = {} }) {

    const url = `tax_exempt/datatable?page=${page}&limit=${limit}&search=${search}&order=${JSON.stringify(order)}`

    const { data, mutate, error } = useSWR(url, fetcher)

    const loading = !data && !error

    const mutates = {
        delete: async (id) => {
            await api.delete(id)
            mutate({ ...data })
        }
    }

    return {
        loading,
        error,
        data: data?.items || [],
        total: data?.total || 0,
        mutates
    }

}