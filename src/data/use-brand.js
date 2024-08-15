import useSWR from 'swr'
import axios from '../utility/axiosIsntance'

const fetcher = (url) => axios.get(url).then(res => res.data?.data)

export const api = {

    create: async (params) => {
        const { data } = await axios.post('brand', params)
        return data?.data
    },

    update: async (id, params) => {
        const { data } = await axios.put(`brand/${id}`, params)
        return data?.data
    },

    delete: async (id) => {
        await axios.delete(`brand/${id}`)
    }
}

export function useBrand(id) {

    const { data, mutate, error } = useSWR(`brand/${id}`, fetcher)

    const loading = !data && !error

    return {
        loading,
        error,
        data,
        mutate,
        update: async (params) => api.update(id, params)
    }
}

export function useBrands() {

    const { data, mutate, error } = useSWR('brand', fetcher)

    const loading = !data && !error

    return {
        loading,
        error,
        data: data || [],
        mutate,
        create: async (params) => api.create(params)
    }
}

export function useBrandDatatable({ page, limit, search, order = {} }) {

    const url = `brand/datatable?page=${page}&limit=${limit}&search=${search}&order=${JSON.stringify(order)}`

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

