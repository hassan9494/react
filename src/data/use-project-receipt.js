import { api as apiCalls, datatable, model } from './use-data'

const url = 'project-receipt'

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
