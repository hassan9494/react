import useSWR from 'swr'
import axios from '../utility/axiosIsntance'

const fetcher = (url) => axios.get(url).then(res => res.data?.data)

export const api = {

    create: async (params) => {
        const { data } = await axios.post('source', params)
        return data?.data
    },

    update: async (id, params) => {
        const { data } = await axios.put(`source/${id}`, params)
        return data?.data
    },

    delete: async (id) => {
        await axios.delete(`source/${id}`)
    }
}

export function useSource(id) {

    const { data, mutate, error } = useSWR(`source/${id}`, fetcher)

    const loading = !data && !error

    return {
        loading,
        error,
        data,
        mutate,
        update: async (params) => api.update(id, params)
    }
}

export function useSources() {

    const { data, mutate, error } = useSWR('source', fetcher)

    const loading = !data && !error

    return {
        loading,
        error,
        data: data || [],
        mutate,
        create: async (params) => api.create(params)
    }
}

export function useSourceDatatable({ page, limit, search, order = {} }) {

    const url = `source/datatable?page=${page}&limit=${limit}&search=${search}&order=${JSON.stringify(order)}`

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

