import useSWR from 'swr'
import axios from '../utility/axiosIsntance'

const fetcher = (url) => axios.get(url).then(res => res.data?.data)

export const api = {

    create: async (params) => {
        const { data } = await axios.post('variant-product', params)
        return data?.data
    },

    update: async (id, params) => {
        const { data } = await axios.put(`variant-product/${id}`, params)
        return data?.data
    },
    delete: async (id) => {
        await axios.delete(`variant-product/${id}`)
    },
    autocomplete: async (q) => {
        const { data } = await axios.get(`variant-product/autocomplete?q=${q}`)
        return data?.data
    },
    stock: async (params) => {
        await axios.post(`variant-product/stock`, params)
    },
    sku: async (params) => {
        await axios.post(`variant-product/sku`, params)
    }
}

export function useProductVariant(id) {

    const { data, mutate, error } = useSWR(`variant-product/${id}`, fetcher, {
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

export function useVariantProduct(id) {

    const { data, mutate, error } = useSWR(`variant-product/${id}`, fetcher, {
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

export function useDatatable({id, page, limit, search, order = {}, conditions = {}}) {

    const url = `variant-product/datatable?id=${id}&page=${page}&limit=${limit}&search=${search}&order=${JSON.stringify(order)}&conditions=${JSON.stringify(conditions)}`

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

