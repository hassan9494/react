import useSWR from 'swr'
import axios from '../utility/axiosIsntance'

const fetcher = (url) => axios.get(url).then(res => res.data?.data)

export const api = {

    create: async (params) => {
        const { data } = await axios.post('product', params)
        return data?.data
    },

    update: async (id, params) => {
        const { data } = await axios.put(`product/${id}`, params)
        return data?.data
    },
    delete: async (id) => {
        await axios.delete(`product/${id}`)
    },
    autocomplete: async (q) => {
        const { data } = await axios.get(`product/autocomplete?q=${q}`)
        return data?.data
    },
    stock: async (params) => {
        await axios.post(`product/stock`, params)
    }
}

export function useProduct(id) {

    const { data, mutate, error } = useSWR(`product/${id}`, fetcher, {
        revalidateOnFocus: false
    })

    const loading = !data && !error

    return {
        loading,
        error,
        data,
        mutate,
        update: async (params) => {
            await api.update(id, params)
            await mutate()
        }
    }
}

export function useDatatable({ page, limit, search, order = {}}) {

    const url = `product/datatable?page=${page}&limit=${limit}&search=${search}&order=${JSON.stringify(order)}`

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

export function useStockDatatable({ page, limit, search, order }) {

    const url = `product/datatable?page=${page}&limit=${limit}&search=${search}&order=${order?.column}&dir=${order?.direction}`

    const { data, error } = useSWR(url, fetcher)

    const loading = !data && !error

    return {
        loading,
        error,
        data: data?.items || [],
        total: data?.total || 0
    }

}

