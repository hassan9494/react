import { useState, useEffect } from 'react'
import { api as stockAdjustmentApi } from './use-stock-adjustment'
import { showError } from '../utility/Utils'

export const useStockAdjustmentDatatable = ({
                                                page,
                                                limit,
                                                search,
                                                order,
                                                conditions,
                                                dateRange,
                                                // New parameter to filter by current user if not admin
                                                filterByCurrentUser = false,
                                                currentUserId = null
                                            }) => {
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const [mutateTrigger, setMutateTrigger] = useState(0)

    const fetchData = async () => {
        try {
            setLoading(true)

            const params = {
                page: page + 1,
                limit,
                search: search || '',
                start_date: dateRange?.startDate || '',
                end_date: dateRange?.endDate || ''
            }

            // Handle status filter
            if (conditions?.status && conditions.status !== 'all') {
                params.status = conditions.status
            }

            // Handle user filter
            if (conditions?.user_id) {
                params.user_id = conditions.user_id
            }

            // Filter by current user if needed (for non-admin users in Request page)
            if (filterByCurrentUser && currentUserId) {
                params.user_id = currentUserId
            }

            // Remove empty params
            Object.keys(params).forEach(key => {
                if (params[key] === '' || params[key] === null || params[key] === undefined) {
                    delete params[key]
                }
            })

            const result = await stockAdjustmentApi.getAllRequests(params)

            setData(result?.items || [])
            setTotal(result?.total || 0)
        } catch (error) {
            console.error('Error loading adjustments:', error)
            showError(`Failed to load adjustments: ${error.response?.data?.message || error.message}`)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [page, limit, search, order, conditions, dateRange, mutateTrigger, filterByCurrentUser, currentUserId])

    const mutates = {
        refetch: () => {
            setMutateTrigger(prev => prev + 1)
        }
    }

    return {
        data,
        total,
        mutates,
        loading
    }
}
