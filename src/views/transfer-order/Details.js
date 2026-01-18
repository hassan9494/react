// src/views/transfer-order/Details.js
import { Fragment, useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from '../../utility/axiosIsntance'
import ability from "../../configs/acl/ability"
import { useTransferOrder } from '@data/use-transfer-order'

// Components
import Breadcrumbs from '@components/breadcrumbs'
import TransferOrderStatus from './components/TransferOrderStatus'
import StockImpact from './components/StockImpact'

// Reactstrap Components
import {
    Row, Col, Card, CardBody, Button, Badge, Alert,
    Spinner, Table, CardHeader, CardTitle, Collapse
} from 'reactstrap'

// Icons
import {
    ArrowLeft, Edit, Package, Clock, User, CheckCircle,
    XCircle, AlertTriangle, Calendar, FileText,
    Hash, Clipboard, Box, ChevronUp, ChevronDown,
    ArrowRight, Database, RefreshCw, TrendingUp, TrendingDown, Printer,
    MapPin
} from 'react-feather'

export default function TransferOrderDetails() {
    // Hooks
    const { id } = useParams()
    const history = useHistory()
    const { data: transferOrderData, isLoading, refetch } = useTransferOrder(id)

    // State
    const [transferOrder, setTransferOrder] = useState(null)
    const [expandedSections, setExpandedSections] = useState({
        products: true,
        history: false,
        locationSummary: false // Added state for location summary
    })
    const [isProcessing, setIsProcessing] = useState(false)

    // Effects
    useEffect(() => {
        if (transferOrderData) {
            if (transferOrderData.data) {
                setTransferOrder(transferOrderData.data)
            } else {
                setTransferOrder(transferOrderData)
            }
        }
    }, [transferOrderData])

    // Helper Functions
    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleString()
    }

    const getStatusColor = (status) => {
        if (!status) return 'secondary'
        switch (status.toUpperCase()) {
            case 'PENDING': return 'warning'
            case 'COMPLETED': return 'success'
            default: return 'secondary'
        }
    }

    const getStatusIcon = (status) => {
        if (!status) return null
        switch (status.toUpperCase()) {
            case 'PENDING': return <AlertTriangle size={14} className="mr-1" />
            case 'COMPLETED': return <CheckCircle size={14} className="mr-1" />
            default: return null
        }
    }

    const getLocationLabel = (location) => {
        const labels = {
            stock_available: 'Stock Available',
            store_available: 'Store Available'
        }
        return labels[location] || location
    }

    const getLocationBadge = (location) => {
        switch (location) {
            case 'stock_available':
                return <Badge color="info" className="text-capitalize">Stock</Badge>
            case 'store_available':
                return <Badge color="warning" className="text-capitalize">Store</Badge>
            default:
                return <Badge color="secondary" className="text-capitalize">{location}</Badge>
        }
    }

    // Get location name based on location type
    const getLocationName = (product, locationType) => {
        if (!product) return 'N/A'

        if (locationType === 'stock_available') {
            return product.product_stock_location || 'Stock Location'
        } else if (locationType === 'store_available') {
            return product.product_location || 'Store Location'
        }
        return 'N/A'
    }

    const getSortedHistory = () => {
        if (!transferOrder?.histories) return []
        return [...transferOrder.histories].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }

    // Event Handlers
    const handleToggleStatus = async () => {
        if (!ability.can('read', 'transfer_order_complete')) {
            toast.error('You do not have permission to change transfer order status')
            return
        }

        setIsProcessing(true)
        try {
            const response = await axios.post(`/transfer-orders/${id}/toggle-status`)
            toast.success(
                transferOrder?.status === 'PENDING' ? 'Transfer order completed successfully' : 'Transfer order reverted to pending successfully'
            )
            refetch()
        } catch (error) {
            console.error('Toggle status error:', error)
            toast.error(error.response?.data?.message || 'Failed to update transfer order status')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleDelete = async () => {
        if (!ability.can('read', 'transfer_order_delete')) {
            toast.error('You do not have permission to delete transfer orders')
            return
        }

        if (window.confirm('Are you sure you want to delete this transfer order? This action cannot be undone!')) {
            setIsProcessing(true)
            try {
                await axios.delete(`/transfer-orders/${id}`)
                toast.success('Transfer order deleted successfully')
                history.push('/transfer-order/list')
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete transfer order')
            } finally {
                setIsProcessing(false)
            }
        }
    }

    // Loading State
    if (isLoading) {
        return (
            <Fragment>
                <Breadcrumbs breadCrumbTitle='Transfer Orders' breadCrumbActive='Transfer Details' />
                <div className="d-flex justify-content-center my-5">
                    <Spinner color="primary" />
                </div>
            </Fragment>
        )
    }

    // No Transfer Order Found
    if (!transferOrder) {
        return (
            <Fragment>
                <Breadcrumbs breadCrumbTitle='Transfer Orders' breadCrumbActive='Transfer Details' />
                <Alert color="danger">
                    Transfer order not found
                </Alert>
            </Fragment>
        )
    }

    // Data Processing
    const sortedHistory = getSortedHistory()

    return (
        <Fragment>
            <Breadcrumbs
                breadCrumbTitle='Transfer Orders'
                breadCrumbActive={` Details Transfer #${transferOrder.number}`}
            />

            <Card>
                <CardBody>
                    {/* Header Section */}
                    <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">
                                Details Transfer Order #{transferOrder.number}
                            </h4>
                            <div>
                                <Button
                                    color="secondary"
                                    onClick={() => history.push('/transfer-order/list')}
                                    className="mr-2"
                                >
                                    <ArrowLeft size={14} className="mr-1" />
                                    Back to List
                                </Button>

                            </div>
                        </div>
                    </div>

                    <Row>
                        {/* Main Content Column */}
                        <Col md={9} sm={12}>
                            {/* Order Information Card */}
                            <Card className="mb-1">
                                <CardBody>
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h5 className="mb-0 d-flex align-items-center">
                                            <Clipboard size={18} className="mr-2 text-primary" />
                                            Transfer Information
                                        </h5>
                                    </div>

                                    <Row>
                                        {/* Left Column - Transfer Details */}
                                        <Col md={6}>
                                            <div className="mb-2">
                                                <small className="text-muted d-block">Transfer Number</small>
                                                <div className="d-flex align-items-center">
                                                    <Hash size={14} className="mr-1 text-muted" />
                                                    <strong>{transferOrder.number}</strong>
                                                </div>
                                            </div>

                                            <div className="mb-2">
                                                <small className="text-muted d-block">Created By</small>
                                                <div className="d-flex align-items-center">
                                                    <User size={14} className="mr-1 text-muted" />
                                                    <span>{transferOrder.created_by?.name || 'System'}</span>
                                                </div>
                                            </div>

                                            <div className="mb-2">
                                                <small className="text-muted d-block">Created Date</small>
                                                <div className="d-flex align-items-center">
                                                    <Calendar size={14} className="mr-1 text-muted" />
                                                    <span>{formatDateTime(transferOrder.created_at)}</span>
                                                </div>
                                            </div>

                                            {transferOrder.approved_by && (
                                                <div className="mb-2">
                                                    <small className="text-muted d-block">Approved By</small>
                                                    <div className="d-flex align-items-center">
                                                        <User size={14} className="mr-1 text-success" />
                                                        <span>{transferOrder.approved_by?.name || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </Col>

                                        {/* Right Column - Status & Completion */}
                                        <Col md={6}>
                                            <div className="mb-2 d-flex ">
                                                <small className="text-muted d-block mr-1">Status</small>
                                                <div className="d-flex align-items-center">
                                                    <Badge
                                                        color={getStatusColor(transferOrder.status)}
                                                        className="py-1 px-3"
                                                    >
                                                        {transferOrder.status}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {transferOrder.completed_at && (
                                                <div className="mb-2">
                                                    <small className="text-muted d-block">Completed Date</small>
                                                    <div className="d-flex align-items-center">
                                                        <CheckCircle size={14} className="mr-1 text-success" />
                                                        <span>{formatDateTime(transferOrder.completed_at)}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Transfer Summary */}
                                            {transferOrder.summary && (
                                                <div className="mt-1">
                                                    <small className="text-muted d-block mb-2">Transfer Summary</small>
                                                    <div className="summary-cards">
                                                        <Row>
                                                            <Col sm={6} className="mb-2">
                                                                <div className="summary-card h-100">
                                                                    <div className="d-flex align-items-center">
                                                                        <div className="summary-value h4 mb-0 mr-3">
                                                                            {transferOrder.summary.total_products || 0}
                                                                        </div>
                                                                        <div className="summary-label text-muted small">
                                                                            Total Products
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                            <Col sm={6} className="mb-2">
                                                                <div className="summary-card h-100">
                                                                    <div className="d-flex align-items-center">
                                                                        <div className="summary-value h4 mb-0 mr-3">
                                                                            {transferOrder.summary.total_quantity || 0}
                                                                        </div>
                                                                        <div className="summary-label text-muted small">
                                                                            Total Quantity
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </div>
                                            )}
                                        </Col>
                                    </Row>

                                    {transferOrder.notes && (
                                        <div className="mt-4 pt-4 border-top">
                                            <small className="text-muted d-block mb-2">Notes</small>
                                            <div className="notes-container p-3 bg-light rounded">
                                                <div className="d-flex">
                                                    <FileText size={16} className="mr-2 text-muted mt-1" />
                                                    <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{transferOrder.notes}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardBody>
                            </Card>

                            {/* Products Section Card */}
                            <Card className="mb-4">
                                <CardHeader
                                    className="d-flex justify-content-between align-items-center cursor-pointer"
                                    onClick={() => toggleSection('products')}
                                >
                                    <CardTitle tag="h5" className="mb-0 d-flex align-items-center">
                                        <Package size={18} className="mr-2" />
                                        Products ({transferOrder.products?.length || 0})
                                    </CardTitle>
                                    <Button color="link" size="sm" className="p-0">
                                        {expandedSections.products ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </Button>
                                </CardHeader>
                                <Collapse isOpen={expandedSections.products}>
                                    <CardBody>
                                        {transferOrder.products && transferOrder.products.length > 0 ? (
                                            <div className="table-responsive">
                                                <Table bordered hover>
                                                    <thead className="thead-light">
                                                    <tr>
                                                        <th width="20%">Product</th>
                                                        <th width="15%">From</th>
                                                        <th width="15%">To</th>
                                                        <th width="10%">Quantity</th>
                                                        <th width="15%">Current Stock</th>
                                                        <th width="25%">Stock Impact</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {transferOrder.products.map((product, index) => {
                                                        // Get location names
                                                        const fromLocationName = getLocationName(product, product.from_location)
                                                        const toLocationName = getLocationName(product, product.to_location)

                                                        return (
                                                            <tr key={index}>
                                                                <td>
                                                                    <div className="d-flex align-items-center">
                                                                        {product.product_image ? (
                                                                            <img
                                                                                src={product.product_image}
                                                                                alt={product.product_name}
                                                                                className="rounded mr-2"
                                                                                style={{ width: 40, height: 40, objectFit: 'cover' }}

                                                                            />
                                                                        ) : (
                                                                            <div className="mr-2" style={{
                                                                                width: 40,
                                                                                height: 40,
                                                                                backgroundColor: '#f8f9fa',
                                                                                borderRadius: '4px'
                                                                            }}></div>
                                                                        )}
                                                                        <div>
                                                                            <a className="font-weight-bold"
                                                                               href={`${process.env.REACT_APP_WEBSITE}/product/${product.product_name.replace(/\s+/g, '-').toLowerCase()}`}
                                                                               target='_blank'
                                                                               rel="noopener noreferrer">
                                                                                {product.product_name}                                                                                </a>
                                                                            <small className="text-muted d-block">
                                                                                SKU: {product.product_sku}
                                                                            </small>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="text-center">
                                                                        <div className="mb-1">
                                                                            {getLocationBadge(product.from_location)}
                                                                        </div>
                                                                        <div className="small text-muted">
                                                                            <div className="d-flex align-items-center justify-content-center">
                                          <span className="text-truncate" style={{ maxWidth: '150px' }} title={fromLocationName}>
                                            {fromLocationName}
                                          </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="d-flex align-items-center justify-content-center flex-column">
                                                                        <div className="d-flex align-items-center mb-1">
                                                                            <ArrowRight size={14} className="mr-1 text-muted" />
                                                                            {getLocationBadge(product.to_location)}
                                                                        </div>
                                                                        <div className="small text-muted">
                                                                            <div className="d-flex align-items-center justify-content-center">
                                          <span className="text-truncate" style={{ maxWidth: '150px' }} title={toLocationName}>
                                            {toLocationName}
                                          </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="text-center font-weight-bold">
                                                                        {product.quantity}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="d-flex flex-column align-items-center">
                                                                        <div className="d-flex align-items-center mb-1">
                                                                            <span className='text-muted'>Stock:</span>
                                                                            <span className="font-weight-bold ml-1">
                                          {product.current_stock_available || 0}
                                        </span>
                                                                        </div>
                                                                        <div className="d-flex align-items-center mb-1">
                                                                            <span className='text-muted'>Store:</span>
                                                                            <span className="font-weight-bold ml-1">
                                          {product.current_store_available || 0}
                                        </span>
                                                                        </div>
                                                                        <div className="d-flex align-items-center">
                                                                            <span className='text-muted'>Σ:</span>
                                                                            <span className="font-weight-bold ml-1">
                                          {(product.current_stock_available || 0) + (product.current_store_available || 0)}
                                        </span>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <StockImpact
                                                                        product={product}
                                                                        transferOrderStatus={transferOrder.status}
                                                                        compact={true}
                                                                        showLabels={false}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        ) : (
                                            <div className="text-center p-5 border rounded bg-light">
                                                <Package size={48} className="text-muted mb-3" />
                                                <p className="text-muted">No products in this transfer</p>
                                            </div>
                                        )}


                                    </CardBody>
                                </Collapse>
                            </Card>

                            {/* History Section Card */}
                            <Card>
                                <CardHeader
                                    className="d-flex justify-content-between align-items-center cursor-pointer"
                                    onClick={() => toggleSection('history')}
                                >
                                    <CardTitle tag="h5" className="mb-0 d-flex align-items-center">
                                        <Clock size={18} className="mr-2" />
                                        History ({sortedHistory.length})
                                    </CardTitle>
                                    <Button color="link" size="sm" className="p-0">
                                        {expandedSections.history ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </Button>
                                </CardHeader>
                                <Collapse isOpen={expandedSections.history}>
                                    <CardBody>
                                        {sortedHistory.length > 0 ? (
                                            <div className="timeline">
                                                {sortedHistory.map((history, index) => (
                                                    <div key={index} className="timeline-item mb-3">
                                                        <div className="timeline-point"></div>
                                                        <div className="timeline-content">
                                                            <div className="d-flex justify-content-between align-items-start mb-1">
                                                                <div className="d-flex align-items-center">
                                                                    <User size={16} className="mr-2 text-primary" />
                                                                    <h6 className="mb-0">
                                                                        {history.action_label || history.action}
                                                                        {history.product && (
                                                                            <Badge color="info" className="ml-2">
                                                                                {history.product.name}
                                                                            </Badge>
                                                                        )}
                                                                    </h6>
                                                                </div>
                                                                <div className="text-right">
                                                                    <small className="text-muted d-block">
                                                                        {history.time_ago || new Date(history.created_at).toLocaleString()}
                                                                    </small>
                                                                    <small className="text-muted">
                                                                        {new Date(history.created_at).toLocaleString()}
                                                                    </small>
                                                                </div>
                                                            </div>

                                                            {/* Product Change Details */}
                                                            {history.is_product_change && (
                                                                <div className="product-change-details p-3 mb-2 bg-light rounded">
                                                                    <div className="d-flex align-items-start">
                                                                        {history.product?.image && (
                                                                            <img
                                                                                src={history.product.image}
                                                                                alt={history.product.name}
                                                                                className="rounded mr-3"
                                                                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                                            />
                                                                        )}
                                                                        <div className="flex-grow-1">
                                                                            <div className="mb-2">
                                                                                <strong>{history.change_description}</strong>
                                                                            </div>

                                                                            {/* Show detailed field changes */}
                                                                            {history.change_type === 'quantity' && history.old_value && history.new_value && (
                                                                                <div className="d-flex align-items-center text-muted small">
                                            <span className="text-danger mr-2">
                                                <strong>Old:</strong> {history.old_value.quantity || history.old_value}
                                            </span>
                                                                                    <ArrowRight size={12} className="mx-2" />
                                                                                    <span className="text-success">
                                                <strong>New:</strong> {history.new_value.quantity || history.new_value}
                                            </span>
                                                                                </div>
                                                                            )}

                                                                            {history.change_type === 'from_location' && history.old_value && history.new_value && (
                                                                                <div className="d-flex align-items-center text-muted small">
                                                                                    <Badge color="warning" className="mr-2">
                                                                                        From: {history.getLocationLabel ? history.getLocationLabel(history.old_value.from_location || history.old_value) : (history.old_value.from_location || history.old_value)}
                                                                                    </Badge>
                                                                                    <ArrowRight size={12} className="mx-2" />
                                                                                    <Badge color="info">
                                                                                        To: {history.getLocationLabel ? history.getLocationLabel(history.new_value.from_location || history.new_value) : (history.new_value.from_location || history.new_value)}
                                                                                    </Badge>
                                                                                </div>
                                                                            )}

                                                                            {history.change_type === 'to_location' && history.old_value && history.new_value && (
                                                                                <div className="d-flex align-items-center text-muted small">
                                                                                    <Badge color="warning" className="mr-2">
                                                                                        From: {history.getLocationLabel ? history.getLocationLabel(history.old_value.to_location || history.old_value) : (history.old_value.to_location || history.old_value)}
                                                                                    </Badge>
                                                                                    <ArrowRight size={12} className="mx-2" />
                                                                                    <Badge color="info">
                                                                                        To: {history.getLocationLabel ? history.getLocationLabel(history.new_value.to_location || history.new_value) : (history.new_value.to_location || history.new_value)}
                                                                                    </Badge>
                                                                                </div>
                                                                            )}

                                                                            {/* Product added/removed details */}
                                                                            {(history.action === 'product_added' || history.action === 'product_removed') && history.new_value && (
                                                                                <div className="mt-2 small">
                                                                                    <div className="row">
                                                                                        <div className="col-6">
                                                                                            <strong>Product:</strong> {history.new_value.product_name || history.parsed_new_value?.product_name}
                                                                                        </div>
                                                                                        <div className="col-3">
                                                                                            <strong>SKU:</strong> {history.new_value.product_sku || history.parsed_new_value?.product_sku}
                                                                                        </div>
                                                                                        <div className="col-3">
                                                                                            <strong>Qty:</strong> {history.new_value.quantity || history.parsed_new_value?.quantity}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="row mt-1">
                                                                                        <div className="col-6">
                                                                                            <strong>From:</strong> {history.getLocationLabel ? history.getLocationLabel(history.new_value.from_location || history.parsed_new_value?.from_location) : (history.new_value.from_location || history.parsed_new_value?.from_location)}
                                                                                        </div>
                                                                                        <div className="col-6">
                                                                                            <strong>To:</strong> {history.getLocationLabel ? history.getLocationLabel(history.new_value.to_location || history.parsed_new_value?.to_location) : (history.new_value.to_location || history.parsed_new_value?.to_location)}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <p className="mb-1 text-muted small">
                                                                By: {history.user?.name || 'System'}
                                                            </p>
                                                            {history.notes && !history.is_product_change && (
                                                                <div className="mb-2 p-2 bg-light rounded">
                                                                    <strong>Note:</strong> {history.notes}
                                                                </div>
                                                            )}

                                                            {/* Standard field changes */}
                                                            {(history.field && history.old_value && history.new_value && !history.is_product_change) && (
                                                                <div className="changes-container p-2 bg-white rounded border">
                                                                    {history.field && (
                                                                        <div className="mb-1">
                                                                            <strong>Field:</strong> {history.field}
                                                                        </div>
                                                                    )}
                                                                    {history.old_value && (
                                                                        <div className="mb-1">
                                                                            <strong>From:</strong> {typeof history.old_value === 'object' ? JSON.stringify(history.old_value) : history.old_value}
                                                                        </div>
                                                                    )}
                                                                    {history.new_value && (
                                                                        <div>
                                                                            <strong>To:</strong> {typeof history.new_value === 'object' ? JSON.stringify(history.new_value) : history.new_value}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center p-5">
                                                <Clock size={48} className="text-muted mb-3" />
                                                <p className="text-muted">No history available for this transfer order</p>
                                            </div>
                                        )}
                                    </CardBody>
                                </Collapse>
                            </Card>
                        </Col>

                        {/* Sidebar Column */}
                        <Col md={3} sm={12}>
                            {/* Quick Actions Card */}
                            <Card className="">
                                <CardBody>
                                    <h6 className="mb-2">Quick Actions</h6>
                                    <div className="d-flex flex-column">
                                        {transferOrder.can_edit && ability.can('read', 'transfer_order_edit') && (
                                            <Button
                                                color="primary"
                                                onClick={() => history.push(`/transfer-order/edit/${id}`)}
                                                className="mb-2"
                                                block
                                            >
                                                <Edit size={14} className="mr-1" />
                                                Edit Transfer
                                            </Button>
                                        )}

                                        {transferOrder.can_complete && ability.can('read', 'transfer_order_complete') && (
                                            <Button
                                                color="success"
                                                onClick={handleToggleStatus}
                                                className="mb-2"
                                                block
                                                disabled={isProcessing}
                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <Spinner size="sm" className="mr-1" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle size={14} className="mr-1" />
                                                        Complete Transfer
                                                    </>
                                                )}
                                            </Button>
                                        )}

                                        {transferOrder.can_revert && ability.can('read', 'transfer_order_complete') && (
                                            <Button
                                                color="warning"
                                                onClick={handleToggleStatus}
                                                className="mb-2"
                                                block
                                                disabled={isProcessing}
                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <Spinner size="sm" className="mr-1" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <RefreshCw size={14} className="mr-1" />
                                                        Revert to Pending
                                                    </>
                                                )}
                                            </Button>
                                        )}

                                        <Button
                                            color="secondary"
                                            onClick={() => window.open(`/transfer-order/print/${id}`, '_blank', 'noopener,noreferrer')}
                                            className="mb-2"
                                            block
                                            outline
                                        >
                                            <Printer size={14} className="mr-1" />
                                            Print Transfer
                                        </Button>
                                    </div>

                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </CardBody>
            </Card>

            <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
        }
        .timeline {
          position: relative;
          padding-left: 20px;
        }
        .timeline-item {
          position: relative;
          padding-left: 20px;
        }
        .timeline-point {
          position: absolute;
          left: 0;
          top: 5px;
          width: 12px;
          height: 12px;
          background-color: #7367f0;
          border-radius: 50%;
        }
        .timeline-content {
          margin-left: 10px;
        }
        .changes-container {
          border-left: 3px solid #7367f0;
        }
        
        /* New Styles for Transfer Summary */
        .summary-cards {
          margin-top: 0.5rem;
        }
        
        .summary-card {
          background: linear-gradient(135deg, #f8f9fa 0%, #fff 100%);
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 1rem;
          transition: all 0.3s ease;
        }
        
        .summary-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }
        
        .summary-icon {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .bg-primary-light {
          background-color: rgba(115, 103, 240, 0.1);
        }
        
        .bg-success-light {
          background-color: rgba(40, 199, 111, 0.1);
        }
        
        .summary-value {
          color: #2c304d;
          font-weight: 600;
        }
        
        .summary-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .notes-container {
          background: linear-gradient(135deg, #f8f9fa 0%, #f1f3f4 100%);
          border-left: 4px solid #7367f0;
        }
        
        .status-indicator {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Text truncation for location names */
        .text-truncate {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        /* Location summary cards */
        .card.border {
          border-color: #dee2e6 !important;
        }
        
        .card.border:hover {
          border-color: #7367f0 !important;
        }
      `}</style>
        </Fragment>
    )
}