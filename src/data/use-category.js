import useSWR from 'swr'
import axios from '../utility/axiosIsntance'

const fetcher = (url) => axios.get(url).then(res => res.data?.data)

export const api = {

    create: async (params) => {
        const { data } = await axios.post('category', params)
        return data?.data
    },

    update: async (id, params) => {
        const { data } = await axios.put(`category/${id}`, params)
        return data?.data
    },

    delete: async (id) => {
        await axios.delete(`category/${id}`)
    }
}

export function useCategory(id) {

    const { data, mutate, error } = useSWR(`category/${id}`, fetcher)

    const loading = !data && !error

    return {
        loading,
        error,
        data,
        mutate,
        update: async (params) => api.update(id, params)
    }
}

export function useCategories() {

    const { data, mutate, error } = useSWR('category', fetcher)

    const loading = !data && !error

    return {
        loading,
        error,
        data: data || [],
        mutate,
        create: async (params) => api.create(params)
    }
}
export function useParentCategories() {

    const { data, mutate, error } = useSWR('parent-category', fetcher)

    const loading = !data && !error

    return {
        loading,
        error,
        data: data || [],
        mutate,
        create: async (params) => api.create(params)
    }
}

export function useCategoryDatatable({ page, limit, search, order = {}, conditions = {} }) {

    const url = `category/datatable?page=${page}&limit=${limit}&search=${search}&order=${JSON.stringify(order)}&conditions=${JSON.stringify(conditions)}`

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
export function useSubCategoryDatatable({ page, limit, search, order = {}, conditions = {}}) {

    const url = `sub-category/datatable?page=${page}&limit=${limit}&search=${search}&order=${JSON.stringify(order)}&conditions=${JSON.stringify(conditions)}`

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

