// src/views/reports/product-purchases/product-purchases.js
import { Fragment, useState, useEffect } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useProductPurchases } from '@data/use-purchases-report'
import Filters from './purchase-filters'
import moment from 'moment'
import { useParams } from "react-router-dom"
import { Badge, Card, CardBody, Alert } from "reactstrap"
import { useProduct } from '@data/use-product' // Assuming you have a product hook
import { useSources } from '@data/use-source'
const Tables = () => {
    const { id } = useParams()
    const [dateRange, setDateRange] = useState({})
    const [refreshKey, setRefreshKey] = useState(0)


    // Fetch product details
    const { data: product, loading: productLoading, error: productError } = useProduct(id)

    // Fetch sources using your existing hook
    const { data: sourcesData, loading: sourcesLoading } = useSources()

    // Convert sources array to lookup object
    const sourcesMap = {}
    sourcesData?.forEach(source => {
        sourcesMap[source.id] = source.name
    })
    const onFiltersChange = (filters) => {
        setDateRange(filters)
        setRefreshKey(prev => prev + 1)
    }

    const useProductPurchasesWithRefresh = (params) => {
        const result = useProductPurchases({
            ...params,
            product_id: id,
            dateRange
        })
        return { ...result, refreshKey }
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Reports' breadCrumbActive='Product Purchases' />

            {/* Product Information Card */}
            {product && (
                <Card className='mb-2'>
                    <CardBody className='pb-1'>
                        <div className='d-flex justify-content-between align-items-center'>
                            <div>
                                <h4 className='font-weight-bold'>{product.name}</h4>
                                <div className='text-muted'>
                                    <small>SKU: {product.sku}</small>
                                    {product.source_sku && (
                                        <small className='ml-2'>Source SKU: {product.source_sku}</small>
                                    )}
                                    <small  className='ml-2'>Location: {product.location} / {product.stock_location}</small>
                                </div>
                            </div>
                            <div className='text-right'>
                                <div className='text-muted'>
                                    <small>Current Stock: <strong>{product.stock || 0}</strong></small>
                                </div>
                            </div>

                        </div>
                    </CardBody>
                </Card>
            )}

            {productError && (
                <Alert color='danger' className='mb-2'>
                    Error loading product details: {productError.message}
                </Alert>
            )}

            <Filters onChange={onFiltersChange} />

            <Datatable
                useDatatable={useProductPurchasesWithRefresh}
                dateRange={dateRange}
                header={false}
                columns={[
                    {
                        name: 'Invoice Number',
                        selector: 'invoice_number',
                        sortable: true,
                        minWidth: '150px',
                        cell: row => (
                            <div>
                                <a
                                    className='text-dark font-weight-bold'
                                    href={`${process.env.REACT_APP_ADMIN_APP_WEBSITE}/invoice/edit/${row.invoice_id}`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    {row.invoice_number}
                                </a>
                            </div>
                        )
                    },
                    {
                        name: 'Invoice Date',
                        selector: 'invoice_date',
                        sortable: true,
                        minWidth: '120px',
                        cell: row => moment(row.invoice_date).format('Y-MM-DD')
                    },
                    {
                        name: 'invoice Name',
                        selector: 'invoice_name',
                        sortable: true,
                        minWidth: '200px'
                    },
                    {
                        name: 'Source',
                        selector: 'source_id',
                        sortable: true,
                        minWidth: '150px',
                        cell: row => (
                            <span>
                                {sourcesMap[row.source_id] || `${row.source_id}`}
                            </span>
                        )
                    },
                    {
                        name: 'Quantity',
                        selector: 'quantity',
                        sortable: true,
                        minWidth: '100px',
                        cell: row => <span className='font-weight-bold'>{row.quantity}</span>
                    },
                    {
                        name: 'Purchase Price',
                        selector: 'purchases_price',
                        sortable: true,
                        minWidth: '150px',
                        cell: row => `$${Number.parseFloat(row.purchases_price).toFixed(2)}`
                    },
                    {
                        name: 'Total Amount',
                        selector: 'total_amount',
                        sortable: true,
                        minWidth: '150px',
                        cell: row => `$${Number.parseFloat(row.total_amount).toFixed(2)}`
                    }
                ]}
            />
        </Fragment>
    )
}

export default Tables
