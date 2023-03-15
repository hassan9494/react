import { datatable } from './use-data'
import axios from '../utility/axiosIsntance'
import useSWR from 'swr'

const fetcher = (url) => axios.get(url).then(res => res.data?.data)

export const api = {
    order: async (params) => {
        const { data } = await axios.get(`report/order?${params}`)
        return data?.data
    }
}

export function useProducts(params) {
    return datatable('report', `report/product-sales`, params)
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
