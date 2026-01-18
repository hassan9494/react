import { api as apiCalls, datatable, model } from './use-data'
import axios from "../utility/axiosIsntance"

const url = 'payment_method'

export const api = {
    create: params => apiCalls.create(url, params),
    update: (id, params) => apiCalls.update(url, id, params),
    delete: id => apiCalls.delete(url, id),
    index: async () => {
        const { data } = await axios.get(`${url}`)
        return data?.data
    }
}

export function useModel(id) {
    return model(url, id)
}

export function useDatatable(params) {
    return datatable(url, `${url}/datatable`, params)
}
