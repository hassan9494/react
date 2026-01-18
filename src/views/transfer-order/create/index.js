// src/views/transfer-order/create/index.js
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
    CustomInput,
    CardHeader,
    Collapse
} from 'reactstrap'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Save, X, ArrowLeft, AlertTriangle, Package, Trash2, RefreshCw, BarChart2, CheckCircle, ArrowRight, ChevronDown } from 'react-feather'
import AsyncSelect from 'react-select/async/dist/react-select.esm'
import ability from "../../../configs/acl/ability"
import TransferOrderStatus from '../components/TransferOrderStatus'
import axios from '../../../utility/axiosIsntance'
import { api as productApi } from '@data/use-product'
import { showError, showSuccess } from '../../../utility/Utils'
import StockImpact from '../components/StockImpact'

export default function CreateTransferOrder() {
    const history = useHistory()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [products, setProducts] = useState([])
    const [notes, setNotes] = useState('')
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [loading, setLoading] = useState(false)
    const [stockErrors, setStockErrors] = useState({})
    const [defaultOptions, setDefaultOptions] = useState([])
    const optionsCache = useRef(new Map())
    const [bulkSectionOpen, setBulkSectionOpen] = useState(true)
    const [bulkFromLocation, setBulkFromLocation] = useState('stock_available')
    const [bulkToLocation, setBulkToLocation] = useState('store_available')
    const canCreate = ability.can('read', 'transfer_order_create')
    const canComplete = ability.can('read', 'transfer_order_complete')
    const canCancel = ability.can('read', 'transfer_order_cancel')

    // Mock transfer order object for initial display (only used for UI consistency)
    const initialTransferOrder = {
        status: 'PENDING',
        number: 'New',
        can_edit: true,
        can_complete: false,
        can_cancel: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }

    const transferOrder = initialTransferOrder

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

    // Add these functions after your other functions

// Apply bulk location to all products
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
                    from_location: 'stock_available',
                    to_location: 'store_available',
                    quantity: 1
                }
                setProducts(prev => [...prev, newProduct])
                setSelectedProduct(null)
                validateStock([...products, newProduct])
                showError('Product added with estimated stock values. Please verify.')
            }
        }
    }

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

    // Calculate expected impact for new transfers (not yet saved)
    const calculateExpectedImpact = (product) => {
        const productData = product.product || {}
        const currentStockAvailable = productData.stock_available || 0
        const currentStoreAvailable = productData.store_available || 0
        const quantity = parseInt(product.quantity) || 0

        let expectedStockAvailable = currentStockAvailable
        let expectedStoreAvailable = currentStoreAvailable

        if (product.from_location === 'stock_available') {
            expectedStockAvailable -= quantity
        } else {
            expectedStoreAvailable -= quantity
        }

        if (product.to_location === 'stock_available') {
            expectedStockAvailable += quantity
        } else {
            expectedStoreAvailable += quantity
        }

        const currentTotal = currentStockAvailable + currentStoreAvailable
        const expectedTotal = expectedStockAvailable + expectedStoreAvailable

        return {
            currentStockAvailable,
            currentStoreAvailable,
            currentTotal,
            expectedStockAvailable,
            expectedStoreAvailable,
            expectedTotal,
            stockDifference: expectedStockAvailable - currentStockAvailable,
            storeDifference: expectedStoreAvailable - currentStoreAvailable,
            totalDifference: expectedTotal - currentTotal
        }
    }

    // Prepare product data for StockImpact component
    const prepareProductForStockImpact = (product) => {
        const expectedImpact = calculateExpectedImpact(product)
        return {
            ...product,
            // Simulate stock history data for expected impact
            stock_available_before: expectedImpact.currentStockAvailable,
            stock_available_after: expectedImpact.expectedStockAvailable,
            store_available_before: expectedImpact.currentStoreAvailable,
            store_available_after: expectedImpact.expectedStoreAvailable,
            stock_before: expectedImpact.currentTotal,
            stock_after: expectedImpact.expectedTotal,
            stock_available_difference: expectedImpact.stockDifference,
            store_available_difference: expectedImpact.storeDifference,
            stock_difference: expectedImpact.totalDifference,
            has_stock_history: false, // Always false for new transfers
            // Include current values
            current_stock_available: expectedImpact.currentStockAvailable,
            current_store_available: expectedImpact.currentStoreAvailable
        }
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
        if (!canCreate) {
            toast.error('You do not have permission to create transfer orders')
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

            const response = await axios.post('/transfer-orders', preparedData)
            const newTransferOrder = response.data.data

            toast.success('Transfer order created successfully')

            // Redirect to edit page immediately after creation
            history.push(`/transfer-order/edit/${newTransferOrder.id}`)

        } catch (error) {
            console.error('Create error:', error)
            toast.error(error.response?.data?.message || 'Failed to create transfer order')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleViewList = () => {
        history.push('/transfer-order/list')
    }

    const handleBack = () => {
        history.push('/transfer-order/list')
    }

    const handleCancelCreate = () => {
        if (products.length > 0) {
            if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
                history.push('/transfer-order/list')
            }
        } else {
            history.push('/transfer-order/list')
        }
    }

    // Load initial options on mount
    useEffect(() => {
        loadInitialOptions()
    }, [])

    const stockSummary = calculateStockSummary()

    return (
        <Fragment>
            <Breadcrumbs
                breadCrumbTitle='Transfer Orders'
                breadCrumbActive='Create Transfer'
            />

            <Card>
                <CardBody>
                    <div className="mb-2">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h4 className="mb-0">
                                    Create New Transfer Order
                                </h4>
                                <p className="text-muted mb-0">
                                    Transfer stock between locations
                                </p>
                            </div>
                            <div>
                                <Button
                                    color="secondary"
                                    onClick={handleBack}
                                    className="mr-2"
                                >
                                    <ArrowLeft size={14} className="mr-1" />
                                    Back to List
                                </Button>
                            </div>
                        </div>
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

                                    {/* Bulk Location Selection */}
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
                                            <CardBody className="pb-0 pt-1" style={{ padding: '0.5rem 1rem'}}>
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
                                                                disabled={isSubmitting}
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
                                                            disabled={isSubmitting}
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
                                                                disabled={isSubmitting}
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
                                                            disabled={products.length === 0 || isSubmitting || bulkFromLocation === bulkToLocation}
                                                        >
                                                            Apply to All Products
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </CardBody>
                                        </Collapse>
                                    </Card>
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
                                                        <th width="25%">Product</th>
                                                        <th width="10%">From</th>
                                                        <th width="10%">To</th>
                                                        <th width="10%">Quantity</th>
                                                        <th width="30%">Expected Impact</th>
                                                        <th width="15%">Actions</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {products.map((product, index) => {
                                                        const productData = product.product || {}
                                                        const productForImpact = prepareProductForStockImpact(product)
                                                        const hasStockError = stockErrors[index]
                                                        const isEditable = canCreate && !isSubmitting
                                                        const productImage = productData.image || '/static/images/placeholder.png'
                                                        const productName = productData.name || 'Product'
                                                        const productSku = productData.sku || 'N/A'
                                                        // Get location data
                                                        const productLocation = productData.location || 'N/A'
                                                        const productStockLocation = productData.stock_location || 'N/A'

                                                        const currentStockAvailable = productData.stock_available || 0
                                                        const currentStoreAvailable = productData.store_available || 0
                                                        const availableStock = product.from_location === 'stock_available' ? currentStockAvailable : currentStoreAvailable

                                                        return (
                                                            <tr key={index} className={hasStockError ? 'table-warning' : ''}>
                                                                <td>
                                                                    <div className="d-flex align-items-center">
                                                                        {productImage && productImage !== '/static/images/placeholder.png' ? (
                                                                            <img
                                                                                src={productImage}
                                                                                alt={productName}
                                                                                className="rounded mr-2"
                                                                                style={{ width: 40, height: 40, objectFit: 'cover' }}
                                                                                onError={(e) => {
                                                                                    e.target.src = '/static/images/placeholder.png'
                                                                                }}
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
                                                                        className={`form-control  width-100 form-control-sm ${hasStockError ? 'border-danger' : ''}`}
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
                                                                            className="form-control  width-100 form-control-sm"
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
                                                                <td>
                                                                    <StockImpact
                                                                        product={productForImpact}
                                                                        transferOrderStatus="PENDING"
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
                                                <p className="text-muted small">
                                                    Use the search above to add products
                                                </p>
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
                                            disabled={isSubmitting}
                                        />
                                    </FormGroup>

                                    {/* Action Buttons */}
                                    <div className="mt-4 d-flex justify-content-between">
                                        <Button
                                            color="secondary"
                                            onClick={handleCancelCreate}
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </Button>

                                        <Button
                                            color="primary"
                                            onClick={onSubmit}
                                            disabled={isSubmitting || products.length === 0 || hasInsufficientStock() || !canCreate}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Spinner size="sm" className="mr-1" />
                                                    Creating...
                                                </>
                                            ) : (
                                                <>
                                                    <Save size={14} className="mr-1" />
                                                    Create Transfer
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col md={4} sm={12}>
                            {/* Transfer Summary Card */}
                            <Card className="mt-0">
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