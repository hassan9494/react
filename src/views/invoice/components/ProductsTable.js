import {
    Button, ButtonGroup,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Modal,
    ModalBody, ModalFooter,
    ModalHeader,
    Table,
    Alert,
    Card,
    CardBody,
    CardHeader,
    Collapse
} from 'reactstrap'
import {Controller} from 'react-hook-form'
import {PlusCircle, Trash, AlertCircle, Settings, ChevronDown, ChevronUp} from 'react-feather'
import {useEffect, useRef, useState} from 'react'
import AsyncSelect from 'react-select/async/dist/react-select.esm'
import {confirm} from '@components/sweetalert'
import NumberInput from '@components/number-input'
import {api} from '@data/use-product'
import {getProductPrice} from "./helpers"
import ProductLink from "@components/product/link"
import ability from "../../../configs/acl/ability"
import {Field} from '@components/form/fields'

export default function ({disabled, form, total, setTotal}) {
    const products = form.watch('products') || []
    const is_show_real_price = ability.can('read', 'show_real_price_for_product_in_order')

    // Bulk allocation state
    const [isBulkOpen, setIsBulkOpen] = useState(false)
    const [bulkAllocation, setBulkAllocation] = useState('store')
    const [bulkStockPercentage, setBulkStockPercentage] = useState(0)
    const [bulkStorePercentage, setBulkStorePercentage] = useState(100)
    const [isSticky, setIsSticky] = useState(false)
    const bulkSectionRef = useRef(null)
    const tableContainerRef = useRef(null)

    // Sticky effect for bulk section
    useEffect(() => {
        const handleScroll = () => {
            if (tableContainerRef.current && bulkSectionRef.current) {
                const tableContainer = tableContainerRef.current
                const bulkSection = bulkSectionRef.current

                const bulkSectionHeight = bulkSection.offsetHeight
                const scrollTop = tableContainer.scrollTop

                // Check if scrolled past the bulk section
                if (scrollTop > bulkSectionHeight) {
                    setIsSticky(true)
                } else {
                    setIsSticky(false)
                }
            }
        }

        const tableContainer = tableContainerRef.current
        if (tableContainer) {
            tableContainer.addEventListener('scroll', handleScroll)
            return () => tableContainer.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const handleChanges = (products, id, event, update) => {
        if (disabled) return
        const updated = products.map(product => {
            if (product.id === id) {
                product[event.name] = event.value

                // Auto-calculate the other field if total quantity changes
                if (event.name === 'quantity') {
                    const newQuantity = event.value
                    const stockQty = product.stock_available_qty || 0
                    const storeQty = product.store_available_qty || 0
                    const currentTotal = stockQty + storeQty

                    if (currentTotal > 0 && newQuantity > 0) {
                        // Scale total values proportionally
                        const scaleFactor = newQuantity / currentTotal
                        product.stock_available_qty = Math.round(stockQty * scaleFactor)
                        product.store_available_qty = Math.round(storeQty * scaleFactor)

                        // Adjust to ensure exact sum
                        const diff = newQuantity - (product.stock_available_qty + product.store_available_qty)
                        if (diff !== 0) {
                            product.store_available_qty += diff
                        }
                    } else {
                        // Default all to store if no previous distribution
                        product.store_available_qty = newQuantity
                        product.stock_available_qty = 0
                    }
                }

                // When stock quantity changes, calculate store quantity automatically
                if (event.name === 'stock_available_qty') {
                    const stockQty = parseFloat(event.value) || 0
                    const totalQty = parseFloat(product.quantity) || 0
                    product.store_available_qty = Math.max(0, totalQty - stockQty)
                }

                // When store quantity changes, calculate stock quantity automatically
                if (event.name === 'store_available_qty') {
                    const storeQty = parseFloat(event.value) || 0
                    const totalQty = parseFloat(product.quantity) || 0
                    product.stock_available_qty = Math.max(0, totalQty - storeQty)
                }
                // When allocation changes, update the quantities
                if (event.name === 'allocation') {
                    const totalQty = parseFloat(product.quantity) || 0
                    if (event.value === 'store') {
                        product.store_available_qty = totalQty
                        product.stock_available_qty = 0
                    } else if (event.value === 'stock') {
                        product.store_available_qty = 0
                        product.stock_available_qty = totalQty
                    } else if (event.value === 'total') {
                        // When switching to total, split equally or maintain existing distribution
                        if (product.stock_available_qty === 0 && product.store_available_qty === 0) {
                            product.store_available_qty = totalQty
                            product.stock_available_qty = 0
                        } else if (product.stock_available_qty === 0 && product.store_available_qty > 0) {
                            product.stock_available_qty = 0
                        } else if (product.stock_available_qty > 0 && product.store_available_qty === 0) {
                            product.store_available_qty = 0
                        }
                    }
                }
            }
            return product
        })
        update(updated)
    }

    const handleDelete = (products, id, update) => {
        if (disabled) return
        const updated = products.filter(e => e.id !== id).map(e => e)
        confirm(() => {
            update(updated)
        })
    }

    const handleNewProduct = (products, product, update) => {
        if (disabled) return
        products = products ?? []
        product.quantity = 1
        product.allocation = bulkAllocation || 'store'

        // Set initial distribution based on bulk settings
        if (bulkAllocation === 'store') {
            product.stock_available_qty = 0
            product.store_available_qty = 1
        } else if (bulkAllocation === 'stock') {
            product.stock_available_qty = 1
            product.store_available_qty = 0
        } else if (bulkAllocation === 'total') {
            // Calculate based on percentages
            const stockQty = Math.round(1 * (bulkStockPercentage / 100))
            product.stock_available_qty = stockQty
            product.store_available_qty = 1 - stockQty
        }

        const exists = products?.some(e => e.id === product.id)
        if (!exists) {
            update([...products, product])
        }
    }

    // Apply bulk allocation to all products
    const applyBulkAllocation = () => {
        if (disabled) return

        form.setValue('products', products.map(product => {
            const totalQty = parseFloat(product.quantity) || 0
            let stockQty = 0
            let storeQty = 0

            switch (bulkAllocation) {
                case 'store':
                    stockQty = 0
                    storeQty = totalQty
                    break
                case 'stock':
                    stockQty = totalQty
                    storeQty = 0
                    break
                case 'total':
                    stockQty = Math.round((totalQty * bulkStockPercentage) / 100)
                    storeQty = totalQty - stockQty
                    break
                default:
                    stockQty = parseFloat(product.stock_available_qty) || 0
                    storeQty = parseFloat(product.store_available_qty) || 0
            }

            return {
                ...product,
                allocation: bulkAllocation,
                stock_available_qty: stockQty,
                store_available_qty: storeQty
            }
        }))
    }

    // Calculate total discount from all products and extra items
    const calculateTotalPrice = () => {
        const productsDiscount = products.reduce((sum, p) => sum + (parseFloat(p.purchases_price * p.quantity) || 0), 0)
        return productsDiscount
    }

    // Check if distribution is valid
    const validateDistribution = () => {
        const errors = []
        products.forEach((product, index) => {
            const stockQty = parseFloat(product.stock_available_qty) || 0
            const storeQty = parseFloat(product.store_available_qty) || 0
            const totalQty = parseFloat(product.quantity) || 0

            if (stockQty + storeQty !== totalQty) {
                errors.push(`Product "${product.name}": Stock distribution (${stockQty} + ${storeQty}) doesn't equal total quantity (${totalQty})`)
            }
        })
        return errors
    }

    useEffect(() => {
        const errors = validateDistribution()
        if (errors.length > 0) {
            console.warn('Stock distribution errors:', errors)
        }

        const totalPrice = calculateTotalPrice()
        setTotal(totalPrice)
    }, [products])

    return (
        <div
            ref={tableContainerRef}
            className="products-table-container"
            style={{
                width: '100%',
                height: '600px',
                overflow: 'auto',
                position: 'relative',
                // border: '1px solid #ddd',
                borderRadius: '4px'
            }}
        >
            {/* Bulk Allocation Controls - Fixed Position */}
            {products.length > 0 && (
                <div
                    ref={bulkSectionRef}
                    className="bulk-section-wrapper"
                    style={{
                        position: isSticky ? 'fixed' : 'relative',
                        top: isSticky ? '0' : 'auto',
                        left: isSticky ? '0' : 'auto',
                        right: isSticky ? '0' : 'auto',
                        // zIndex: isSticky ? 1000 : 1,
                        background: '#fff',
                        borderBottom: isSticky ? '1px solid #ddd' : 'none',
                        boxShadow: isSticky ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                        width: isSticky ? '100%' : 'auto'
                    }}
                >
                    <Card className="mb-2" style={{
                        // border: '1px solid #ddd',
                        borderRadius: '4px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        marginBottom: isSticky ? '0' : '0.5rem'
                    }}>
                        <CardHeader
                            className="py-2 px-3 d-flex justify-content-between align-items-center"
                            style={{
                                background: '#f8f9fa',
                                cursor: 'pointer',
                                borderBottom: isBulkOpen ? '1px solid #dee2e6' : 'none'
                            }}
                            onClick={() => setIsBulkOpen(!isBulkOpen)}
                        >
                            <div className="d-flex align-items-center">
                                <Settings size={14} className="mr-2" />
                                <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>
                                    Bulk Allocation
                                </span>
                            </div>
                            <div className="d-flex align-items-center">
                                {isBulkOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </div>
                        </CardHeader>

                        <Collapse isOpen={isBulkOpen}>
                            <CardBody className="py-2 px-3" style={{ background: '#fff' }}>
                                {/* Single Row Layout */}
                                <div className="d-flex flex-wrap align-items-center justify-content-between">
                                    {/* Default Location Dropdown */}
                                    <div style={{ flex: '0 0 180px', marginRight: '15px' }}>
                                        <div className="form-group mb-1">
                                            <label className="form-label mb-1" style={{ fontSize: '0.75rem', fontWeight: '500' }}>
                                                Default Location
                                            </label>
                                            <Input
                                                type="select"
                                                disabled={disabled}
                                                value={bulkAllocation}
                                                onChange={(e) => setBulkAllocation(e.target.value)}
                                                style={{
                                                    padding: '0.2rem 0.4rem',
                                                    fontSize: '0.8rem',
                                                    width: '100%'
                                                }}
                                            >
                                                <option value="store">Store Only</option>
                                                <option value="stock">Stock Only</option>
                                                <option value="total">Split Total</option>
                                            </Input>
                                        </div>
                                    </div>

                                    {/* Percentage Controls (Conditional) */}
                                    {bulkAllocation === 'total' && (
                                        <div className="d-flex align-items-center" style={{ flex: '1', minWidth: '300px' }}>
                                            <div style={{ flex: '1', marginRight: '10px' }}>
                                                <div className="form-group mb-1">
                                                    <label className="form-label mb-1" style={{ fontSize: '0.75rem', fontWeight: '500' }}>
                                                        Stock %
                                                    </label>
                                                    <div className="input-group">
                                                        <Input
                                                            type="number"
                                                            disabled={disabled}
                                                            value={bulkStockPercentage}
                                                            min="0"
                                                            max="100"
                                                            onChange={(e) => {
                                                                const val = parseInt(e.target.value) || 0
                                                                setBulkStockPercentage(val)
                                                                setBulkStorePercentage(100 - val)
                                                            }}
                                                            style={{
                                                                padding: '0.2rem 0.4rem',
                                                                fontSize: '0.8rem',
                                                                flex: '1'
                                                            }}
                                                        />
                                                        <InputGroupAddon addonType="append">
                                                            <InputGroupText style={{
                                                                padding: '0.2rem 0.4rem',
                                                                fontSize: '0.8rem'
                                                            }}>
                                                                %
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ flex: '1', marginRight: '15px' }}>
                                                <div className="form-group mb-1">
                                                    <label className="form-label mb-1" style={{ fontSize: '0.75rem', fontWeight: '500' }}>
                                                        Store %
                                                    </label>
                                                    <div className="input-group">
                                                        <Input
                                                            type="number"
                                                            disabled={disabled}
                                                            value={bulkStorePercentage}
                                                            min="0"
                                                            max="100"
                                                            onChange={(e) => {
                                                                const val = parseInt(e.target.value) || 0
                                                                setBulkStorePercentage(val)
                                                                setBulkStockPercentage(100 - val)
                                                            }}
                                                            style={{
                                                                padding: '0.2rem 0.4rem',
                                                                fontSize: '0.8rem',
                                                                flex: '1'
                                                            }}
                                                        />
                                                        <InputGroupAddon addonType="append">
                                                            <InputGroupText style={{
                                                                padding: '0.2rem 0.4rem',
                                                                fontSize: '0.8rem'
                                                            }}>
                                                                %
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Quick Action Buttons */}
                                    <div className="d-flex align-items-center" style={{ marginLeft: 'auto' }}>
                                        <Button
                                            color="primary"
                                            size="sm"
                                            disabled={disabled}
                                            onClick={applyBulkAllocation}
                                            style={{ fontSize: '0.75rem', padding: '0.75rem 0.75rem' }}
                                        >
                                            Apply All
                                        </Button>
                                    </div>
                                </div>
                            </CardBody>
                        </Collapse>
                    </Card>
                </div>
            )}

            {/* Add spacing when bulk section is sticky to prevent content hiding */}
            {isSticky && products.length > 0 && (
                <div
                    className="bulk-section-spacer"
                    style={{
                        height: bulkSectionRef.current ? `${bulkSectionRef.current.offsetHeight  }px` : '80px',
                        marginBottom: '0.5rem'
                    }}
                />
            )}

            <div className="table-responsive" style={{
                width: '100%',
                overflowX: 'auto'
            }}>
                {/* Distribution Validation Alert */}
                {products.length > 0 && (
                    <Controller
                        control={form.control}
                        name="products"
                        render={({ value }) => {
                            const errors = validateDistribution()
                            if (errors.length > 0) {
                                return (
                                    <Alert color="warning" className="mb-2">
                                        <AlertCircle size={16} className="mr-2" />
                                        <strong>Distribution Warning:</strong> Some products have incorrect distribution.
                                        <ul className="mb-0 mt-1">
                                            {errors.slice(0, 3).map((error, index) => (
                                                <li key={index} style={{ fontSize: '0.8rem' }}>{error}</li>
                                            ))}
                                        </ul>
                                        {errors.length > 3 && (
                                            <small className="d-block mt-1">... and {errors.length - 3} more</small>
                                        )}
                                    </Alert>
                                )
                            }
                            return null
                        }}
                    />
                )}
                <Table striped hover size='sm' style={{
                    minWidth: '1500px',
                    tableLayout: 'auto',
                    marginBottom: 0
                }}>
                    <thead>
                    <tr>
                        <th style={{ minWidth: '250px' }}>Product</th>
                        <th style={{ minWidth: '140px' }}>Quantity</th>
                        <th style={{ minWidth: '120px' }}>Purchases Price</th>
                        <th style={{ minWidth: '120px' }}>Exchange Factor</th>
                        {
                            is_show_real_price &&
                            <th style={{ minWidth: '100px' }}>Real Price</th>
                        }
                        <th style={{ minWidth: '120px' }}>Distributer Price</th>
                        <th style={{ minWidth: '120px' }}>Source SKU</th>
                        <th style={{ minWidth: '100px' }}>Price</th>
                        <th style={{ minWidth: '100px' }}>Sale</th>
                        <th style={{ minWidth: '120px' }}>Stock Location</th>
                        <th style={{ minWidth: '100px' }}>Stock Qty</th>
                        <th style={{ minWidth: '100px' }}>Store Qty</th>
                        <th style={{ minWidth: '80px', textAlign: 'center' }}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <Controller
                        control={form.control}
                        defaultValue={null}
                        name="products"
                        render={
                            ({onChange, value, name, ref}) => {
                                return (
                                    <>
                                        {
                                            (value || []).map(
                                                e => {
                                                    const stockQty = parseFloat(e.stock_available_qty) || 0
                                                    const storeQty = parseFloat(e.store_available_qty) || 0
                                                    const totalQty = parseFloat(e.quantity) || 0
                                                    const isValid = stockQty + storeQty === totalQty
                                                    const allocation = e.allocation || 'store'

                                                    return (
                                                        <tr key={e.id} className={!isValid ? 'table-warning' : ''}>
                                                            <td>
                                                                <img className='mr-75' src={e.image} alt='angular' height='60'
                                                                     width='60'/>
                                                                <span className='align-middle font-weight-bold'>
                                                                    <ProductLink data={e}/>
                                                                </span>
                                                                {!isValid && (
                                                                    <small className="d-block text-danger">
                                                                        <AlertCircle size={12}/> Distribution doesn't match total
                                                                    </small>
                                                                )}
                                                            </td>
                                                            <td style={{ verticalAlign: 'middle' }}>
                                                                <NumberInput
                                                                    disabled={disabled}
                                                                    value={e.quantity}
                                                                    name='quantity'
                                                                    type='number'
                                                                    required
                                                                    style={{ width: '100%', minWidth: '80px' }}
                                                                    onChange={(qty) => handleChanges(value, e.id, {
                                                                        name: 'quantity',
                                                                        value: qty
                                                                    }, onChange)}
                                                                />
                                                            </td>
                                                            <td style={{ verticalAlign: 'middle' }}>
                                                                <InputGroup>
                                                                    <Input
                                                                        disabled={disabled}
                                                                        value={e.base_purchases_price}
                                                                        name='base_purchases_price'
                                                                        type='number'
                                                                        step={1}
                                                                        required
                                                                        onChange={(event) => {
                                                                            handleChanges(value, e.id, event.target, onChange)
                                                                        }}
                                                                        style={{
                                                                            padding: '0.25rem 0.5rem',
                                                                            fontSize: '0.875rem',
                                                                            width: '100%',
                                                                            minWidth: '100px'
                                                                        }}
                                                                    />
                                                                </InputGroup>
                                                            </td>
                                                            <td style={{ verticalAlign: 'middle' }}>
                                                                <InputGroup>
                                                                    <Input
                                                                        disabled={disabled}
                                                                        value={e.exchange_factor}
                                                                        name='exchange_factor'
                                                                        type='number'
                                                                        step={0.001}
                                                                        required
                                                                        onChange={(event) => {
                                                                            handleChanges(value, e.id, event.target, onChange)
                                                                        }}
                                                                        style={{
                                                                            padding: '0.25rem 0.5rem',
                                                                            fontSize: '0.875rem',
                                                                            width: '100%',
                                                                            minWidth: '100px'
                                                                        }}
                                                                    />
                                                                </InputGroup>
                                                            </td>
                                                            {
                                                                is_show_real_price &&
                                                                <td style={{ verticalAlign: 'middle' }}>
                                                                    <InputGroup>
                                                                        <Input
                                                                            disabled={disabled}
                                                                            value={e.purchases_price}
                                                                            name='purchases_price'
                                                                            type='number'
                                                                            step={1}
                                                                            required
                                                                            onChange={(event) => {
                                                                                handleChanges(value, e.id, event.target, onChange)
                                                                            }}
                                                                            style={{
                                                                                padding: '0.25rem 0.5rem',
                                                                                fontSize: '0.875rem',
                                                                                width: '100%',
                                                                                minWidth: '100px'
                                                                            }}
                                                                        />
                                                                    </InputGroup>
                                                                </td>
                                                            }

                                                            <td style={{ verticalAlign: 'middle' }}>
                                                                <InputGroup>
                                                                    <Input
                                                                        disabled={disabled}
                                                                        value={e.distributer_price}
                                                                        name='distributer_price'
                                                                        type='number'
                                                                        step={1}
                                                                        required
                                                                        onChange={(event) => {
                                                                            handleChanges(value, e.id, event.target, onChange)
                                                                        }}
                                                                        style={{
                                                                            padding: '0.25rem 0.5rem',
                                                                            fontSize: '0.875rem',
                                                                            width: '100%',
                                                                            minWidth: '100px'
                                                                        }}
                                                                    />
                                                                </InputGroup>
                                                            </td>
                                                            <td style={{ verticalAlign: 'middle' }}>
                                                                <Input
                                                                    disabled={disabled}
                                                                    value={e.source_sku}
                                                                    name='source_sku'
                                                                    type='text'
                                                                    onChange={(event) => {
                                                                        handleChanges(value, e.id, event.target, onChange)
                                                                    }}
                                                                    style={{
                                                                        padding: '0.25rem 0.5rem',
                                                                        fontSize: '0.875rem',
                                                                        width: '100%',
                                                                        minWidth: '100px'
                                                                    }}
                                                                />
                                                            </td>
                                                            <td style={{ verticalAlign: 'middle' }}>
                                                                <InputGroup>
                                                                    <Input
                                                                        disabled={disabled}
                                                                        value={e.normal}
                                                                        name='normal'
                                                                        type='number'
                                                                        step={1}
                                                                        required
                                                                        onChange={(event) => {
                                                                            handleChanges(value, e.id, event.target, onChange)
                                                                        }}
                                                                        style={{
                                                                            padding: '0.25rem 0.5rem',
                                                                            fontSize: '0.875rem',
                                                                            width: '100%',
                                                                            minWidth: '100px'
                                                                        }}
                                                                    />
                                                                </InputGroup>
                                                            </td>
                                                            <td style={{ verticalAlign: 'middle' }}>
                                                                <InputGroup>
                                                                    <Input
                                                                        disabled={disabled}
                                                                        value={e.sale_price}
                                                                        name='sale_price'
                                                                        type='number'
                                                                        step={1}
                                                                        required
                                                                        onChange={(event) => {
                                                                            handleChanges(value, e.id, event.target, onChange)
                                                                        }}
                                                                        style={{
                                                                            padding: '0.25rem 0.5rem',
                                                                            fontSize: '0.875rem',
                                                                            width: '100%',
                                                                            minWidth: '100px'
                                                                        }}
                                                                    />
                                                                </InputGroup>
                                                            </td>
                                                            <td style={{ verticalAlign: 'middle' }}>
                                                                <Input
                                                                    type="select"
                                                                    disabled={disabled}
                                                                    value={allocation}
                                                                    name="allocation"
                                                                    onChange={(event) => {
                                                                        handleChanges(value, e.id, {
                                                                            name: 'allocation',
                                                                            value: event.target.value
                                                                        }, onChange)
                                                                    }}
                                                                    style={{
                                                                        padding: '0.25rem 0.5rem',
                                                                        fontSize: '0.875rem',
                                                                        width: '100%',
                                                                        minWidth: '100px'
                                                                    }}
                                                                >
                                                                    <option value="store">Store</option>
                                                                    <option value="stock">Stock</option>
                                                                    <option value="total">total</option>
                                                                </Input>
                                                            </td>
                                                            <td style={{ verticalAlign: 'middle' }}>
                                                                {allocation === 'total' || allocation === 'stock' ? (
                                                                    <InputGroup>
                                                                        <Input
                                                                            disabled={disabled}
                                                                            value={e.stock_available_qty}
                                                                            name='stock_available_qty'
                                                                            type='number'
                                                                            min={0}
                                                                            required
                                                                            onChange={(event) => {
                                                                                handleChanges(value, e.id, {
                                                                                    name: 'stock_available_qty',
                                                                                    value: parseFloat(event.target.value) || 0
                                                                                }, onChange)
                                                                            }}
                                                                            style={{
                                                                                padding: '0.25rem 0.5rem',
                                                                                fontSize: '0.875rem',
                                                                                width: '100%',
                                                                                minWidth: '80px'
                                                                            }}
                                                                        />
                                                                    </InputGroup>
                                                                ) : (
                                                                    <div className="text-center text-muted" style={{ verticalAlign: 'middle', minWidth: '80px' }}>
                                                                        {allocation === 'store' ? 'N/A' : e.stock_available_qty || 0}
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td style={{ verticalAlign: 'middle' }}>
                                                                {allocation === 'total' || allocation === 'store' ? (
                                                                    <InputGroup>
                                                                        <Input
                                                                            disabled={disabled}
                                                                            value={e.store_available_qty}
                                                                            name='store_available_qty'
                                                                            type='number'
                                                                            min={0}
                                                                            required
                                                                            onChange={(event) => {
                                                                                handleChanges(value, e.id, {
                                                                                    name: 'store_available_qty',
                                                                                    value: parseFloat(event.target.value) || 0
                                                                                }, onChange)
                                                                            }}
                                                                            style={{
                                                                                padding: '0.25rem 0.5rem',
                                                                                fontSize: '0.875rem',
                                                                                width: '100%',
                                                                                minWidth: '80px'
                                                                            }}
                                                                        />
                                                                    </InputGroup>
                                                                ) : (
                                                                    <div className="text-center text-muted" style={{ verticalAlign: 'middle', minWidth: '80px' }}>
                                                                        {allocation === 'stock' ? 'N/A' : e.store_available_qty || 0}
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="text-center" style={{ verticalAlign: 'middle', minWidth: '80px' }}>
                                                                <Trash
                                                                    className='cursor-pointer'
                                                                    size={20}
                                                                    onClick={() => handleDelete(value, e.id, onChange)}
                                                                />
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            )
                                        }
                                        <tr>
                                            <td colSpan={is_show_real_price ? 13 : 12} className="text-center p-2" style={{ whiteSpace: 'nowrap' }}>
                                                <AddProductForm products={[]}
                                                                onSubmit={product => handleNewProduct(value, product, onChange)}/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={is_show_real_price ? 13 : 12} className="text-center p-2" style={{ whiteSpace: 'nowrap' }}>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <strong>Total price: {total.toFixed(3)}</strong>
                                                    </div>
                                                    <div className="text-right">
                                                        <small className="text-muted">
                                                            Stock Qty Total: {products.reduce((sum, p) => sum + (parseFloat(p.stock_available_qty) || 0), 0)} |
                                                            Store Qty Total: {products.reduce((sum, p) => sum + (parseFloat(p.store_available_qty) || 0), 0)}
                                                        </small>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </>
                                )
                            }
                        }
                    />
                    </tbody>
                </Table>
            </div>
        </div>
    )
}

function AddProductForm({products, onSubmit}) {
    const [formModal, setFormModal] = useState(false)
    const [data, setData] = useState(null)
    const [selectedOption, setSelectedOption] = useState(null)
    const [inputValue, setInputValue] = useState('') // Track input value
    const optionsCache = useRef(new Map()) // Use ref for persistent cache
    const [defaultOptions, setDefaultOptions] = useState([]) // Store default options

    const onChange = (value, {action, removedValue}) => {
        setSelectedOption(value)
        setData(value?.item)
    }

    const onInputChange = (newValue, {action}) => {
        setInputValue(newValue)
    }

    const handleSubmit = () => {
        if (onSubmit && data) {
            // Add stock distribution fields
            const productData = {
                ...data,
                allocation: 'store',
                stock_available_qty: 0,
                store_available_qty: data.quantity || 1
            }
            onSubmit(productData)
            // Reset selection but keep modal open for adding more products
            setSelectedOption(null)
            setData(null)
            // Keep the input value and options for next selection
        }
    }

    const handleModalClose = () => {
        setFormModal(false)
        // Reset selection when modal closes but keep cache
        setSelectedOption(null)
        setData(null)
        setInputValue('')
    }

    const renderItem = ({id, name, image, purchases_price, base_purchases_price, exchange_factor, stock, source_sku, distributer_price}) => (
        <div>
            <div className="d-flex justify-content-left align-items-center">
                <div className="avatar mr-50" width="32" height="32">
                    <img src={image} height="32" width="32" alt={name}/>
                </div>
                <div className="d-flex flex-column">
                    <h6 className="user-name text-truncate mb-0">{name}</h6>
                </div>
            </div>
            <div className="d-flex justify-content-around">
                <small className="text-truncate text-muted mb-0">Available Quantity: {stock}</small>
                <small className="text-truncate text-muted mb-0">Source SKU: {source_sku}</small>
                <small className="text-truncate text-muted mb-0">Purchase Price: {purchases_price}</small>
            </div>
        </div>
    )

    const loadInitialOptions = async () => {
        const cacheKey = 'initial'
        if (optionsCache.current.has(cacheKey)) {
            setDefaultOptions(optionsCache.current.get(cacheKey))
            return
        }

        try {
            const data = await api.autocomplete('')
            const options = data.map(({id, name, image, purchases_price, base_purchases_price, exchange_factor, stock, sale_price, normal, sku, source_sku, distributer_price}) => {
                return {
                    label: renderItem({
                        id,
                        name,
                        image,
                        purchases_price,
                        base_purchases_price,
                        exchange_factor,
                        stock,
                        source_sku,
                        distributer_price
                    }),
                    value: id,
                    item: {
                        id,
                        name,
                        image,
                        stock,
                        purchases_price,
                        base_purchases_price,
                        exchange_factor,
                        sale_price,
                        normal,
                        sku,
                        source_sku,
                        distributer_price,
                        quantity: 1,
                        allocation: 'store',
                        stock_available_qty: 0,
                        store_available_qty: 1
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

    // Load initial options when modal opens
    useEffect(() => {
        if (formModal) {
            loadInitialOptions()
        }
    }, [formModal])

    const promiseOptions = async (inputValue) => {
        // Return cached results if available
        const cacheKey = inputValue || 'empty'
        if (optionsCache.current.has(cacheKey)) {
            return optionsCache.current.get(cacheKey)
        }

        try {
            const data = await api.autocomplete(inputValue)
            const options = data.map(({id, name, image, purchases_price, base_purchases_price, exchange_factor, stock, sale_price, normal, sku, source_sku, distributer_price}) => {
                return {
                    label: renderItem({
                        id,
                        name,
                        image,
                        purchases_price,
                        base_purchases_price,
                        exchange_factor,
                        stock,
                        source_sku,
                        distributer_price
                    }),
                    value: id,
                    item: {
                        id,
                        name,
                        image,
                        stock,
                        purchases_price,
                        base_purchases_price,
                        exchange_factor,
                        sale_price,
                        normal,
                        sku,
                        source_sku,
                        distributer_price,
                        quantity: 1,
                        allocation: 'store',
                        stock_available_qty: 0,
                        store_available_qty: 1
                    }
                }
            })

            // Cache the results
            optionsCache.current.set(cacheKey, options)
            setDefaultOptions(options) // Update default options with new results
            return options
        } catch (error) {
            console.error('Failed to load options:', error)
            return []
        }
    }

    return (
        <>
            <PlusCircle
                className='cursor-pointer'
                size={22}
                onClick={() => setFormModal(true)}
            />
            <Modal isOpen={formModal} toggle={handleModalClose} className='modal-dialog-centered'
                   style={{maxWidth: 1200}}>
                <ModalHeader toggle={handleModalClose}>Add Product</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <AsyncSelect
                            isClearable={true}
                            className='react-select'
                            classNamePrefix='select'
                            value={selectedOption}
                            inputValue={inputValue}
                            loadOptions={promiseOptions}
                            defaultOptions={defaultOptions} // Use the loaded default options
                            cacheOptions
                            onChange={onChange}
                            onInputChange={onInputChange}
                            placeholder="Search for products..."
                        />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' onClick={handleSubmit}>
                        Save
                    </Button>{' '}
                </ModalFooter>
            </Modal>
        </>
    )
}