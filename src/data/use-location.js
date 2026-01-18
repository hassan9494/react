import useSWR from 'swr'
import axios from '../utility/axiosIsntance'

const fetcher = (url) => axios.get(url).then(res => res.data?.data)

export const api = {

    create: async (params) => {
        const { data } = await axios.post('location', params)
        return data?.data
    },

    update: async (id, params) => {
        const { data } = await axios.put(`location/${id}`, params)
        return data?.data
    },

    delete: async (id) => {
        await axios.delete(`location/${id}`)
    }
}

export function useLocation(id) {

    const { data, mutate, error } = useSWR(`location/${id}`, fetcher)

    const loading = !data && !error

    return {
        loading,
        error,
        data,
        mutate,
        update: async (params) => api.update(id, params)
    }
}

export function useLocations() {

    const { data, mutate, error } = useSWR('location', fetcher)

    const loading = !data && !error

    return {
        loading,
        error,
        data: data || [],
        mutate,
        create: async (params) => api.create(params)
    }
}

export function useLocationDatatable({ page, limit, search, order = {} }) {

    const url = `location/datatable?page=${page}&limit=${limit}&search=${search}&order=${JSON.stringify(order)}`

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

