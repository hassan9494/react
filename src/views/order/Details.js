import { Fragment, useState, useEffect, useMemo } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import { useHistory, useParams } from 'react-router-dom'
import { Card, CardBody, Row, Col, Badge, Button, Collapse, Alert } from 'reactstrap'
import {
    ArrowLeft, RefreshCw, ChevronDown, ChevronUp, Clock, User,
    FileText, DollarSign, Truck, Settings, Package, Edit, Info,
    Printer, PlusCircle, MinusCircle, ShoppingCart, Eye, Download
} from 'react-feather'
import { useOrder } from '@data/use-order'

const OrderDetails = () => {
    const history = useHistory()
    const { id } = useParams()
    const { data: order, isLoading, mutate } = useOrder(id)
    const [orderInfo, setOrderInfo] = useState(null)
    const [expandedSections, setExpandedSections] = useState({
        history: false,
        orderInfo: false,
        products: false,
        editViews: false
    })

    const [historyFilter, setHistoryFilter] = useState('all')

    // Add this function to handle filter changes
    const handleFilterChange = (filter) => {
        setHistoryFilter(filter)
    }

    // Filter out duplicate status entries AND exclude viewed_edit actions
    const filteredHistories = useMemo(() => {
        if (!orderInfo?.histories) return []

        // First filter out viewed_edit actions
        const historiesWithoutViews = orderInfo.histories.filter(history => history.action !== 'viewed_edit'
        )

        // Then filter based on the selected filter type
        const filtered = historiesWithoutViews.filter(history => {
            if (historyFilter === 'status') {
                return history.field === 'status'
            } else if (historyFilter === 'options') {
                return history.field === 'options' ||
                    (history.field && history.field.startsWith('options.'))
            } else if (historyFilter === 'printed') {
                return history.action === 'printed'
            } else if (historyFilter === 'exported') {
                return history.action === 'exported'
            }
            return true // 'all' filter
        })

        // For status changes, only show status_changed actions
        return filtered.filter(history => {
            // If it's a status field and it's an 'updated' action, hide it
            if (history.field === 'status' && history.action === 'updated') {
                return false
            }

            // For all updates, check if values actually changed
            if (history.action === 'updated') {
                try {
                    // Parse JSON values if they appear to be JSON
                    const oldVal = typeof history.old_value === 'string' &&
                    history.old_value.trim().startsWith('{') ? JSON.parse(history.old_value) : history.old_value

                    const newVal = typeof history.new_value === 'string' &&
                    history.new_value.trim().startsWith('{') ? JSON.parse(history.new_value) : history.new_value

                    // Compare values
                    if (JSON.stringify(oldVal) === JSON.stringify(newVal)) {
                        return false // Skip if values are the same
                    }
                } catch (e) {
                    // If parsing fails, do simple string comparison
                    if (history.old_value === history.new_value) {
                        return false // Skip if values are the same
                    }
                }
            }
            // Show all other history items
            return true
        })
    }, [orderInfo?.histories, historyFilter])

    // Format key names to be more readable
    const formatKeyName = (key) => {
        const keyMap = {
            // Customer fields
            'customer.name': 'Customer Name',
            'customer.phone': 'Customer Phone',
            'customer.email': 'Customer Email',
            customer_identity_number: 'Identity Number',
            identity_number_type: 'ID Type',

            // Shipping fields
            'shipping.address': 'Shipping Address',
            'shipping.cost': 'Shipping Cost',
            'shipping.status': 'Shipping Status',
            'shipping.free': 'Free Shipping',
            'shipping.city': 'Shipping City',
            shipping_provider_id: 'Shipping Provider',

            // Options fields
            'options.taxed': 'Taxed',
            'options.tax_exempt': 'M3fe',
            'options.dept': 'Zemam',
            'options.price_offer': 'Price Offer',
            'options.tax_zero': 'Tax Zero',
            'options.pricing': 'Pricing Type',

            // Order fields
            status: 'Status',
            discount: 'Discount Amount',
            discount_percentage: 'Discount Percentage',
            subtotal: 'Subtotal',
            total: 'Total',
            profit: 'Profit',
            notes: 'Notes',
            invoice_notes: 'Invoice Notes',
            tax_number: 'Tax Number',
            coupon_id: 'Coupon',

            // Product fields
            products: 'Products',

            // Default formatting for unknown keys
            _default: key.replace(/_/g, ' ').replace(/\./g, ' > ').replace(/\b\w/g, l => l.toUpperCase())
        }

        return keyMap[key] || keyMap['_default']
    }

    // Toggle section expansion
    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    // Format values based on their type and key
    const formatValue = (key, value) => {
        if (value === null || value === undefined || value === 'null') {
            return <span className="text-muted">N/A</span>
        }

        if (typeof value === 'boolean') {
            return value ? <Badge color="success">Yes</Badge> : <Badge color="danger">No</Badge>
        }

        if (typeof value === 'object') {
            try {
                if (Array.isArray(value)) {
                    return `Array(${value.length})`
                }
                return JSON.stringify(value)
            } catch (e) {
                return 'Invalid data'
            }
        }

        if (key.includes('cost') || key.includes('price') || key.includes('total') || key.includes('subtotal') || key.includes('discount') || key.includes('profit')) {
            return <Badge color="light-success">${parseFloat(value).toFixed(2)}</Badge>
        }

        if (key === 'status') {
            const statusColors = {
                PENDING: 'warning',
                PROCESSING: 'info',
                COMPLETED: 'success',
                CANCELED: 'danger'
            }
            return <Badge color={`light-${statusColors[value] || 'secondary'}`}>{value}</Badge>
        }

        if (key === 'identity_number_type') {
            const typeMap = {
                NIN: 'National ID',
                PN: 'Passport',
                TN: 'Tax Number'
            }
            return typeMap[value] || value
        }

        return value.toString()
    }

    // Function to format date and time properly
    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A'

        const date = new Date(dateString)
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    }

    // Get icon based on action type
    const getActionIcon = (action) => {
        switch (action) {
            case 'updated': return <Edit size={16} />
            case 'status_changed': return <Settings size={16} />
            case 'created': return <FileText size={16} />
            case 'printed': return <Printer size={16} />
            case 'quantity_updated': return <Package size={16} />
            case 'product_added': return <PlusCircle size={16} />
            case 'product_removed': return <MinusCircle size={16} />
            case 'shipping_updated': return <Truck size={16} />
            case 'payment_updated': return <DollarSign size={16} />
            case 'exported': return <Download size={16} />
            default: return <Info size={16} />
        }
    }

    // Parse JSON values safely
    const safeJsonParse = (value) => {
        if (typeof value === 'object') return value
        if (value === null || value === undefined) return value

        try {
            return JSON.parse(value)
        } catch (e) {
            return value
        }
    }

    // Get product name from history
    const getProductNameFromHistory = (history, orderProducts) => {
        // Try to extract product name from notes
        if (history.notes) {
            const productNameMatch = history.notes.match(/Product: ([^]+?)( was| quantity|$)/)
            if (productNameMatch && productNameMatch[1]) {
                return productNameMatch[1]
            }

            const productIdMatch = history.notes.match(/Product ID: (\d+)/)
            if (productIdMatch && productIdMatch[1]) {
                const productId = productIdMatch[1]
                const product = orderProducts.find(p => p.id === productId)
                return product ? product.name : `Product ${productId}`
            }
        }

        // Try to extract product ID from field
        if (history.field && history.field.startsWith('products.') && history.field.endsWith('.quantity')) {
            const productId = history.field.replace('products.', '').replace('.quantity', '')
            const product = orderProducts.find(p => p.id === productId)
            return product ? product.name : `Product ${productId}`
        }

        return 'Product'
    }

    // Compare two JSON objects and return only the changed fields
    const compareObjects = (oldObj, newObj) => {
        if (typeof oldObj !== 'object' || typeof newObj !== 'object') {
            return []
        }

        const allKeys = [...new Set([...Object.keys(oldObj || {}), ...Object.keys(newObj || {})])]
        const changes = []

        allKeys.forEach(key => {
            const oldVal = oldObj?.[key]
            const newVal = newObj?.[key]

            // Handle null/undefined comparisons
            if (oldVal !== newVal && !(oldVal === null && newVal === null)) {
                changes.push({
                    field: key,
                    oldValue: oldVal,
                    newValue: newVal
                })
            }
        })

        return changes
    }

    // Format object changes for display
    const renderObjectChanges = (field, oldValue, newValue) => {
        try {
            const oldObj = typeof oldValue === 'string' ? JSON.parse(oldValue) : oldValue
            const newObj = typeof newValue === 'string' ? JSON.parse(newValue) : newValue

            const changes = compareObjects(oldObj, newObj)

            return changes.map((change, index) => {
                const displayField = formatKeyName(`${field}.${change.field}`)
                const displayOldValue = formatValue(change.field, change.oldValue)
                const displayNewValue = formatValue(change.field, change.newValue)

                return (
                    <div key={index} className="change-item mb-2">
                        <Badge color="light-primary" className="mr-1">Changed:</Badge>
                        <strong>{displayField}</strong>
                        {change.oldValue === null || change.oldValue === undefined ? (
                            <> set to {displayNewValue}</>
                        ) : (
                            <> changed from {displayOldValue} to {displayNewValue}</>
                        )}
                    </div>
                )
            })
        } catch (e) {
            // Fallback if JSON parsing fails
            return (
                <div className="change-item mb-2">
                    <Badge color="light-primary" className="mr-1">Changed:</Badge>
                    <strong>{formatKeyName(field)}</strong> changed
                </div>
            )
        }
    }

    // Render history details
    const renderHistoryDetails = (history) => {
        // Handle status changes
        if (history.field === 'status') {
            if (history.action === 'status_changed') {
                return (
                    <div className="change-item">
                        <Badge color="light-info" className="mr-1">Status:</Badge>
                        Changed from {history.old_value} to {history.new_value}
                    </div>
                )
            }
            // Don't show updated status actions
            return null
        }

        // Handle product additions and removals
        if (history.action === 'product_added') {
            const productName = getProductNameFromHistory(history, orderInfo.products)
            const quantity = history.new_value || 1

            return (
                <div className="change-item">
                    <Badge color="light-success" className="mr-1">Added:</Badge>
                    {productName} was added with quantity {quantity}
                </div>
            )
        }

        if (history.action === 'product_removed') {
            const productName = getProductNameFromHistory(history, orderInfo.products)

            return (
                <div className="change-item">
                    <Badge color="light-danger" className="mr-1">Removed:</Badge>
                    {productName} was removed
                </div>
            )
        }

        // Handle quantity updates
        if (history.action === 'quantity_updated') {
            const productName = getProductNameFromHistory(history, orderInfo.products)

            return (
                <div className="change-item">
                    <Badge color="light-info" className="mr-1">Quantity:</Badge>
                    {productName} quantity changed from {history.old_value} to {history.new_value}
                </div>
            )
        }

        // Handle print actions
        if (history.action === 'printed') {
            return (
                <div className="change-item">
                    <Badge color="light-secondary" className="mr-1">Printed:</Badge>
                    Order was printed by {history.user ? history.user.name : 'System'}
                    {history.created_at && ` at ${formatDateTime(history.created_at)}`}
                </div>
            )
        }

        if (history.action === 'exported') {
            return (
                <div className="change-item">
                    <Badge color="light-info" className="mr-1">Exported:</Badge>
                    Order was exported to Excel by {history.user ? history.user.name : 'System'}
                    {history.created_at && ` at ${formatDateTime(history.created_at)}`}
                </div>
            )
        }

        // Handle object changes (options, shipping, customer)
        if (history.field && (history.field === 'options' || history.field === 'shipping' || history.field === 'customer')) {
            return renderObjectChanges(history.field, history.old_value, history.new_value)
        }

        // Handle product quantity changes
        if (history.field && history.field.startsWith('products.') && history.field.endsWith('.quantity')) {
            const productName = history.notes?.replace('Product: ', '').replace(/ quantity changed from \d+ to \d+/, '') || 'Product'
            const oldQty = history.old_value
            const newQty = history.new_value

            if (oldQty === 0) {
                return (
                    <div className="change-item">
                        <Badge color="light-success" className="mr-1">Added:</Badge>
                        {productName} was added with quantity {newQty}
                    </div>
                )
            } else if (newQty === 0) {
                return (
                    <div className="change-item">
                        <Badge color="light-danger" className="mr-1">Removed:</Badge>
                        {productName} was removed
                    </div>
                )
            } else {
                return (
                    <div className="change-item">
                        <Badge color="light-info" className="mr-1">Quantity:</Badge>
                        {productName} quantity changed from {oldQty} to {newQty}
                    </div>
                )
            }
        }

        // Handle simple field changes
        if (history.field && history.old_value !== undefined && history.new_value !== undefined) {
            const displayField = formatKeyName(history.field)
            const displayOldValue = formatValue(history.field, history.old_value)
            const displayNewValue = formatValue(history.field, history.new_value)

            return (
                <div className="change-item mb-2">
                    <Badge color="light-primary" className="mr-1">Changed:</Badge>
                    <strong>{displayField}</strong>
                    {history.old_value === null || history.old_value === undefined ? (
                        <> set to {displayNewValue}</>
                    ) : (
                        <> changed from {displayOldValue} to {displayNewValue}</>
                    )}
                </div>
            )
        }

        // Fallback for old history entries
        if (history.details) {
            try {
                const details = typeof history.details === 'string' ? JSON.parse(history.details) : history.details
                return renderDetailedChanges(details)
            } catch (e) {
                return <div className="text-muted">Change details: {history.details}</div>
            }
        }

        return <div className="text-muted">No change details available</div>
    }

    // Render edit views section
    const renderEditViews = (histories) => {
        const editViews = histories.filter(h => h.action === 'viewed_edit')

        if (editViews.length === 0) {
            return (
                <div className="text-center p-3">
                    <p className="text-muted">No one has viewed the order edit page yet</p>
                </div>
            )
        }

        return (
            <div className="timeline">
                {editViews.map((history, index) => (
                    <div key={index} className="timeline-item mb-3">
                        <div className="timeline-point"></div>
                        <div className="timeline-content">
                            <div className="d-flex justify-content-between align-items-start mb-1">
                                <div className="d-flex align-items-center">
                                    <span className="timeline-icon mr-2">
                                        <Eye size={16} />
                                    </span>
                                    <h6 className="mb-0">Viewed Edit Page</h6>
                                </div>
                                <small className="text-muted">{formatDateTime(history.created_at)}</small>
                            </div>
                            <p className="mb-0 text-muted">
                                <User size={14} className="mr-1" />
                                Viewed by: {history.user ? history.user.name : 'Unknown User'}
                            </p>
                            {history.notes && (
                                <div className="mt-1 p-2 bg-light rounded small">
                                    {history.notes}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    // Function to refresh order data
    const refreshOrderData = async () => {
        try {
            await mutate()
        } catch (error) {
            console.error('Error refreshing order data:', error)
        }
    }

    useEffect(() => {
        if (order) {
            setOrderInfo(order)
        }
    }, [order])

    if (isLoading) return <div className="d-flex justify-content-center my-5"><div className="spinner-border text-primary" role="status"></div></div>
    if (!orderInfo) return <div className="alert alert-danger my-4">Order not found</div>

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Order Details' breadCrumbActive={`Order #${orderInfo.number}`} />

            {/* Edit Views Section */}
            <Card className="mb-4 section-card">
                <CardBody className="p-0">
                    <div
                        className="d-flex justify-content-between align-items-center p-3 section-header"
                        onClick={() => toggleSection('editViews')}
                    >
                        <h5 className="mb-0 d-flex align-items-center">
                            <Eye size={18} className="mr-2" />Order Views
                        </h5>
                        {expandedSections.editViews ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                    <Collapse isOpen={expandedSections.editViews}>
                        <div className="p-3">
                            {renderEditViews(orderInfo.histories || [])}
                        </div>
                    </Collapse>
                </CardBody>
            </Card>

            <Card className="order-details-card">
                <CardBody className="p-4">
                    {/* Header with navigation and actions */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <Button
                            color='light'
                            onClick={() => history.goBack()}
                            className="d-flex align-items-center back-button"
                        >
                            <ArrowLeft size={16} className="mr-1" /> Back to Orders
                        </Button>

                        <div className="d-flex flex-column align-items-end">
                            <div className=" small">
                                <strong>Created:</strong> {formatDateTime(orderInfo.created_at)}
                            </div>
                            <div className=" small">
                                <strong>Updated:</strong> {formatDateTime(orderInfo.updated_at)}
                            </div>
                        </div>
                    </div>
                    {/* Order Info Section */}
                    <Card className="mb-4 section-card">
                        <CardBody className="p-0">
                            <div
                                className="d-flex justify-content-between align-items-center p-3 section-header"
                                onClick={() => toggleSection('orderInfo')}
                            >
                                <h5 className="mb-0 d-flex align-items-center">
                                    <Info size={18} className="mr-2" /> Order Information
                                </h5>
                                {expandedSections.orderInfo ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </div>
                            <Collapse isOpen={expandedSections.orderInfo}>
                                <div className="p-3">
                                    <Row>
                                        <Col md="6">
                                            <div className="info-item mb-2">
                                                <strong>Order Number:</strong> {orderInfo.number}
                                            </div>
                                            <div className="info-item mb-2">
                                                <strong>Status:</strong> {formatValue('status', orderInfo.status)}
                                            </div>
                                            <div className="info-item mb-2">
                                                <strong>Customer Name:</strong> {orderInfo.customer?.name || 'N/A'}
                                            </div>
                                            <div className="info-item mb-2">
                                                <strong>Customer Phone:</strong> {orderInfo.customer?.phone || 'N/A'}
                                            </div>
                                        </Col>
                                        <Col md="6">
                                            <div className="info-item mb-2">
                                                <strong>Shipping Cost:</strong>
                                                {orderInfo.shipping?.free ? <Badge color="success" className="ml-1">Free</Badge> : formatValue('cost', orderInfo.shipping?.cost)
                                                }
                                            </div>
                                            <div className="info-item mb-2">
                                                <strong>Total Amount:</strong> {formatValue('total', orderInfo.total)}
                                            </div>
                                            <div className="info-item mb-2">
                                                <strong>Tax Number:</strong> {orderInfo.tax_number || 'N/A'}
                                            </div>
                                            {/* Add this below the Tax Number info item */}
                                            <div className="info-item mb-2">
                                                <strong>Options:</strong>
                                                <div className="d-flex flex-wrap mt-1">
                                                    {orderInfo.options?.dept && (
                                                        <Badge color="warning" className="mr-1 mb-1">Zemam</Badge>
                                                    )}
                                                    {orderInfo.options?.price_offer && (
                                                        <Badge color="info" className="mr-1 mb-1">Price Offer</Badge>
                                                    )}
                                                    {orderInfo.options?.tax_exempt && (
                                                        <Badge color="success" className="mr-1 mb-1">M3fe</Badge>
                                                    )}
                                                    {orderInfo.options?.tax_zero && (
                                                        <Badge color="primary" className="mr-1 mb-1">Tax Zero</Badge>
                                                    )}
                                                    {orderInfo.options?.taxed && (
                                                        <Badge color="danger" className="mr-1 mb-1">Taxed</Badge>
                                                    )}
                                                    {!orderInfo.options?.dept &&
                                                    !orderInfo.options?.price_offer &&
                                                    !orderInfo.options?.tax_exempt &&
                                                    !orderInfo.options?.tax_zero &&
                                                    !orderInfo.options?.taxed && (
                                                        <span className="text-muted">No options enabled</span>
                                                    )}
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Collapse>
                        </CardBody>
                    </Card>

                    {/* Order History Section */}
                    <Card className="mb-4 section-card">
                        <CardBody className="p-0">
                            <div
                                className="d-flex justify-content-between align-items-center p-3 section-header"
                                onClick={() => toggleSection('history')}
                            >

                                <h5 className="mb-0 d-flex align-items-center">
                                    <Clock size={18} className="mr-2" /> Order History
                                </h5>

                                {expandedSections.history ? <ChevronUp size={18} /> : <ChevronDown size={18} />}

                            </div>


                            <Collapse isOpen={expandedSections.history}>
                                <div className="pb-3 px-3 pt-1 ">
                                    <div className="d-flex align-items-center justify-content-center pb-2 ">
                                        <div className="btn-group btn-group-sm filter-buttons " onClick={(e) => e.stopPropagation()}></div>
                                        <Button
                                            color={historyFilter === 'all' ? 'primary' : 'light'}
                                            size="sm"
                                            onClick={() => handleFilterChange('all')}
                                            className="mx-1"
                                        >
                                            All Changes
                                        </Button>
                                        <Button
                                            color={historyFilter === 'status' ? 'primary' : 'light'}
                                            size="sm"
                                            onClick={() => handleFilterChange('status')}
                                            className="mx-1"
                                        >
                                            Status
                                        </Button>
                                        <Button
                                            color={historyFilter === 'options' ? 'primary' : 'light'}
                                            size="sm"
                                            onClick={() => handleFilterChange('options')}
                                            className="mx-1"
                                        >
                                            Options
                                        </Button>
                                        <Button
                                            color={historyFilter === 'printed' ? 'primary' : 'light'}
                                            size="sm"
                                            onClick={() => handleFilterChange('printed')}
                                            className="mx-1"
                                        >
                                            Printed
                                        </Button>
                                        <Button
                                            color={historyFilter === 'exported' ? 'primary' : 'light'}
                                            size="sm"
                                            onClick={() => handleFilterChange('exported')}
                                            className="mx-1"
                                        >
                                            Exported
                                        </Button>

                                    </div>
                                    {filteredHistories && filteredHistories.length > 0 ? (
                                        <div className="timeline">
                                            {filteredHistories.map((history, index) => (
                                                <div key={index} className="timeline-item mb-4">
                                                    <div className="timeline-point"></div>
                                                    <div className="timeline-content">
                                                        <div className="d-flex justify-content-between align-items-start mb-1">
                                                            <div className="d-flex align-items-center">
                                                                <span className="timeline-icon mr-2">
                                                                    {getActionIcon(history.action)}
                                                                </span>
                                                                <h6 className="mb-0 text-capitalize">{history.action.replace(/_/g, ' ')}</h6>
                                                            </div>
                                                            <small className="text-muted">{formatDateTime(history.created_at)}</small>
                                                        </div>
                                                        <p className="mb-1 text-muted">
                                                            <User size={14} className="mr-1" />
                                                            {history.user ? `By: ${history.user.name}` : 'System Action'}
                                                        </p>
                                                        {history.notes && (
                                                            <div className="mb-2 p-2 bg-light rounded">
                                                                <strong>Note:</strong> {history.notes}
                                                            </div>
                                                        )}
                                                        <div className="changes-container mt-2 p-2 bg-light rounded">
                                                            {renderHistoryDetails(history)}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center p-3">
                                            <p className="text-muted">No order history available</p>
                                        </div>
                                    )}
                                </div>
                            </Collapse>
                        </CardBody>
                    </Card>

                    {/* Products Section */}
                    <Card className="mb-4 section-card">
                        <CardBody className="p-0">
                            <div
                                className="d-flex justify-content-between align-items-center p-3 section-header"
                                onClick={() => toggleSection('products')}
                            >
                                <h5 className="mb-0 d-flex align-items-center">
                                    <ShoppingCart size={18} className="mr-2" /> Products
                                </h5>
                                {expandedSections.products ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </div>
                            <Collapse isOpen={expandedSections.products}>
                                <div className="p-3">
                                    {orderInfo.products && orderInfo.products.length > 0 ? (
                                        <div className="table-responsive">
                                            <table className="table table-striped">
                                                <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th>SKU</th>
                                                    <th>Quantity</th>
                                                    <th>Price</th>
                                                    <th>Total</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {orderInfo.products.map((product, index) => (
                                                    <tr key={index}>
                                                        <td>{product.name}</td>
                                                        <td>{product.sku}</td>
                                                        <td>{product.quantity}</td>
                                                        <td>{formatValue('price', product.price)}</td>
                                                        <td>{formatValue('total', product.price * product.quantity)}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center p-3">
                                            <p className="text-muted">No products in this order</p>
                                        </div>
                                    )}
                                </div>
                            </Collapse>
                        </CardBody>
                    </Card>
                </CardBody>
            </Card>

            <style jsx>{`
                .order-details-card {
                    border: none;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                }
                
                .back-button {
                    border-radius: 8px;
                    padding: 8px 16px;
                    font-weight: 500;
                }
                
                .action-buttons .btn {
                    border-radius: 8px;
                    padding: 8px 16px;
                    font-weight: 500;
                }
                
                .section-card {
                    border: none;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                }
                
                .section-header {
                    cursor: pointer;
                    background-color: #f8f9fa;
                    border-radius: 10px 10px 0 0;
                    transition: background-color 0.2s ease;
                }
                
                .section-header:hover {
                    background-color: #e9ecef;
                }
                
                .info-item {
                    padding: 8px 0;
                    border-bottom: 1px solid #f1f1f1;
                }
                
                .timeline {
                    position: relative;
                    padding-left: 30px;
                }

                .timeline-item {
                    position: relative;
                    margin-bottom: 20px;
                }

                .timeline-point {
                    position: absolute;
                    left: -30px;
                    top: 5px;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background-color: #133695;
                }

                .timeline-content {
                    padding: 10px;
                    border-left: 2px solid #133695;
                    margin-left: 10px;
                }
                
                .timeline-icon {
                    color: #133695;
                }
                
                .change-item {
                    font-size: 0.9rem;
                }
                
                .changes-container {
                    border-left: 3px solid #133695;
                }
                
                @media (max-width: 768px) {
                    .timeline {
                        padding-left: 20px;
                    }
                    
                    .timeline-point {
                        left: -20px;
                        width: 10px;
                        height: 10px;
                    }
                }
            `}</style>
        </Fragment>
    )
}

export default OrderDetails
