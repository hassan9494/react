import { datatable, model, models, api as apiCalls } from './use-data'
import axios from '../utility/axiosIsntance'

const url = 'file'

export const api = {
    create: params => apiCalls.create(url, params),
    update: async (id, params) =>  {
        const formData = new FormData()
        formData.append('name', params.name)
        formData.append('file', params.file[0])
        formData.append('_method', 'PUT')
        const { data } = await axios.post(`${url}/${id}`, formData)
        return data?.data
    },
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
