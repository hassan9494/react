import useSWR from 'swr'
import axios from '../utility/axiosIsntance'

const fetcher = (url) => axios.get(url).then(res => res.data?.data)

export const api = {

    create: async (params) => {
        const { data } = await axios.post('send-email', params)
        return data?.data
    }
}

export function useCategory() {

    const { data, mutate, error } = useSWR(`send-email`, fetcher)

    const loading = !data && !error

    return {
        loading,
        error,
        data,
        mutate,
        create: async (params) => api.create(params)
    }
}

