import useSWR from 'swr'
import axios from '../utility/axiosIsntance'

const fetcher = (url) => axios.get(url).then(res => res.data?.data)

export const api = {

    create: async (url, params) => {
        const { data } = await axios.post(url, params)
        return data?.data
    },

    update: async (url, id, params) => {
        const { data } = await axios.put(`${url}/${id}`, params)
        return data?.data
    },

    delete: async (url, id) => {
        await axios.delete(`${url}/${id}`)
    }
}

export function model(url, id) {

    const { data, mutate, error } = useSWR(`${url}/${id}`, fetcher)

    const loading = !data && !error

    return {
        loading,
        error,
        data,
        mutate,
        update: async (params) => {
            await api.update(url, id, params)
            await mutate()
        }
    }
}


export function models(url) {

    const { data, mutate, error } = useSWR(url, fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshWhenOffline: false,
        refreshWhenHidden: false,
        refreshInterval: 0
    })

    const loading = !data && !error

    return {
        loading,
        error,
        data: data || [],
        mutate,
        create: async (params) => api.create(params)
    }
}


export function datatable(base, endpoint, { page, limit, search, order = {}, conditions = {} }) {

    const url = `${endpoint}?page=${page}&limit=${limit}&search=${search}&order=${JSON.stringify(order)}&conditions=${JSON.stringify(conditions)}`

    const { data, mutate, error } = useSWR(url, fetcher)

    const loading = !data && !error

    return {
        loading,
        error,
        data: data?.items || [],
        total: data?.total || 0,
        mutate,
        mutates: {
            delete: async (id) => {
                await api.delete(base, id)
                await mutate(url)
            }
        }
    }

}
export function datatableWithData(base, endpoint, { page, limit, search, order = {}, conditions = {}, from, to }) {

    const url = `${endpoint}?page=${page}&limit=${limit}&from=${from}&to=${to}&search=${search}&order=${JSON.stringify(order)}&conditions=${JSON.stringify(conditions)}`

    const { data, mutate, error } = useSWR(url, fetcher)

    const loading = !data && !error

    return {
        loading,
        error,
        data: data?.items || [],
        total: data?.total || 0,
        mutate,
        mutates: {
            delete: async (id) => {
                await api.delete(base, id)
                await mutate(url)
            }
        }
    }

}

export function table(endpoint, { conditions }) {

    const url = `${endpoint}?conditions=${JSON.stringify(conditions)}`

    const { data, mutate, error } = useSWR(url, fetcher)

    const loading = !data && !error

    return {
        loading,
        error,
        data: data?.items || [],
        total: data?.total || 0,
        mutate
    }

}
