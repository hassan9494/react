import axios from '../utility/axiosIsntance'

const url = 'stats'

export const api = {
    sales: async (params) => {
        const { data } = await axios.get(`${url}/sales`)
        return data?.data
    }
}
