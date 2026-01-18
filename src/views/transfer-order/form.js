import { useState, useEffect, useRef, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import {
    Card, CardBody, Button, Form, FormGroup, Label, Input,
    Table, Badge, Alert, Row, Col, Spinner,
    InputGroup, InputGroupText
} from 'reactstrap'
import { Plus, Trash, Save, Package, AlertTriangle, ArrowLeft, Search, X } from 'react-feather'
import { toast } from 'react-toastify'
import ability from '../../configs/acl/ability'
import axios from '../../utility/axiosIsntance'

const TransferOrderForm = ({ transferOrder }) => {
    const history = useHistory()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [stockErrors, setStockErrors] = useState({})
    const [productSearchQuery, setProductSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [showSearchResults, setShowSearchResults] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)
    const searchTimeoutRef = useRef(null)
    const searchContainerRef = useRef(null)

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            notes: transferOrder?.notes || ''
        }
    })

    // Check if we're in edit mode
    const isEditMode = !!transferOrder

    // Debug: Log the transferOrder prop to see its structure
    useEffect(() => {
        console.log('TransferOrderForm - transferOrder:', transferOrder)
        console.log('TransferOrderForm - can_edit:', transferOrder?.can_edit)
        console.log('TransferOrderForm - status:', transferOrder?.status)
    }, [transferOrder])

    const canEdit = ability.can('read', isEditMode ? 'transfer_order_edit' : 'transfer_order_create')

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

    useEffect(() => {
        if (transferOrder?.products) {
            const formattedProducts = transferOrder.products.map(p => ({
                id: p.id,
                product_id: p.product_id,
                product: {
                    id: p.product_id,
                    name: p.product_name || 'Unknown Product',
                    sku: p.product_sku || 'N/A',
                    image: p.product_image || null,
                    stock_available: p.current_stock_available || 0,
                    store_available: p.current_store_available || 0
                },
                from_location: p.from_location || 'stock_available',
                to_location: p.to_location || 'store_available',
                quantity: p.quantity || 1
            }))
            setProducts(formattedProducts)
            validateStock(formattedProducts)
        }
    }, [transferOrder])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setShowSearchResults(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const extractArrayFromResponse = (data) => {
        if (Array.isArray(data)) {
            return data
        } else if (data && Array.isArray(data.data)) {
            return data.data
        } else if (data && Array.isArray(data.items)) {
            return data.items
        } else if (data && data.data && Array.isArray(data.data.data)) {
            return data.data.data
        }
        return []
    }

    const searchProducts = useCallback(async (query) => {
        if (!query || query.trim().length < 2) {
            setSearchResults([])
            return
        }

        setSearchLoading(true)
        try {
            let response
            try {
                response = await axios.get('/product/autocomplete', {
                    params: {
                        search: query,
                        limit: 20
                    }
                })
            } catch (autocompleteError) {
                response = await axios.get('/product/datatable', {
                    params: {
                        search: query,
                        length: 20,
                        start: 0,
                        draw: 1
                    }
                })
            }

            let dataArray = extractArrayFromResponse(response.data)

            if (!Array.isArray(dataArray)) {
                dataArray = []
            }

            const formattedResults = dataArray.map((item, index) => {
                const productData = item.item || item.value || item
                const product = productData.product || productData

                return {
                    id: product.id || product.value || index,
                    name: product.name || product.label || product.text || 'Unknown Product',
                    sku: product.sku || product.code || 'N/A',
                    image: product.image || product.avatar || null,
                    stock_available: product.stock_available || product.stock_available_qty || 0,
                    store_available: product.store_available || product.store_available_qty || 0,
                    normal_price: product.normal_price || product.price?.normal || 0,
                    sale_price: product.sale_price || product.price?.sale || 0,
                    location: product.location || ''
                }
            }).filter(product => product.id && product.name)

            setSearchResults(formattedResults)
            setShowSearchResults(true)

        } catch (error) {
            console.error('Search error:', error)

            try {
                const directResponse = await axios.get('/product', {
                    params: {
                        search: query,
                        per_page: 10
                    }
                })

                if (directResponse.data && directResponse.data.data) {
                    const directData = directResponse.data.data.items || directResponse.data.data
                    if (Array.isArray(directData)) {
                        const simpleResults = directData.map((product, index) => ({
                            id: product.id || index,
                            name: product.name || 'Product',
                            sku: product.sku || 'N/A',
                            image: product.image || null,
                            stock_available: product.stock_available || 0,
                            store_available: product.store_available || 0,
                            normal_price: product.normal_price || 0,
                            sale_price: product.sale_price || 0,
                            location: product.location || ''
                        }))
                        setSearchResults(simpleResults)
                        setShowSearchResults(true)
                    }
                }
            } catch (directError) {
                console.error('Direct API also failed:', directError)
                toast.error('Search service is temporarily unavailable. Please try again.')
            }
        } finally {
            setSearchLoading(false)
        }
    }, [])

    const handleSearchInput = (value) => {
        setProductSearchQuery(value)

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }

        searchTimeoutRef.current = setTimeout(() => {
            if (value.trim().length >= 2) {
                searchProducts(value)
            } else {
                setSearchResults([])
                setShowSearchResults(false)
            }
        }, 500)
    }

    const handleClearSearch = () => {
        setProductSearchQuery('')
        setSearchResults([])
        setShowSearchResults(false)
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }
    }

    const addProduct = (product) => {
        if (!product) {
            toast.error('No product selected')
            return
        }

        const exists = products.find(p => p.product_id === product.id)
        if (exists) {
            toast.error('Product already added to transfer')
            return
        }

        const newProduct = {
            product_id: product.id,
            product: {
                id: product.id,
                name: product.name,
                sku: product.sku,
                image: product.image,
                stock_available: product.stock_available || 0,
                store_available: product.store_available || 0
            },
            from_location: 'stock_available',
            to_location: 'store_available',
            quantity: 1
        }

        const updatedProducts = [...products, newProduct]
        setProducts(updatedProducts)
        validateStock(updatedProducts)

        handleClearSearch()
    }

    const updateProduct = (index, field, value) => {
        const updatedProducts = [...products]
        updatedProducts[index][field] = value

        if (field === 'quantity' || field === 'from_location') {
            validateStock(updatedProducts)
        }

        setProducts(updatedProducts)
    }

    const removeProduct = (index) => {
        const updatedProducts = products.filter((_, i) => i !== index)
        setProducts(updatedProducts)

        const newErrors = { ...stockErrors }
        delete newErrors[index]
        setStockErrors(newErrors)
    }

    const onSubmit = async (data) => {
        if (!canEdit) {
            toast.error('You do not have permission to perform this action')
            return
        }

        if (products.length === 0) {
            toast.error('Please add at least one product')
            return
        }

        if (!validateStock(products)) {
            toast.error('Please fix stock availability issues before saving')
            return
        }

        setLoading(true)
        try {
            const payload = {
                notes: data.notes || '',
                products: products.map(p => ({
                    product_id: p.product_id,
                    from_location: p.from_location,
                    to_location: p.to_location,
                    quantity: parseInt(p.quantity) || 1
                }))
            }

            let response
            if (isEditMode) {
                response = await axios.put(`/transfer-orders/${transferOrder.id}`, payload)
                toast.success('Transfer order updated successfully')
            } else {
                response = await axios.post('/transfer-orders', payload)
                toast.success('Transfer order created successfully')
            }

            history.push(`/transfer-order/details/${response.data.data.id}`)
        } catch (error) {
            console.error('Submit error:', error)
            const errorMessage = error.response?.data?.message || 'Failed to save transfer order'
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const locationOptions = [
        { value: 'stock_available', label: 'Stock Available' },
        { value: 'store_available', label: 'Store Available' }
    ]

    const totalQuantity = products.reduce((sum, p) => sum + (parseInt(p.quantity) || 0), 0)
    const fromStockCount = products.filter(p => p.from_location === 'stock_available').length
    const toStockCount = products.filter(p => p.to_location === 'stock_available').length

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }
        }
    }, [])

    // Check if the transfer order can be edited
    // IMPORTANT: The response shows can_edit: true, so this should be false
    const cannotEdit = isEditMode && transferOrder && !transferOrder.can_edit

    return (
        <Card>
            <CardBody>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    {/* Header */}
                    <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">
                                {isEditMode ? `Edit Transfer #${transferOrder?.number || 'N/A'}` : 'Create New Transfer'}
                            </h4>
                            <Button
                                color="light"
                                onClick={() => history.push('/transfer-order/list')}
                                disabled={loading}
                            >
                                <ArrowLeft size={14} className="mr-1" />
                                Back to List
                            </Button>
                        </div>

                        {/* FIXED: Only show this alert when the transfer order cannot be edited */}
                        {cannotEdit && (
                            <Alert color="warning" className="mt-3">
                                <AlertTriangle size={16} className="mr-2" />
                                This transfer order cannot be edited because it's {transferOrder?.status?.toLowerCase() || 'completed/canceled'}.
                            </Alert>
                        )}
                    </div>

                    {/* Notes */}
                    <FormGroup>
                        <Label for="notes">Notes <span className="text-muted">(Optional)</span></Label>
                        <Input
                            type="textarea"
                            id="notes"
                            {...register('notes')}
                            disabled={!canEdit || cannotEdit}
                            rows={3}
                            placeholder="Add any notes about this transfer..."
                        />
                    </FormGroup>

                    {/* Products Section */}
                    <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0 d-flex align-items-center">
                                <Package size={18} className="mr-2" /> Products
                            </h5>
                            <div className="text-muted">
                                {products.length} product{products.length !== 1 ? 's' : ''} • {totalQuantity} units
                            </div>
                        </div>

                        {/* Product Search */}
                        {canEdit && !cannotEdit && (
                            <div className="mb-3">
                                <Label>Search and Add Products</Label>
                                <div ref={searchContainerRef} className="position-relative">
                                    <InputGroup>
                                        <InputGroupText>
                                            {searchLoading ? <Spinner size="sm" /> : <Search size={14} />}
                                        </InputGroupText>
                                        <Input
                                            type="text"
                                            value={productSearchQuery}
                                            onChange={(e) => handleSearchInput(e.target.value)}
                                            placeholder="Type product name or SKU to search..."
                                            onFocus={() => {
                                                if (productSearchQuery.length >= 2 && searchResults.length > 0) {
                                                    setShowSearchResults(true)
                                                }
                                            }}
                                            disabled={searchLoading}
                                        />
                                        {productSearchQuery && (
                                            <Button
                                                color="link"
                                                onClick={handleClearSearch}
                                                className="position-absolute"
                                                style={{
                                                    right: '10px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    zIndex: 10,
                                                    padding: '5px'
                                                }}
                                                disabled={searchLoading}
                                            >
                                                <X size={14} />
                                            </Button>
                                        )}
                                    </InputGroup>

                                    {/* Search Results Dropdown */}
                                    {showSearchResults && (
                                        <div
                                            className="position-absolute w-100 bg-white border rounded shadow-lg mt-1"
                                            style={{
                                                zIndex: 1050,
                                                maxHeight: '300px',
                                                overflowY: 'auto',
                                                top: '100%',
                                                left: 0
                                            }}
                                        >
                                            {searchLoading ? (
                                                <div className="p-3 text-center">
                                                    <Spinner size="sm" className="mr-2" />
                                                    Searching...
                                                </div>
                                            ) : searchResults.length > 0 ? (
                                                <>
                                                    <div className="p-2 bg-light border-bottom">
                                                        <small className="text-muted">
                                                            Found {searchResults.length} product{searchResults.length !== 1 ? 's' : ''}
                                                        </small>
                                                    </div>
                                                    {searchResults.map((product, index) => (
                                                        <div
                                                            key={`${product.id}-${index}`}
                                                            className="p-2 border-bottom cursor-pointer hover-bg-light"
                                                            onClick={() => addProduct(product)}
                                                            style={{
                                                                transition: 'background-color 0.2s',
                                                                borderLeft: '3px solid transparent'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.borderLeftColor = '#7367f0'
                                                                e.currentTarget.style.backgroundColor = '#f8f9fa'
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.borderLeftColor = 'transparent'
                                                                e.currentTarget.style.backgroundColor = ''
                                                            }}
                                                        >
                                                            <div className="d-flex align-items-center">
                                                                <div className="mr-2" style={{ minWidth: '40px' }}>
                                                                    {product.image ? (
                                                                        <img
                                                                            src={product.image}
                                                                            alt={product.name}
                                                                            className="rounded"
                                                                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                                            onError={(e) => {
                                                                                e.target.src = '/static/images/placeholder.png'
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <div
                                                                            className="rounded d-flex align-items-center justify-content-center"
                                                                            style={{
                                                                                width: '40px',
                                                                                height: '40px',
                                                                                backgroundColor: '#f8f9fa',
                                                                                color: '#6c757d'
                                                                            }}
                                                                        >
                                                                            <Package size={20} />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex-grow-1">
                                                                    <div className="font-weight-bold text-truncate" style={{ maxWidth: '250px' }}>
                                                                        {product.name}
                                                                    </div>
                                                                    <div className="small text-muted">
                                                                        <div>SKU: {product.sku}</div>
                                                                        <div className="d-flex justify-content-between mt-1">
                                                                            <span className="text-info">
                                                                                <strong>Stock:</strong> {product.stock_available}
                                                                            </span>
                                                                            <span className="text-warning">
                                                                                <strong>Store:</strong> {product.store_available}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                            ) : productSearchQuery.length >= 2 ? (
                                                <div className="p-3 text-center">
                                                    <div className="text-muted mb-2">No products found for "{productSearchQuery}"</div>
                                                    <small className="text-muted">Try a different search term</small>
                                                </div>
                                            ) : (
                                                <div className="p-3 text-center text-muted">
                                                    Type at least 2 characters to search
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <small className="text-muted d-block mt-1">
                                    Search by product name or SKU. Click a product to add to transfer.
                                </small>
                            </div>
                        )}

                        {/* Products Table */}
                        {products.length === 0 ? (
                            <div className="text-center p-5 border rounded bg-light">
                                <Package size={48} className="text-muted mb-3" />
                                <p className="text-muted mb-3">No products added yet</p>
                                {canEdit && !cannotEdit && (
                                    <p className="text-muted small">
                                        Use the search above to add products
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <Table bordered hover>
                                    <thead className="thead-light">
                                    <tr>
                                        <th width="30%">Product</th>
                                        <th width="15%">From Location</th>
                                        <th width="15%">To Location</th>
                                        <th width="10%">Quantity</th>
                                        <th width="15%">Available Stock</th>
                                        <th width="15%">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {products.map((product, index) => {
                                        const productData = product.product || {}
                                        const availableStock = product.from_location === 'stock_available' ? (productData.stock_available || 0) : (productData.store_available || 0)
                                        const hasStockError = stockErrors[index]
                                        const isEditable = canEdit && !cannotEdit

                                        return (
                                            <tr key={index} className={hasStockError ? 'table-warning' : ''}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        {productData.image ? (
                                                            <img
                                                                src={productData.image}
                                                                alt={productData.name}
                                                                className="rounded mr-2"
                                                                style={{ width: 40, height: 40, objectFit: 'cover' }}
                                                                onError={(e) => {
                                                                    e.target.src = '/static/images/placeholder.png'
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="mr-2" style={{ width: 40, height: 40, backgroundColor: '#f8f9fa', borderRadius: '4px' }}></div>
                                                        )}
                                                        <div>
                                                            <div className="font-weight-bold text-truncate" style={{ maxWidth: '200px' }}>
                                                                {productData.name || 'Loading...'}
                                                            </div>
                                                            <small className="text-muted">SKU: {productData.sku || 'N/A'}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <select
                                                        className={`form-control form-control-sm ${hasStockError ? 'border-danger' : ''}`}
                                                        value={product.from_location}
                                                        onChange={(e) => updateProduct(index, 'from_location', e.target.value)}
                                                        disabled={!isEditable}
                                                    >
                                                        {locationOptions.map(option => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td>
                                                    <select
                                                        className="form-control form-control-sm"
                                                        value={product.to_location}
                                                        onChange={(e) => updateProduct(index, 'to_location', e.target.value)}
                                                        disabled={!isEditable}
                                                    >
                                                        {locationOptions.map(option => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        max="9999"
                                                        value={product.quantity}
                                                        onChange={(e) => updateProduct(index, 'quantity', e.target.value)}
                                                        className={`form-control-sm ${hasStockError ? 'border-danger' : ''}`}
                                                        disabled={!isEditable}
                                                    />
                                                    {hasStockError && (
                                                        <small className="text-danger d-block mt-1">
                                                            {stockErrors[index]}
                                                        </small>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="d-flex flex-column">
                                                        <div className="mb-1">
                                                            <Badge color="info" className="mr-1">
                                                                Stock: {productData.stock_available || 0}
                                                            </Badge>
                                                        </div>
                                                        <div>
                                                            <Badge color="warning">
                                                                Store: {productData.store_available || 0}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {isEditable && (
                                                        <Trash
                                                            size={16}
                                                            className="cursor-pointer text-danger"
                                                            onClick={() => removeProduct(index)}
                                                            title="Remove product"
                                                            style={{ cursor: 'pointer' }}
                                                        />
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </div>

                    {/* Summary */}
                    {products.length > 0 && (
                        <div className="mb-4 p-3 bg-light rounded">
                            <h6 className="mb-3">Transfer Summary</h6>
                            <Row>
                                <Col md="3" sm="6" className="mb-3">
                                    <div className="text-center p-2 bg-white rounded">
                                        <div className="h3 mb-0">{products.length}</div>
                                        <small className="text-muted">Products</small>
                                    </div>
                                </Col>
                                <Col md="3" sm="6" className="mb-3">
                                    <div className="text-center p-2 bg-white rounded">
                                        <div className="h3 mb-0">{totalQuantity}</div>
                                        <small className="text-muted">Total Units</small>
                                    </div>
                                </Col>
                                <Col md="3" sm="6" className="mb-3">
                                    <div className="text-center p-2 bg-white rounded">
                                        <div className="h3 mb-0">{fromStockCount}</div>
                                        <small className="text-muted">From Stock</small>
                                    </div>
                                </Col>
                                <Col md="3" sm="6" className="mb-3">
                                    <div className="text-center p-2 bg-white rounded">
                                        <div className="h3 mb-0">{toStockCount}</div>
                                        <small className="text-muted">To Stock</small>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="d-flex justify-content-between">
                        <div>
                            {isEditMode && (
                                <Button
                                    color="secondary"
                                    onClick={() => history.push(`/transfer-order/details/${transferOrder.id}`)}
                                    disabled={loading}
                                >
                                    View Details
                                </Button>
                            )}
                        </div>
                        <div>
                            <Button
                                color="light"
                                onClick={() => history.push('/transfer-order/list')}
                                disabled={loading}
                                className="mr-2"
                            >
                                Cancel
                            </Button>
                            {canEdit && !cannotEdit && (
                                <Button
                                    color="primary"
                                    type="submit"
                                    disabled={loading || products.length === 0 || Object.keys(stockErrors).length > 0}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner size="sm" className="mr-1" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={14} className="mr-1" />
                                            {isEditMode ? 'Update Transfer' : 'Create Transfer'}
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </Form>
            </CardBody>

            <style jsx>{`
                .cursor-pointer {
                    cursor: pointer;
                }
                .hover-bg-light:hover {
                    background-color: #f8f9fa !important;
                }
                .shadow-lg {
                    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                }
                .position-relative {
                    position: relative;
                }
                .position-absolute {
                    position: absolute;
                }
                .text-truncate {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            `}</style>
        </Card>
    )
}

export default TransferOrderForm