import useSWR from 'swr'
import axios from '../utility/axiosIsntance'
import { datatable, model, api as apiCalls } from "./use-data"

const fetcher = (url) => axios.get(url).then(res => res.data?.data)

const url = 'user'

export const api = {
    create: params => apiCalls.create(url, params),
    update: (id, params) => apiCalls.update(url, id, params),
    delete: id => apiCalls.delete(url, id),
    autocomplete: async (q) => {
        const { data } = await axios.get(`${url}/autocomplete?q=${q}`)
        return data?.data
    },
    autocompleteUserForTaxExempt: async (q) => {
        const { data } = await axios.get(`${url}/autocompleteUserForTaxExempt?q=${q}`)
        return data?.data
    },
    autocompleteCashier: async (q) => {
        const { data } = await axios.get(`${url}/autocompletecashier?q=${q}`)
        return data?.data
    },
    autocompleteTaxExempt: async (q) => {
        const { data } = await axios.get(`${url}/autocompleteTaxExempt?q=${q}`)
        return data?.data
    },
    changePassword: async (id, params) => {
        const { data } = await axios.post(`${url}/${id}/change-password`, params)
        return data?.data
    },
    verificationEmail: async (id) => {
        const { data } = await axios.post(`${url}/${id}/verification-email`)
        return data?.data
    }
}

export function useModel(id) {
    return model(url, id)
}

export function useDatatable(params) {
    const result = datatable(url, `${url}/datatable`, params)

    result.mutates = {
        ...result.mutates,
        verificationEmail: api.verificationEmail
    }

    return result
}

export function useEmployeeDatatable(params) {
    const result = datatable(url, `${url}/employee`, params)

    result.mutates = {
        ...result.mutates,
        verificationEmail: api.verificationEmail
    }

    return result
}

