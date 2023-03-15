import { api as apiCalls, datatable, model, table } from './use-data'

const url = 'project'

export const api = {
    create: params => apiCalls.create(url, params),
    update: (id, params) => apiCalls.update(url, id, params),
    delete: id => apiCalls.delete(url, id)
}

export function useModel(id) {
    const data = model(url, id)
    data.usePayments = params => table(`project/${id}/payments`, params)
    return data
}

export function useDatatable(params) {
    return datatable(url, `${url}/datatable`, params)
}
