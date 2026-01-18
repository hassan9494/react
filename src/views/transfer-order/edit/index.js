// src/views/transfer-order/edit/index.js
import { Fragment, useState, useEffect, useRef } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import {
    Row,
    Col,
    Button,
    Card,
    CardBody,
    Spinner,
    Alert,
    FormGroup,
    Label,
    Input,
    Badge,
    Table,
    CardHeader,
    Collapse
} from 'reactstrap'
import { useHistory, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Save, X, ArrowLeft, AlertTriangle, Package, Trash2, RefreshCw, BarChart2, CheckCircle, ArrowRight, Database, ChevronDown } from 'react-feather'
import AsyncSelect from 'react-select/async/dist/react-select.esm'
import { useTransferOrder } from '@data/use-transfer-order'
import TransferOrderStatus from '../components/TransferOrderStatus'
import StockImpact from '../components/StockImpact'
import ability from "../../../configs/acl/ability"
import axios from '../../../utility/axiosIsntance'
import { api as productApi } from '@data/use-product'
import { showError, showSuccess } from '../../../utility/Utils'

export default function EditTransferOrder() {
    const { id } = useParams()
    const history = useHistory()
    const { data: transferOrderData, isLoading, refetch } = useTransferOrder(id)
    const [transferOrder, setTransferOrder] = useState(null)
    const [loaded, setLoaded] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [products, setProducts] = useState([])
    const [notes, setNotes] = useState('')
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [loading, setLoading] = useState(false)
    const [stockErrors, setStockErrors] = useState({})
    const [defaultOptions, setDefaultOptions] = useState([])
    const optionsCache = useRef(new Map())

    // Add to the existing state declarations (around line 33)
    const [bulkSectionOpen, setBulkSectionOpen] = useState(true)
    const [bulkFromLocation, setBulkFromLocation] = useState('stock_available')
    const [bulkToLocation, setBulkToLocation] = useState('store_available')

    const canEdit = ability.can('read', 'transfer_order_edit')
    const canComplete = ability.can('read', 'transfer_order_complete')
    const canCancel = ability.can('read', 'transfer_order_cancel')

    useEffect(() => {
        if (transferOrderData) {
            if (transferOrderData.data) {
                setTransferOrder(transferOrderData.data)
            } else {
                setTransferOrder(transferOrderData)
            }
        }
    }, [transferOrderData])

    // Load initial product options
    const loadInitialOptions = async () => {
        const cacheKey = 'initial'
        if (optionsCache.current.has(cacheKey)) {
            setDefaultOptions(optionsCache.current.get(cacheKey))
            return
        }

        try {
            const data = await productApi.autocomplete('')
            const options = data.map((product) => {
                const stockValue = product.stock || product.current_stock || product.quantity || 0
                const stockAvailable = product.stock_available || product.current_stock_available || 0
                const storeAvailable = product.store_available || product.current_store_available || 0
                const skuValue = product.sku || 'N/A'
                const productName = product.name || 'Unknown Product'
                const imageUrl = product.image || '/static/images/placeholder.png'

                return {
                    label: (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img
                                src={imageUrl}
                                alt={productName}
                                height="32"
                                width="32"
                                style={{ marginRight: '10px', borderRadius: '4px' }}
                            />
                            <div>
                                <div style={{ fontWeight: 'bold' }}>{productName}</div>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                    SKU: {skuValue} | Stock: {stockValue} | Stock Avail: {stockAvailable}
                                </div>
                            </div>
                        </div>
                    ),
                    value: product.id,
                    item: {
                        ...product,
                        id: product.id,
                        stock: stockValue,
                        stock_available: stockAvailable,
                        store_available: storeAvailable,
                        name: productName,
                        sku: skuValue,
                        image: imageUrl,
                        location: product.location || 'N/A',
                        stock_location: product.stock_location || 'N/A'
                    }
                }
            })

            optionsCache.current.set(cacheKey, options)
            setDefaultOptions(options)
        } catch (error) {
            console.error('Failed to load initial options:', error)
            setDefaultOptions([])
        }
    }

    // Promise options for AsyncSelect
    const promiseOptions = async (inputValue) => {
        const cacheKey = inputValue || 'empty'
        if (optionsCache.current.has(cacheKey)) {
            return optionsCache.current.get(cacheKey)
        }

        try {
            setLoading(true)
            const data = await productApi.autocomplete(inputValue)
            const options = data.map((product) => {
                const stockValue = product.stock || product.current_stock || product.quantity || 0
                const stockAvailable = product.stock_available || product.current_stock_available || 0
                const storeAvailable = product.store_available || product.current_store_available || 0
                const skuValue = product.sku || 'N/A'
                const productName = product.name || 'Unknown Product'
                const imageUrl = product.image || '/static/images/placeholder.png'

                return {
                    label: (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img
                                src={imageUrl}
                                alt={productName}
                                height="32"
                                width="32"
                                style={{ marginRight: '10px', borderRadius: '4px' }}
                            />
                            <div>
                                <div style={{ fontWeight: 'bold' }}>{productName}</div>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                    SKU: {skuValue} | Stock: {stockValue} | Stock Avail: {stockAvailable}
                                </div>
                            </div>
                        </div>
                    ),
                    value: product.id,
                    item: {
                        ...product,
                        id: product.id,
                        stock: stockValue,
                        stock_available: stockAvailable,
                        store_available: storeAvailable,
                        name: productName,
                        sku: skuValue,
                        image: imageUrl,
                        location: product.location || 'N/A',
                        stock_location: product.stock_location || 'N/A'
                    }
                }
            })

            optionsCache.current.set(cacheKey, options)
            return options
        } catch (error) {
            console.error('Failed to load options:', error)
            return []
        } finally {
            setLoading(false)
        }
    }

    // Get product details with stock information
    const getProductDetails = async (productId) => {
        try {
            const product = await productApi.show(productId)

            let stockAvailable = product.stock_available
            let storeAvailable = product.store_available

            if (stockAvailable === null || stockAvailable === undefined ||
                storeAvailable === null || storeAvailable === undefined) {
                try {
                    const stockResponse = await axios.get(`/products/${productId}/stock`)
                    if (stockResponse.data && stockResponse.data.data) {
                        stockAvailable = stockResponse.data.data.stock_available || 0
                        storeAvailable = stockResponse.data.data.store_available || 0
                    }
                } catch (stockError) {
                    console.log('No separate stock endpoint, using fallback values')
                    stockAvailable = product.stock_available || product.stock || 0
                    storeAvailable = product.store_available || 0
                }
            }

            return {
                ...product,
                id: product.id,
                stock: product.stock || 0,
                stock_available: stockAvailable,
                store_available: storeAvailable,
                name: product.name || 'Unknown Product',
                sku: product.sku || 'N/A',
                image: product.image || '/static/images/placeholder.png',
                location: product.location || 'N/A',
                stock_location: product.stock_location || 'N/A'
            }
        } catch (error) {
            console.error('Error getting product details:', error)
            throw error
        }
    }

    const validateStock = (productsList) => {
        const errors = {}
        productsList.forEach((product, index) => {
            if (product.product) {
                const availableStock = product.from_location === 'stock_available' ? (product.product.stock_available || 0) : (product.product.store_available || 0)

                if (parseInt(product.quantity || 0) > availableStock) {
                    errors[index] = `Insufficient stock. Available: ${availableStock}`
                }
            }
        })
        setStockErrors(errors)
        return Object.keys(errors).length === 0
    }


    const applyBulkLocation = () => {
        if (bulkFromLocation === bulkToLocation) {
            showError('From and To locations cannot be the same')
            return
        }

        setProducts(prev => {
            const updated = prev.map(product => {
                const availableStock = bulkFromLocation === 'stock_available' ? (product.product?.stock_available || 0) : (product.product?.store_available || 0)

                let quantity = product.quantity
                if (parseInt(quantity) > availableStock) {
                    quantity = availableStock > 0 ? availableStock : 1
                    showError(`Quantity adjusted to ${quantity} for ${product.product?.name} due to insufficient stock in ${bulkFromLocation}`)
                }

                return {
                    ...product,
                    from_location: bulkFromLocation,
                    to_location: bulkToLocation,
                    quantity
                }
            })

            validateStock(updated)
            return updated
        })

        showSuccess(`Applied locations to all products`)
    }

// Swap bulk locations
    const swapBulkLocations = () => {
        const temp = bulkFromLocation
        setBulkFromLocation(bulkToLocation)
        setBulkToLocation(temp)
    }
    // Handle product selection
    const handleProductSelect = async (selectedOption) => {
        if (selectedOption) {
            const existingProduct = products.find(p => p.product_id === selectedOption.value)
            if (existingProduct) {
                showError('Product already added to transfer list')
                setSelectedProduct(null)
                return
            }

            try {
                const productData = await getProductDetails(selectedOption.value)

                const newProduct = {
                    product_id: selectedOption.value,
                    product: productData,
                    from_location: bulkFromLocation,
                    to_location: bulkToLocation,
                    quantity: 1
                }

                setProducts(prev => [...prev, newProduct])
                setSelectedProduct(null)

                showSuccess(`Added ${productData.name} to transfer list`)
                validateStock([...products, newProduct])
            } catch (error) {
                console.error('Error in handleProductSelect:', error)
                showError('Failed to load product details. Please try again.')

                const newProduct = {
                    product_id: selectedOption.value,
                    product: {
                        ...selectedOption.item,
                        stock_available: selectedOption.item.stock || 0,
                        store_available: 0
                    },
                    from_location: bulkFromLocation,
                    to_location: bulkToLocation,
                    quantity: 1
                }
                setProducts(prev => [...prev, newProduct])
                setSelectedProduct(null)
                validateStock([...products, newProduct])
                showError('Product added with estimated stock values. Please verify.')
            }
        }
    }

    // Load form data
    useEffect(() => {
        if (!loaded && transferOrder) {
            setLoaded(true)
            setNotes(transferOrder.notes || '')

            // Format products from transferOrder
            if (transferOrder.products && transferOrder.products.length > 0) {
                const formattedProducts = transferOrder.products.map(p => ({
                    product_id: p.product_id,
                    product: {
                        id: p.product_id,
                        name: p.product_name,
                        sku: p.product_sku,
                        image: p.product_image,
                        stock_available: p.current_stock_available || 0,
                        store_available: p.current_store_available || 0,
                        location: p.product_location || 'N/A',
                        stock_location: p.product_stock_location || 'N/A'
                    },
                    from_location: p.from_location || 'stock_available',
                    to_location: p.to_location || 'store_available',
                    quantity: p.quantity || 1,
                    // Include stock history if available
                    stock_available_before: p.stock_available_before,
                    stock_available_after: p.stock_available_after,
                    store_available_before: p.store_available_before,
                    store_available_after: p.store_available_after,
                    stock_before: p.stock_before,
                    stock_after: p.stock_after,
                    // Include current values for display
                    current_stock_available: p.current_stock_available || 0,
                    current_store_available: p.current_store_available || 0,
                    location: p.product_location || 'N/A',
                    stock_location: p.product_stock_location || 'N/A'
                }))
                setProducts(formattedProducts)
                validateStock(formattedProducts)
            }
        }
    }, [transferOrder, loaded])

    const handleProductChange = (index, field, value) => {
        setProducts(prev => {
            const updated = [...prev]
            updated[index][field] = value

            if (field === 'from_location') {
                if (value === updated[index].to_location) {
                    updated[index].to_location = value === 'stock_available' ? 'store_available' : 'stock_available'
                }
            } else if (field === 'to_location') {
                if (value === updated[index].from_location) {
                    showError('From and To locations cannot be the same')
                    return prev
                }
            } else if (field === 'quantity') {
                const numValue = parseInt(value) || 1

                if (numValue < 1) {
                    updated[index][field] = 1
                    return updated
                }

                const availableStock = updated[index].from_location === 'stock_available' ? (updated[index].product?.stock_available || 0) : (updated[index].product?.store_available || 0)

                if (numValue > availableStock) {
                    showError(`Cannot transfer more than available stock (${availableStock}) for ${updated[index].product?.name}`)
                    updated[index][field] = availableStock > 0 ? availableStock : 1
                } else {
                    updated[index][field] = numValue
                }
            }

            validateStock(updated)
            return updated
        })
    }

    // Refresh product stock
    const refreshProductStock = async (index) => {
        try {
            const product = products[index]
            const updatedProduct = await getProductDetails(product.product_id)

            setProducts(prev => {
                const updated = [...prev]
                updated[index].product = {
                    ...updated[index].product,
                    ...updatedProduct
                }

                const availableStock = updated[index].from_location === 'stock_available' ? (updatedProduct.stock_available || 0) : (updatedProduct.store_available || 0)
                const currentQuantity = parseInt(updated[index].quantity || 0)

                if (currentQuantity > availableStock) {
                    updated[index].quantity = availableStock > 0 ? availableStock : 1
                    showError(`Quantity adjusted to ${availableStock} for ${updatedProduct.name}`)
                }

                return updated
            })

            validateStock(products)
            showSuccess('Stock information updated')
        } catch (error) {
            console.error('Error refreshing stock:', error)
            showError('Failed to refresh stock information')
        }
    }

    const handleRemoveProduct = (index) => {
        const productName = products[index]?.product?.name || 'Product'
        const updatedProducts = products.filter((_, i) => i !== index)
        setProducts(updatedProducts)

        const newErrors = { ...stockErrors }
        delete newErrors[index]
        setStockErrors(newErrors)

        showSuccess(`Removed ${productName} from transfer list`)
    }

    const hasInsufficientStock = () => {
        return products.some(product => {
            const availableStock = product.from_location === 'stock_available' ? (product.product?.stock_available || 0) : (product.product?.store_available || 0)
            return parseInt(product.quantity || 0) > availableStock
        })
    }

    const getTotalQuantity = () => {
        return products.reduce((total, product) => total + (parseInt(product.quantity) || 0), 0)
    }

    const calculateStockSummary = () => {
        const summary = {
            stock_to_store: { count: 0, quantity: 0 },
            store_to_stock: { count: 0, quantity: 0 }
        }

        products.forEach(product => {
            if (product.from_location === 'stock_available' && product.to_location === 'store_available') {
                summary.stock_to_store.count++
                summary.stock_to_store.quantity += parseInt(product.quantity) || 0
            } else if (product.from_location === 'store_available' && product.to_location === 'stock_available') {
                summary.store_to_stock.count++
                summary.store_to_stock.quantity += parseInt(product.quantity) || 0
            }
        })

        return summary
    }

    const onSubmit = async () => {
        if (!canEdit) {
            toast.error('You do not have permission to edit transfer orders')
            return
        }

        if (!products || products.length === 0) {
            toast.error('Please add at least one product')
            return
        }

        if (hasInsufficientStock()) {
            toast.error('Some products exceed available stock. Please fix before saving.')
            return
        }

        setIsSubmitting(true)

        try {
            const preparedData = {
                notes: notes || '',
                products: products.map(p => ({
                    product_id: p.product_id,
                    from_location: p.from_location,
                    to_location: p.to_location,
                    quantity: parseInt(p.quantity) || 1
                }))
            }

            await axios.put(`/transfer-orders/${id}`, preparedData)
            toast.success('Transfer order updated successfully')

            // Option 1A: Force full page reload
            window.location.reload()
        } catch (error) {
            console.error('Update error:', error)
            toast.error(error.response?.data?.message || 'Failed to update transfer order')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleToggleStatus = async () => {
        if (!canComplete) {
            toast.error('You do not have permission to change transfer order status')
            return
        }

        try {
            await axios.put(`/transfer-orders/${id}/toggle-status`)
            toast.success('Transfer order status updated successfully')
            refetch()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update transfer order status')
        }
    }

    const handleBack = () => {
        history.push(`/transfer-order/details/${id}`)
    }

    const handleDelete = async () => {
        if (!ability.can('read', 'transfer_order_delete')) {
            toast.error('You do not have permission to delete transfer orders')
            return
        }

        if (window.confirm('Are you sure you want to delete this transfer order? This action cannot be undone!')) {
            try {
                await axios.delete(`/transfer-orders/${id}`)
                toast.success('Transfer order deleted successfully')
                history.push('/transfer-order/list')
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete transfer order')
            }
        }
    }

    // Load initial options on mount
    useEffect(() => {
        loadInitialOptions()
    }, [])

    if (isLoading) {
        return (
            <Fragment>
                <Breadcrumbs breadCrumbTitle='Transfer Orders' breadCrumbActive='Edit Transfer' />
                <div className="d-flex justify-content-center my-5">
                    <Spinner color="primary" />
                </div>
            </Fragment>
        )
    }

    if (!transferOrder) {
        return (
            <Fragment>
                <Breadcrumbs breadCrumbTitle='Transfer Orders' breadCrumbActive='Edit Transfer' />
                <Alert color="danger">
                    Transfer order not found
                </Alert>
            </Fragment>
        )
    }

    const cannotEdit = transferOrder && !transferOrder.can_edit
    const stockSummary = calculateStockSummary()

    return (
        <Fragment>
            <Breadcrumbs
                breadCrumbTitle='Transfer Orders'
                breadCrumbActive={`Edit Transfer #${transferOrder.number}`}
            />

            <Card>
                <CardBody>
                    <div className="mb-2">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h4 className="mb-0">
                                    Edit Transfer #{transferOrder.number}
                                </h4>
                            </div>
                            <div>
                                <Button
                                    color="secondary"
                                    onClick={() => history.push('/transfer-order/list')}
                                    className="mr-2"
                                >
                                    <ArrowLeft size={14} className="mr-1" />
                                    Back to List
                                </Button>
                                <Button
                                    color="primary"
                                    onClick={handleBack}
                                    className="mr-2"
                                >
                                    Details
                                </Button>

                            </div>
                        </div>

                        {cannotEdit && (
                            <Alert color="warning" className="mt-1">
                                <AlertTriangle size={16} className="mr-2" />
                                This transfer order cannot be edited because it's {transferOrder.status.toLowerCase()}.
                            </Alert>
                        )}
                    </div>

                    <Row>
                        <Col md={8} sm={12}>
                            {/* Transfer Details */}
                            <Card className="mb-2">
                                <CardBody>
                                    <h5 className="mb-2">
                                        <Package size={18} className="mr-2" />
                                        Transfer Details
                                    </h5>

                                    {/* Product Search */}
                                    {!cannotEdit && (
                                        <FormGroup>
                                            <Label for="product-search">Search Product to Add</Label>
                                            <AsyncSelect
                                                id="product-search"
                                                isClearable={true}
                                                className='react-select'
                                                classNamePrefix='select'
                                                value={selectedProduct ? {
                                                    value: selectedProduct.id,
                                                    label: selectedProduct.name,
                                                    item: selectedProduct
                                                } : null}
                                                loadOptions={promiseOptions}
                                                defaultOptions={defaultOptions}
                                                cacheOptions
                                                onChange={handleProductSelect}
                                                placeholder="Search for products to add..."
                                                isLoading={loading}
                                                noOptionsMessage={({ inputValue }) => {
                                                    if (!inputValue || inputValue.trim() === '') {
                                                        return "Start typing to search products"
                                                    }
                                                    if (loading) {
                                                        return "Searching..."
                                                    }
                                                    return "No products found"
                                                }}
                                                filterOption={null}
                                                formatOptionLabel={(option, { context }) => {
                                                    if (context === 'menu') {
                                                        return option.label
                                                    }
                                                    return option.item ? option.item.name : option.label
                                                }}
                                                styles={{
                                                    control: (base) => ({
                                                        ...base,
                                                        minHeight: '42px'
                                                    }),
                                                    menu: (base) => ({
                                                        ...base,
                                                        zIndex: 9999
                                                    })
                                                }}
                                            />
                                        </FormGroup>
                                    )}
                                    {/* Add this after the Product Search form group (around line 430) */}
                                    {/* Bulk Location Selection */}
                                    {!cannotEdit && (
                                        <Card className="mb-3 border-primary">
                                            <CardHeader
                                                style={{ cursor: 'pointer', padding: '0.5rem 1rem' }}
                                                onClick={() => setBulkSectionOpen(!bulkSectionOpen)}
                                            >
                                                <div className="d-flex justify-content-between align-items-center w-100">
                                                    <div className="d-flex align-items-center" style={{ flex: 1 }}>
                                                        <h6 className="mb-0" style={{ fontSize: '0.9rem', marginRight: '1rem' }}>
                                                            Bulk Location Settings
                                                        </h6>
                                                        {!bulkSectionOpen && (
                                                            <div className="text-muted small">
                                                                <Badge color={bulkFromLocation === 'stock_available' ? 'info' : 'warning'} className="mr-1">
                                                                    {bulkFromLocation === 'stock_available' ? 'Stock' : 'Store'}
                                                                </Badge>
                                                                →
                                                                <Badge color={bulkToLocation === 'store_available' ? 'warning' : 'info'} className="ml-1">
                                                                    {bulkToLocation === 'store_available' ? 'Store' : 'Stock'}
                                                                </Badge>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <ChevronDown
                                                        size={16}
                                                        style={{
                                                            transform: bulkSectionOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                                            transition: 'transform 0.2s ease',
                                                            marginLeft: 'auto'
                                                        }}
                                                    />
                                                </div>
                                            </CardHeader>
                                            <Collapse isOpen={bulkSectionOpen}>
                                                <CardBody className="pb-0 pt-1" style={{ padding: '0.5rem 1rem' }}>
                                                    <Row>
                                                        <Col md={5}>
                                                            <FormGroup className="mb-0">
                                                                <Label for="bulk-from" className="small mb-0">From Location</Label>
                                                                <Input
                                                                    type="select"
                                                                    id="bulk-from"
                                                                    value={bulkFromLocation}
                                                                    onChange={(e) => setBulkFromLocation(e.target.value)}
                                                                    className="form-control-sm"
                                                                    disabled={isSubmitting || cannotEdit}
                                                                >
                                                                    <option value="stock_available">Stock Available</option>
                                                                    <option value="store_available">Store Available</option>
                                                                </Input>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={2} className="d-flex align-items-center justify-content-center">
                                                            <Button
                                                                color="secondary"
                                                                size="sm"
                                                                onClick={swapBulkLocations}
                                                                disabled={isSubmitting || cannotEdit}
                                                                className="mt-1"
                                                            >
                                                                Swap
                                                            </Button>
                                                        </Col>
                                                        <Col md={5}>
                                                            <FormGroup className="mb-0">
                                                                <Label for="bulk-to" className="small mb-0">To Location</Label>
                                                                <Input
                                                                    type="select"
                                                                    id="bulk-to"
                                                                    value={bulkToLocation}
                                                                    onChange={(e) => setBulkToLocation(e.target.value)}
                                                                    className="form-control-sm"
                                                                    disabled={isSubmitting || cannotEdit}
                                                                >
                                                                    <option value="stock_available">Stock Available</option>
                                                                    <option value="store_available">Store Available</option>
                                                                </Input>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row className="my-1">
                                                        <Col md={12} className="text-right">
                                                            <Button
                                                                color="primary"
                                                                size="sm"
                                                                onClick={applyBulkLocation}
                                                                disabled={products.length === 0 || isSubmitting || bulkFromLocation === bulkToLocation || cannotEdit}
                                                            >
                                                                Apply to All Products
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </CardBody>
                                            </Collapse>
                                        </Card>
                                    )}
                                    {/* Products Table */}
                                    <div className="mt-4">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <h6 className="mb-0">Products in Transfer ({products.length})</h6>
                                            <div className="text-muted">
                                                {getTotalQuantity()} units
                                            </div>
                                        </div>

                                        {products.length > 0 ? (
                                            <div className="table-responsive mb-3">
                                                <Table bordered hover>
                                                    <thead className="thead-light">
                                                    <tr>
                                                        <th width="20%">Product</th>
                                                        <th width="10%">From</th>
                                                        <th width="10%">To</th>
                                                        <th width="10%">Quantity</th>
                                                        <th width="15%"> Current Stock</th>
                                                        <th width="25%">Stock Impact</th>
                                                        <th width="10%">Actions</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {products.map((product, index) => {
                                                        const productData = product.product || {}
                                                        const availableStock = product.from_location === 'stock_available' ? (productData.stock_available || 0) : (productData.store_available || 0)
                                                        const hasStockError = stockErrors[index]
                                                        const isEditable = canEdit && !cannotEdit
                                                        const productImage = productData.image || '/static/images/placeholder.png'
                                                        const productName = productData.name || 'Product'
                                                        const productSku = productData.sku || 'N/A'

                                                        const productLocation = product.location || 'N/A'
                                                        const productStockLocation = product.stock_location || 'N/A'

                                                        // Get current stock values
                                                        const currentStockAvailable = product.current_stock_available || productData.stock_available || 0
                                                        const currentStoreAvailable = product.current_store_available || productData.store_available || 0
                                                        const totalCurrentStock = currentStockAvailable + currentStoreAvailable

                                                        return (
                                                            <tr key={index} className={hasStockError ? 'table-warning' : ''}>
                                                                <td>
                                                                    <div className="d-flex align-items-center">
                                                                        {productImage ? (
                                                                            <img
                                                                                src={productImage}
                                                                                alt={productName}
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
                                                                               href={`${process.env.REACT_APP_WEBSITE}/product/${productName.replace(/\s+/g, '-').toLowerCase()}`}
                                                                               target='_blank'
                                                                               rel="noopener noreferrer">
                                                                                {productName}
                                                                            </a>
                                                                            <small className="text-muted">
                                                                                SKU: {productSku}
                                                                            </small>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <select
                                                                        className={`form-control width-100 form-control-sm ${hasStockError ? 'border-danger' : ''}`}
                                                                        value={product.from_location}
                                                                        onChange={(e) => handleProductChange(index, 'from_location', e.target.value)}
                                                                        disabled={!isEditable || isSubmitting}
                                                                    >
                                                                        <option value="stock_available">Stock</option>
                                                                        <option value="store_available">Store</option>
                                                                    </select>
                                                                    {/* Display the actual location based on selection */}
                                                                    <div className="mt-1 small">
                                                                        {product.from_location === 'stock_available' ? (
                                                                            <div className="text-info d-flex align-items-center">
                                                                                <span className="mr-1">📦</span>
                                                                                <span className="text-truncate" style={{ maxWidth: '120px' }} title={productStockLocation}>
                                                                                        {productStockLocation}
                                                                                    </span>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="text-warning d-flex align-items-center">
                                                                                <span className="mr-1">🏪</span>
                                                                                <span className="text-truncate" style={{ maxWidth: '120px' }} title={productLocation}>
                                                                                        {productLocation}
                                                                                    </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="d-flex align-items-center justify-content-center">
                                                                        <ArrowRight size={14} className="mr-1 text-muted" />
                                                                        <select
                                                                            className="form-control form-control-sm width-100"
                                                                            value={product.to_location}
                                                                            onChange={(e) => handleProductChange(index, 'to_location', e.target.value)}
                                                                            disabled={!isEditable || isSubmitting}
                                                                        >
                                                                            <option value="stock_available">Stock</option>
                                                                            <option value="store_available">Store</option>
                                                                        </select>
                                                                    </div>
                                                                    {/* Display the actual location based on selection */}
                                                                    <div className="mt-1 small text-center">
                                                                        {product.to_location === 'stock_available' ? (
                                                                            <div className="text-info d-flex align-items-center justify-content-center">
                                                                                <span className="mr-1">📦</span>
                                                                                <span className="text-truncate" style={{ maxWidth: '120px' }} title={productStockLocation}>
                                                                                        {productStockLocation}
                                                                                    </span>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="text-warning d-flex align-items-center justify-content-center">
                                                                                <span className="mr-1">🏪</span>
                                                                                <span className="text-truncate" style={{ maxWidth: '120px' }} title={productLocation}>
                                                                                        {productLocation}
                                                                                    </span>
                                                                            </div>
                                                                        )}

                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <Input
                                                                        type="number"
                                                                        min="1"
                                                                        max={availableStock}
                                                                        value={product.quantity}
                                                                        onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                                                        className={`form-control-sm ${hasStockError ? 'border-danger' : ''}`}
                                                                        disabled={!isEditable || isSubmitting}
                                                                    />
                                                                    {hasStockError && (
                                                                        <small className="text-danger d-block mt-1">
                                                                            {stockErrors[index]}
                                                                        </small>
                                                                    )}

                                                                </td>
                                                                <td className="text-center">
                                                                    <div className="d-flex flex-column align-items-center">
                                                                        <div className="d-flex align-items-center mb-1">
                                                                            <span className='text-muted'>Stock:</span>
                                                                            <span className="font-weight-bold ml-1">
                                                                                    {currentStockAvailable}
                                                                                </span>
                                                                        </div>
                                                                        <div className="d-flex align-items-center mb-1">
                                                                                <span className='text-muted'>
                                                                                    Store:</span>
                                                                            <span className="font-weight-bold ml-1">
                                                                                    {currentStoreAvailable}
                                                                                </span>
                                                                        </div>
                                                                        <div className="d-flex align-items-center">
                                                                            <span className='text-muted'>Σ:</span>
                                                                            <span className="font-weight-bold ml-1">
                                                                                    {totalCurrentStock}
                                                                                </span>
                                                                        </div>
                                                                    </div>

                                                                </td>
                                                                <td>
                                                                    <StockImpact
                                                                        product={product}
                                                                        compact={true}
                                                                        showLabels={false}
                                                                    />
                                                                </td>
                                                                <td className="text-center">
                                                                    {isEditable && (
                                                                        <Button
                                                                            color="danger"
                                                                            size="sm"
                                                                            onClick={() => handleRemoveProduct(index)}
                                                                            disabled={isSubmitting}
                                                                        >
                                                                            <Trash2 size={14} />
                                                                        </Button>
                                                                    )}
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
                                                <p className="text-muted">No products added to this transfer</p>
                                                {!cannotEdit && (
                                                    <p className="text-muted small">
                                                        Use the search above to add products
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <FormGroup>
                                        <Label for="notes">Notes (Optional)</Label>
                                        <Input
                                            type="textarea"
                                            id="notes"
                                            rows="3"
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="Add any notes about this transfer..."
                                            disabled={isSubmitting || cannotEdit}
                                        />
                                    </FormGroup>

                                    {/* Action Buttons */}
                                    {!cannotEdit && canEdit && (
                                        <div className="mt-4 d-flex justify-content-between">
                                            <Button
                                                color="secondary"
                                                onClick={handleBack}
                                                disabled={isSubmitting}
                                            >
                                                Cancel
                                            </Button>

                                            <div>
                                                {transferOrder.can_edit && (
                                                    <Button
                                                        color="danger"
                                                        onClick={handleDelete}
                                                        className="mr-2"
                                                        disabled={isSubmitting}
                                                    >
                                                        <X size={14} className="mr-1" />
                                                        Delete Transfer
                                                    </Button>
                                                )}

                                                <Button
                                                    color="primary"
                                                    onClick={onSubmit}
                                                    disabled={isSubmitting || products.length === 0 || hasInsufficientStock()}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <Spinner size="sm" className="mr-1" />
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save size={14} className="mr-1" />
                                                            Save Changes
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>

                        <Col md={4} sm={12}>
                            {/* Status Card */}
                            <TransferOrderStatus
                                transferOrder={transferOrder}
                                isEditMode={true}
                                onToggleStatus={handleToggleStatus}
                                onUpdateStatus={refetch}
                            />

                            {/* Transfer Summary */}
                            <Card className="mt-4">
                                <CardBody>
                                    <h6 className="mb-3 d-flex align-items-center">
                                        <BarChart2 size={16} className="mr-2" />
                                        Transfer Summary
                                    </h6>

                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted">Total Products:</span>
                                            <strong>{products.length}</strong>
                                        </div>

                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted">Total Quantity:</span>
                                            <strong>{getTotalQuantity()}</strong>
                                        </div>

                                        {stockSummary.stock_to_store.count > 0 && (
                                            <div className="mb-2 p-2 bg-info-light rounded">
                                                <div className="d-flex justify-content-between mb-1">
                                                    <span className="small">Stock → Store</span>
                                                    <Badge color="info">
                                                        {stockSummary.stock_to_store.count}
                                                    </Badge>
                                                </div>
                                                <div className="d-flex justify-content-between">
                                                    <span className="small">Quantity:</span>
                                                    <strong>{stockSummary.stock_to_store.quantity}</strong>
                                                </div>
                                            </div>
                                        )}

                                        {stockSummary.store_to_stock.count > 0 && (
                                            <div className="mb-2 p-2 bg-warning-light rounded">
                                                <div className="d-flex justify-content-between mb-1">
                                                    <span className="small">Store → Stock</span>
                                                    <Badge color="warning">
                                                        {stockSummary.store_to_stock.count}
                                                    </Badge>
                                                </div>
                                                <div className="d-flex justify-content-between">
                                                    <span className="small">Quantity:</span>
                                                    <strong>{stockSummary.store_to_stock.quantity}</strong>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Stock Validation */}
                                    <div className="mt-3 pt-3 border-top">
                                        <h6>Stock Validation</h6>
                                        {hasInsufficientStock() ? (
                                            <Alert color="danger" className="mt-2">
                                                <AlertTriangle size={14} className="mr-2" />
                                                <small>Some products exceed available stock</small>
                                            </Alert>
                                        ) : products.length > 0 ? (
                                            <Alert color="success" className="mt-2">
                                                <CheckCircle size={14} className="mr-2" />
                                                <small>All products have sufficient stock</small>
                                            </Alert>
                                        ) : (
                                            <Alert color="secondary" className="mt-2">
                                                <Package size={14} className="mr-2" />
                                                <small>Add products to begin validation</small>
                                            </Alert>
                                        )}
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Fragment>
    )
}