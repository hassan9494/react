// src/data/use-purchases-report.js
import { datatable } from './use-data'
import axios from '../utility/axiosIsntance'
import useSWR from 'swr'

const fetcher = (url) => axios.get(url).then(res => res.data?.data)

export const api = {
    purchases: async (params) => {
        const { data } = await axios.get(`report/purchases-by-product?${params}`)
        return data?.data
    },
    productPurchases: async (params) => {
        const { data } = await axios.get(`report/product-purchases?${params}`)
        return data?.data
    }
}

export function usePurchasesReport(params) {
    const { dateRange, ...otherParams } = params

    // Build URL with proper date parameters
    const queryParams = new URLSearchParams({
        ...otherParams,
        from: dateRange?.from || '',
        to: dateRange?.to || ''
    }).toString()

    const url = `report/purchases-by-product?${queryParams}`

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

export function useProductPurchases(params) {
    const { product_id, dateRange, ...otherParams } = params

    // Build URL with proper parameters including product_id and dates
    const queryParams = new URLSearchParams({
        ...otherParams,
        product_id: product_id || '',
        from: dateRange?.from || '',
        to: dateRange?.to || ''
    }).toString()

    const url = `report/product-purchases?${queryParams}`

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