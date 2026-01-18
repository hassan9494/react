// src/views/reports/product-purchases/index.js
import { Fragment, useState, useEffect } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { usePurchasesReport } from '@data/use-purchases-report'
import Filters from './filters'
import Avatar from '@components/avatar'
import actions from './actions'
import moment from 'moment'

const Tables = () => {

    const [dateRange, setDateRange] = useState({})
    const [refreshKey, setRefreshKey] = useState(0)

    const onFiltersChange = (filters) => {
        setDateRange(filters)
        // Force refresh when filters change
        setRefreshKey(prev => prev + 1)
    }

    // Custom hook call with refresh key to force re-fetch
    const usePurchasesWithRefresh = (params) => {
        const result = usePurchasesReport(params)
        // This will re-fetch when refreshKey changes
        return { ...result, refreshKey }
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Reports' breadCrumbActive='product Purchases' />
            <Filters onChange={onFiltersChange} />
            <Datatable
                useDatatable={usePurchasesWithRefresh}
                header={false}
                actions={actions}
                dateRange={dateRange}
                columns={[
                    {
                        name: 'Product',
                        selector: 'product_name',
                        sortable: true,
                        minWidth: '400px',
                        cell: row => (
                            <div className='d-flex align-items-center'>
                                <Avatar img={row.product_image} className='mr-2'/>
                                <div>
                                    <div className='font-weight-bold'>{row.product_name}</div>
                                    <small className='text-muted'>SKU: {row.product_sku}</small>
                                </div>
                            </div>
                        )
                    },
                    {
                        name: 'Last Purchase',
                        selector: 'latest_invoice_date',
                        sortable: true,
                        minWidth: '150px',
                        cell: row => (row.latest_invoice_date ? moment(row.latest_invoice_date).format('Y-MM-DD') : 'Never')
                    },
                    {
                        name: 'Total Quantity',
                        selector: 'total_quantity',
                        sortable: true,
                        minWidth: '120px',
                        cell: row => <span className='font-weight-bold'>{row.total_quantity}</span>
                    },
                    {
                        name: 'Avg. Purchase Price',
                        selector: 'avg_purchase_price',
                        sortable: true,
                        minWidth: '150px',
                        cell: row => `$${Number.parseFloat(row.avg_purchase_price).toFixed(2)}`
                    },
                    {
                        name: 'Total Amount',
                        selector: 'total_amount',
                        sortable: true,
                        minWidth: '150px',
                        cell: row => `$${Number.parseFloat(row.total_amount).toFixed(2)}`
                    },
                    {
                        name: 'Invoices Count',
                        selector: 'invoices_count',
                        sortable: true,
                        minWidth: '130px',
                        cell: row => (
                            <span className='badge badge-light-primary'>{row.invoices_count}</span>
                        )
                    }
                ]}
            />
        </Fragment>
    )
}

export default Tables