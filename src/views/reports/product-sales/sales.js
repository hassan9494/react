import { Fragment, React, useState, useEffect } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useSales } from '@data/use-report'
import Filters from './sales-filter'
import moment from 'moment'
import { useParams } from "react-router-dom"
import { Badge, Card, CardBody, Alert } from "reactstrap"
import Repeater from "../../../@core/components/repeater"
import { useProduct } from '@data/use-product' // Import product hook
import axios from '../../../utility/axiosIsntance' // Fixed - using the correct filename with typo

const Tables = () => {
    const { id } = useParams()
    console.log(id)

    // Fetch product details
    const [product, setProduct] = useState(null)
    const [productLoading, setProductLoading] = useState(false)
    const [productError, setProductError] = useState(null)

    // Fetch product details on component mount
    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return

            setProductLoading(true)
            try {
                const response = await axios.get(`product/${id}`)
                setProduct(response.data?.data)
            } catch (error) {
                setProductError(error)
                console.error('Error fetching product:', error)
            } finally {
                setProductLoading(false)
            }
        }

        fetchProduct()
    }, [id])

    const fixedConditions = [
        {
            product: 'products.id', id: { id }.id
        },
        {
            col: 'status', op:'in', val: ['COMPLETED', 'PROCESSING']
        }
    ]

    const [conditions, setConditions] = useState([...fixedConditions])

    const onFiltersChange = (filters) => {
        const updated = [...fixedConditions]
        if (filters.from) updated.push({ col: 'taxed_at', op: '>=', val: filters.from })
        if (filters.oldTo) updated.push({ col: 'taxed_at', op: '<=', val: moment(filters.oldTo).add(1, 'days').format('Y-MM-DD') })
        if (filters.status) updated.push({ col: 'status', val: filters.status })
        if (filters.exempt) updated.push({ col: 'options->tax_exempt', val: filters.exempt })
        setConditions(updated)
    }

    const conditionalRowStyles = [
        {
            when: row => row?.products?.length > 1,
            style: {
                minHeight: '100px'
            }
        }
    ]

    // Function to get badge color based on status
    const getStatusBadge = (status) => {
        switch (status) {
            case 'COMPLETED':
                return 'light-success'
            case 'PROCESSING':
                return 'light-warning'
            default:
                return 'light-secondary'
        }
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Reports' breadCrumbActive='Product Sales' />

            {/* Product Information Section */}
            {productLoading && (
                <Card className='mb-2'>
                    <CardBody>
                        <div className='text-center'>
                            <small className='text-muted'>Loading product details...</small>
                        </div>
                    </CardBody>
                </Card>
            )}

            {product && (
                <Card className='mb-2'>
                    <CardBody className='pb-1'>
                        <div className='d-flex justify-content-between align-items-center'>
                            <div>
                                <h4 className='font-weight-bold mb-1'>{product.name}</h4>
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
                useDatatable={useSales}
                conditions={conditions}
                header={false}
                conditionalRowStyles={conditionalRowStyles}
                columns={[
                    {
                        name: 'Number',
                        selector: 'number',
                        sortable: true,
                        minWidth: '300px',
                        sortField: 'id',
                        cell: row => (
                            <div>
                                <a className='text-dark' href={`${process.env.REACT_APP_ADMIN_APP_WEBSITE}/order/edit/${row.number}`} target='_blank'>{row.number}</a>
                            </div>
                        )
                    },
                    {
                        name: 'Status',
                        selector: 'status',
                        sortable: true,
                        minWidth: '120px',
                        cell: row => (
                            <Badge color={getStatusBadge(row.status)} pill>
                                {row.status}
                            </Badge>
                        )
                    },
                    {
                        name: 'Date',
                        selector: 'taxed_at',
                        sortable: true,
                        minWidth: '100px',
                        cell: row => moment(row.taxed_at).format('Y-MM-DD')
                    },
                    {
                        name: 'Customer Name',
                        selector: 'customer.name',
                        sortable: true,
                        sortField: 'customer->name',
                        minWidth: '100px'
                    },
                    {
                        name: 'Customer Phone',
                        selector: 'customer.phone',
                        sortField: 'customer->phone',
                        sortable: true,
                        minWidth: '100px'
                    },
                    {
                        name: 'Quantity',
                        selector: 'products',
                        sortField: 'customer->phone',
                        sortable: true,
                        minWidth: '100px',
                        style: { height: 'auto!important' },
                        allowOverflow: true,
                        wrap: true,
                        cell: (row) => {
                            // Find the product with the matching ID
                            const product = row.products.find(product => product.id.toString() === id.toString())

                            // If found, display its quantity; otherwise, display 0
                            return (
                                <div className='d-flex justify-content-between'>
                                    {product ? (
                                        <span className='font-weight-bold'>{product.quantity}</span>
                                    ) : (
                                        <span>0</span>
                                    )}
                                </div>
                            )
                        }
                    },
                    {
                        name: 'Total',
                        selector: 'total',
                        sortable: true,
                        minWidth: '100px',
                        cell: row => `$${Number.parseFloat(row?.total || 0).toFixed(2)}`
                    }
                ]}
            />
        </Fragment>
    )
}

export default Tables
