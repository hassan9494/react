import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_ADMIN_API
    /* other custom settings */
})

// Add a request interceptor
axiosInstance.interceptors.request.use(config => {
    // Do something before request is sent
    let auth = {}
    const contentType = config.data instanceof FormData ? 'multipart/form-data' : 'application/json'
    try {
        auth = JSON.parse(localStorage.getItem('auth') || '')
        config.headers = {
            Authorization: `Bearer ${auth?.token}`,
            Accept: 'application/json',
            'Content-Type': contentType
        }
    } catch (e) {
    }
    return config
}, error => {
    // Do something with request error
    return Promise.reject(error)
})

export default axiosInstance
