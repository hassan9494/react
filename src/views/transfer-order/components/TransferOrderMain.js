import { useState, useEffect, useRef, useCallback } from 'react'
import {
    Card, CardBody, Row, Col, FormGroup, Label, Input,
    Table, Badge, Alert, Button, Spinner, InputGroup, InputGroupText
} from 'reactstrap'
import { Plus, Trash, Search, X, Package } from 'react-feather'
import { toast } from 'react-toastify'
import axios from '../../../utility/axiosIsntance'

const TransferOrderMain = ({ isEditMode, transferOrder, onProductsChange, onNotesChange }) => {
    const [products, setProducts] = useState([])
    const [stockErrors, setStockErrors] = useState({})
    const [productSearchQuery, setProductSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [showSearchResults, setShowSearchResults] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)
    const searchTimeoutRef = useRef(null)
    const searchContainerRef = useRef(null)

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
                    name: p.product_name,
                    sku: p.product_sku,
                    image: p.product_image,
                    stock_available: p.current_stock_available || 0,
                    store_available: p.current_store_available || 0
                },
                from_location: p.from_location,
                to_location: p.to_location,
                quantity: p.quantity
            }))
            setProducts(formattedProducts)
            if (onProductsChange) onProductsChange(formattedProducts)
            validateStock(formattedProducts)
        }
    }, [transferOrder])

    useEffect(() => {
        // Notify parent about products changes
        if (onProductsChange) {
            onProductsChange(products)
        }
    }, [products])

    const searchProducts = useCallback(async (query) => {
        if (!query || query.trim().length < 2) {
            setSearchResults([])
            return
        }

        setSearchLoading(true)
        try {
            const response = await axios.get('/product/autocomplete', {
                params: {
                    search: query,
                    limit: 20
                }
            })

            let dataArray = response.data
            if (!Array.isArray(dataArray)) {
                // Handle nested data response
                if (dataArray?.data) {
                    dataArray = dataArray.data
                } else if (dataArray?.items) {
                    dataArray = dataArray.items
                } else {
                    dataArray = []
                }
            }

            const formattedResults = dataArray.map((item) => {
                const productData = item.item || item.value || item
                const product = productData.product || productData

                return {
                    id: product.id,
                    name: product.name || product.label || 'Unknown Product',
                    sku: product.sku || product.code || 'N/A',
                    image: product.image || null,
                    stock_available: product.stock_available || 0,
                    store_available: product.store_available || 0
                }
            }).filter(product => product.id && product.name)

            setSearchResults(formattedResults)
            setShowSearchResults(true)

        } catch (error) {
            console.error('Search error:', error)
            toast.error('Failed to search products')
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

    const locationOptions = [
        { value: 'stock_available', label: 'Stock Available' },
        { value: 'store_available', label: 'Store Available' }
    ]

    const totalQuantity = products.reduce((sum, p) => sum + (parseInt(p.quantity) || 0), 0)

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }
        }
    }, [])

    return (
        <Card>
            <CardBody>
                <h4 className="mb-4">Transfer Details</h4>

                {/* Notes */}
                <FormGroup>
                    <Label for="notes">Notes (Optional)</Label>
                    <Input
                        type="textarea"
                        id="notes"
                        rows={3}
                        placeholder="Add any notes about this transfer..."
                        onChange={(e) => onNotesChange && onNotesChange(e.target.value)}
                        defaultValue={transferOrder?.notes || ''}
                    />
                </FormGroup>

                {/* Products Section */}
                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">
                            Products ({products.length})
                        </h5>
                        <div className="text-muted">
                            {totalQuantity} units
                        </div>
                    </div>

                    {/* Product Search */}
                    <div className="mb-3">
                        <Label>Add Products</Label>
                        <div ref={searchContainerRef} className="position-relative">
                            <InputGroup>
                                <InputGroupText>
                                    {searchLoading ? <Spinner size="sm" /> : <Search size={14} />}
                                </InputGroupText>
                                <Input
                                    type="text"
                                    value={productSearchQuery}
                                    onChange={(e) => handleSearchInput(e.target.value)}
                                    placeholder="Search products by name or SKU..."
                                    onFocus={() => {
                                        if (productSearchQuery.length >= 2 && searchResults.length > 0) {
                                            setShowSearchResults(true)
                                        }
                                    }}
                                />
                                {productSearchQuery && (
                                    <Button
                                        color="link"
                                        onClick={handleClearSearch}
                                        style={{
                                            position: 'absolute',
                                            right: '10px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            zIndex: 10
                                        }}
                                    >
                                        <X size={14} />
                                    </Button>
                                )}
                            </InputGroup>

                            {/* Search Results Dropdown */}
                            {showSearchResults && searchResults.length > 0 && (
                                <div className="position-absolute w-100 bg-white border rounded shadow mt-1"
                                     style={{ zIndex: 1050, maxHeight: '300px', overflowY: 'auto' }}>
                                    {searchResults.map((product) => (
                                        <div
                                            key={product.id}
                                            className="p-2 border-bottom cursor-pointer hover-bg-light"
                                            onClick={() => addProduct(product)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="d-flex align-items-center">
                                                {product.image ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="rounded mr-2"
                                                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <div className="mr-2" style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        backgroundColor: '#f8f9fa',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <Package size={20} color="#6c757d" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-weight-bold">{product.name}</div>
                                                    <small className="text-muted">
                                                        SKU: {product.sku} |
                                                        Stock: {product.stock_available} |
                                                        Store: {product.store_available}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Products Table */}
                    {products.length > 0 ? (
                        <div className="table-responsive">
                            <Table bordered hover>
                                <thead className="thead-light">
                                <tr>
                                    <th>Product</th>
                                    <th>From Location</th>
                                    <th>To Location</th>
                                    <th>Quantity</th>
                                    <th>Available</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {products.map((product, index) => {
                                    const productData = product.product || {}
                                    const availableStock = product.from_location === 'stock_available' ? (productData.stock_available || 0) : (productData.store_available || 0)
                                    const hasStockError = stockErrors[index]

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
                                                        <div className="font-weight-bold">
                                                            {productData.name || 'Loading...'}
                                                        </div>
                                                        <small className="text-muted">
                                                            SKU: {productData.sku || 'N/A'}
                                                        </small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <select
                                                    className={`form-control form-control-sm ${hasStockError ? 'border-danger' : ''}`}
                                                    value={product.from_location}
                                                    onChange={(e) => updateProduct(index, 'from_location', e.target.value)}
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
                                                />
                                                {hasStockError && (
                                                    <small className="text-danger d-block mt-1">
                                                        {stockErrors[index]}
                                                    </small>
                                                )}
                                            </td>
                                            <td>
                                                <div className="d-flex flex-column">
                                                    <Badge color="info" className="mb-1">
                                                        Stock: {productData.stock_available || 0}
                                                    </Badge>
                                                    <Badge color="warning">
                                                        Store: {productData.store_available || 0}
                                                    </Badge>
                                                </div>
                                            </td>
                                            <td>
                                                <Trash
                                                    size={16}
                                                    className="cursor-pointer text-danger"
                                                    onClick={() => removeProduct(index)}
                                                    title="Remove product"
                                                    style={{ cursor: 'pointer' }}
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
                            <p className="text-muted">No products added yet</p>
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
                                    <div className="h3 mb-0">
                                        {products.filter(p => p.from_location === 'stock_available').length}
                                    </div>
                                    <small className="text-muted">From Stock</small>
                                </div>
                            </Col>
                            <Col md="3" sm="6" className="mb-3">
                                <div className="text-center p-2 bg-white rounded">
                                    <div className="h3 mb-0">
                                        {products.filter(p => p.to_location === 'stock_available').length}
                                    </div>
                                    <small className="text-muted">To Stock</small>
                                </div>
                            </Col>
                        </Row>
                    </div>
                )}
            </CardBody>
        </Card>
    )
}

export default TransferOrderMain