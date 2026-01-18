import { api as apiCalls, datatable, model } from './use-data'
import axios from "../utility/axiosIsntance"
import useSWR from "swr"

const url = 'transaction'
const fetcher = (url) => axios.get(url).then(res => res.data?.data)

export const api = {
    create: params => apiCalls.create(url, params),
    update: (id, params) => apiCalls.update(url, id, params),
    delete: id => apiCalls.delete(url, id),
    index: async () => {
        const { data } = await axios.get(`${url}`)
        return data?.data
    },
    totals: async () => {
        const { data } = await axios.get(`${url}/totals`)
        return data?.data
    },
    filteredTotals: async (params) => {
        const { data } = await axios.get(`${url}/filteredTotals?${params}`)
        return data
    }
}

export function useModel(id) {
    return model(url, id)
}

export function useDatatable(params) {
    return datatable(url, `${url}/datatable`, params)
}

export function useDatatableForDeleted({ page, limit, search, order = {}}) {

    const url = `deletedTransaction/datatable?page=${page}&limit=${limit}&search=${search}&order=${JSON.stringify(order)}`

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