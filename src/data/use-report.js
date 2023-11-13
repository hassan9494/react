import { datatable } from './use-data'
import axios from '../utility/axiosIsntance'
import useSWR from 'swr'

const fetcher = (url) => axios.get(url).then(res => res.data?.data)

export const api = {

    order: async (params) => {
        const { data } = await axios.get(`report/order?${params}`)
        console.log(data?.data)
        return data?.data
    }
}

export const productsOrder = {

    order: async (params) => {
        const { data } = await axios.get(`report/product-orders?${params}`)
        console.log(data?.data)
        return data?.data
    }
}

export const zemamApi = {

    order: async (params) => {
        const { data } = await axios.get(`report/zemam?${params}`)
        console.log(data?.data)
        return data?.data
    }
}

export const needsApi = {

    order: async (params) => {
        const { data } = await axios.get(`report/product-need?${params}`)
        console.log(data?.data)
        return data?.data
    }
}

export const outlayApi = {
    order: async (params) => {
        const { data } = await axios.get(`report/outlays?${params}`)
        return data?.data
    }
}

export const purchasesApi = {
    order: async (params) => {
        const { data } = await axios.get(`report/purchases?${params}`)
        return data?.data
    }
}

export const customsStatementApi = {
    order: async (params) => {
        const { data } = await axios.get(`report/customs-statement?${params}`)
        return data?.data
    }
}

export const deptsApi = {
    order: async (params) => {
        const { data } = await axios.get(`report/depts?${params}`)
        return data?.data
    }
}

export const stockApi = {
    order: async (params) => {
        const { data } = await axios.get(`report/product-stock?${params}`)
        return data?.data
    }
}

export function useProducts(params) {
    return datatable('report', `report/product-sales`, params)
}

export function useProduct(params) {
    return datatable('report', `report/product-sale`, params)
}

export function useStock(params) {
    return datatable('report', `report/product-stock`, params)
}

export function useNeed(params) {
    return datatable('report', `report/product-need`, params)
}

export function useSales(params) {
    return datatable('report', `product/sales`, params)
}

export function useOutlays(params) {
    const url = `report/outlays?${params}`

    const { data, error } = useSWR(url, fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshWhenOffline: false,
        refreshWhenHidden: false,
        refreshInterval: 0
    })
    const loading = !data?.data && !error

    return {
        loading,
        error,
        data
    }
}

export function usePurchases(params) {
    const url = `report/purchases?${params}`

    const { data, error } = useSWR(url, fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshWhenOffline: false,
        refreshWhenHidden: false,
        refreshInterval: 0
    })
    const loading = !data?.data && !error

    return {
        loading,
        error,
        data
    }
}

export function useCustomsStatements(params) {
    const url = `report/customs-statement?${params}`

    const { data, error } = useSWR(url, fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshWhenOffline: false,
        refreshWhenHidden: false,
        refreshInterval: 0
    })
    const loading = !data?.data && !error

    return {
        loading,
        error,
        data
    }
}


export function useOrders({params}) {

    const url = `report/order${params}`

    const { data, error } = useSWR(url, fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshWhenOffline: false,
        refreshWhenHidden: false,
        refreshInterval: 0
    })

    const loading = !data?.data && !error

    return {
        loading,
        error,
        data
    }
}
