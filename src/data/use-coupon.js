import useSWR from 'swr'
import { datatable, model, models, api as apiCalls } from './use-data'
import axios from "../utility/axiosIsntance"

const url = 'coupon'

const fetcher = (url) => axios.get(url).then(res => res.data?.data)

export const api = {
    create: params => apiCalls.create(url, params),
    update: (id, params) => apiCalls.update(url, id, params),
    delete: id => apiCalls.delete(url, id)
}

export function useModel(id) {
    return model(url, id)
}

export function useDatatable(params) {
    return datatable(url, `${url}/datatable`, params)
}

export function useModels() {
    return models(url)
}

// Create a new hook for valid coupons
export function useValidCoupons(params) {
    const { user_id, order_id, products } = params || {}

    // Build query string for the SWR key
    const queryParams = new URLSearchParams()
    if (user_id) queryParams.append('user_id', user_id)
    if (order_id) queryParams.append('order_id', order_id)
    if (products && Array.isArray(products)) {
        products.forEach((product, index) => {
            if (product.id) queryParams.append(`products[${index}][id]`, product.id)
            if (product.brand_id) queryParams.append(`products[${index}][brand_id]`, product.brand_id)
        })
    }

    const queryString = queryParams.toString()
    // Use the new endpoint that doesn't conflict
    const swrKey = queryString ? `coupons/check/valid?${queryString}` : null

    const { data, error, mutate } = useSWR(swrKey, fetcher, {
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
        mutate
    }
}