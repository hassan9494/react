import { api as apiCalls, datatable, table, model } from './use-data'

const url = 'course'

export const api = {
    create: params => apiCalls.create(url, params),
    update: (id, params) => apiCalls.update(url, id, params),
    delete: id => apiCalls.delete(url, id)
}

export function useModel(id) {
    const data = model(url, id)
    data.usePayments = params => table(`course/${id}/payments`, params)
    data.useStudents = params => table(`course/${id}/students`, params)
    return data
}

export function useDatatable(params) {
    return datatable(url, `${url}/datatable`, params)
}
