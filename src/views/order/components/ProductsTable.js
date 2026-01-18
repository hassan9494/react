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
    Table
} from 'reactstrap'
import {Controller} from 'react-hook-form'
import {PlusCircle, Trash} from 'react-feather'
import {useEffect, useRef, useState} from 'react'
import AsyncSelect from 'react-select/async/dist/react-select.esm'
import {confirm} from '@components/sweetalert'
import NumberInput from '@components/number-input'
import {api} from '@data/use-product'
import {getProductDiscount, getProductPrice} from "./helpers"
import ProductLink from "@components/product/link"
import ability from "../../../configs/acl/ability"

export default function ({disabled, form, isMigrated}) {
    const is_show_real_price = ability.can('read', 'show_real_price_for_product_in_order')
    const [showTd, setShowTd] = useState('location')
    const [showRP, setShowRP] = useState(false)

    const orderStatus = form.watch('status')

    const handleChanges = (products, id, event, update) => {
        if (disabled || isMigrated) return
        const updated = products.map(product => {
            if (product.id === id) product[event.name] = event.value
            return product
        })
        update(updated)
    }

    const handleDelete = (products, id, update) => {
        if (disabled || isMigrated) return
        const updated = products.filter(e => e.id !== id).map(e => e)
        confirm(() => {
            update(updated)
        })
    }

    const handleNewProduct = (products, product, update) => {
        if (disabled || isMigrated) return
        products = products ?? []
        product.quantity = 1
        product.number = 1
        product.discount = 0
        const exists = products?.some(e => e.id === product.id)
        if (!exists) {
            update([...products, product])
        }
    }

    const pricing = form.watch('options.pricing')


    const applyPricingPolicy = async (pricingPolicy, onChange) => {
        if (disabled) return

        // Update pricing immediately
        onChange(pricingPolicy)

        // Update all product prices based on new pricing policy
        const updatedProducts = form.getValues('products').map(product => ({
            ...product,
            price: getProductPrice(product, pricingPolicy) // Update price based on new policy
        }))

        form.setValue('products', updatedProducts) // Set updated products back to form
    }
    const applyShowTd = async (showTd, onChange) => {
        setShowTd(showTd)
    }
    const applyShowRP = async (onChange) => {
        setShowRP(!showRP)
    }

    return (
        <Table striped hover size='sm'>
            <thead>
            <tr>
                <th width={'2%'}>Order</th>
                <th width={'40%'}>Product</th>
                {
                    is_show_real_price && showRP &&
                    <th width={'12%'}>Real Price</th>
                }

                <th width={'12%'}>Quantity</th>
                <th width={'12%'}>Price</th>
                <th width={'12%'}>discount</th>
                <th width={'12%'}>{showTd === 'location' ? 'Location' : showTd === 'normal' ? 'Normal' : 'Distributor'}</th>
                <th width={'10%'} className="text-center">Actions</th>
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
                                            // Only show borders if order is NOT completed
                                            // const isCompleted = orderStatus === 'COMPLETED'
                                            // const inProgress = orderStatus === 'IN_PROGRESS'
                                            const pendding = orderStatus === 'PENDING'


                                            let rowStyle = {}
                                            if (pendding) {
                                                // Updated conditions:
                                                // Red border: No stock available at all (both warehouse and store)
                                                // Orange border: Store available is less than ordered quantity (even if some is available)
                                                const hasZeroAllStocks = e.stock === 0 && e.stock_available === 0 && e.store_available === 0
                                                const hasInsufficientStoreStock = e.store_available < e.quantity

                                                if (hasZeroAllStocks) {
                                                    rowStyle = { borderLeft: '4px solid red', borderRight: '4px solid red' }
                                                } else if (hasInsufficientStoreStock) {
                                                    rowStyle = { borderLeft: '4px solid orange', borderRight: '4px solid orange' }
                                                }
                                            }


                                            return (
                                                <tr key={e.id} style={rowStyle}>
                                                    <td>
                                                        <Input
                                                            disabled={disabled || isMigrated}
                                                            value={e.number}
                                                            name='number'
                                                            type='number'
                                                            required
                                                            onChange={(event) => {
                                                                handleChanges(value, e.id, event.target, onChange)
                                                            }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <img className='mr-75' src={e.image} alt='angular' height='60'
                                                             width='60'/>
                                                        <span className='align-middle font-weight-bold'>
                                                        <ProductLink data={e}/>
                                                    </span>
                                                    </td>
                                                    {
                                                        is_show_real_price && showRP &&
                                                        <td>
                                                        <span>
                                                        {showRP === true ? e.real_price : ''}
                                                    </span>
                                                            {/*<InputGroup>*/}
                                                            {/*    <Input*/}
                                                            {/*        disabled={true}*/}
                                                            {/*        value={ e.real_price }*/}
                                                            {/*        name='real_price'*/}
                                                            {/*        type='number'*/}
                                                            {/*        step={1}*/}
                                                            {/*        required*/}
                                                            {/*        onChange={(event) => {*/}
                                                            {/*            handleChanges(value, e.id, event.target, onChange)*/}
                                                            {/*            form.setValue('options.pricing', 'custom')*/}
                                                            {/*        }}*/}
                                                            {/*    />*/}
                                                            {/*    <InputGroupAddon addonType='append'>*/}
                                                            {/*        <InputGroupText>$</InputGroupText>*/}
                                                            {/*    </InputGroupAddon>*/}
                                                            {/*</InputGroup>*/}
                                                        </td>
                                                    }

                                                    <td>
                                                        <NumberInput
                                                            disabled={disabled || isMigrated}
                                                            value={e.quantity}
                                                            name='quantity'
                                                            type='number'
                                                            required
                                                            onChange={(qty) => handleChanges(value, e.id, {
                                                                name: 'quantity',
                                                                value: qty
                                                            }, onChange)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <InputGroup>
                                                            <Input
                                                                disabled={disabled || isMigrated}
                                                                value={getProductPrice(e, pricing)}
                                                                name='price'
                                                                type='number'
                                                                step={1}
                                                                required
                                                                onChange={(event) => {
                                                                    handleChanges(value, e.id, event.target, onChange)
                                                                    form.setValue('options.pricing', 'custom')
                                                                }}
                                                            />
                                                        </InputGroup>
                                                    </td>
                                                    <td>
                                                        <InputGroup>
                                                            <Input
                                                                disabled={disabled || isMigrated}
                                                                value={e.discount}
                                                                name='discount'
                                                                type='number'
                                                                step={0.01}
                                                                required
                                                                onChange={(event) => {
                                                                    handleChanges(value, e.id, {
                                                                        name: 'discount',
                                                                        value: parseFloat(event.target.value) || 0
                                                                    }, onChange)
                                                                }}
                                                            />
                                                        </InputGroup>
                                                    </td>
                                                    <td>
                                                    <span>
                                                        {showTd === 'location' ? e.location : showTd === 'normal' ? e.normal_price : e.min_price}
                                                    </span>
                                                    </td>
                                                    <td className="text-center">
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
                                    <td colSpan={6}>
                                        <ButtonGroup>
                                            <Button outline color='primary'
                                                    onClick={() => applyShowTd('location', onChange)}
                                                    active={showTd === 'location'} size='sm'>
                                                Location
                                            </Button>
                                            <Button outline color='primary'
                                                    onClick={() => applyShowTd('distributer', onChange)}
                                                    active={showTd === 'distributer'} size='sm'>
                                                Distributor
                                            </Button>
                                            <Button outline color='primary'
                                                    onClick={() => applyShowTd('normal', onChange)}
                                                    active={showTd === 'normal'} size='sm'>
                                                Normal
                                            </Button>
                                        </ButtonGroup>
                                        {
                                            is_show_real_price &&
                                            <ButtonGroup style={{marginLeft:'10px'}}>
                                                <Button outline color='primary' onClick={() => applyShowRP(onChange)}
                                                        active={showRP} size='sm'>
                                                    Real Price
                                                </Button>

                                            </ButtonGroup>
                                        }


                                    </td>

                                    <td className="text-center p-2">
                                        <AddProductForm products={[]}
                                                        onSubmit={product => handleNewProduct(value, product, onChange)}/>
                                    </td>
                                </tr>
                            </>
                        )
                    }
                }
            />
            </tbody>
        </Table>
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

    const onInputChange = (newValue, { action }) => {
        setInputValue(newValue)
    }

    const handleSubmit = () => {
        if (onSubmit && data) {
            onSubmit(data)
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

    const renderItem = ({id, name, image, price, stock, location, normal, sale_price, distributer_price}) => (
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
                <small
                    className="text-truncate text-muted mb-0">Available Quantity: {stock}</small>
                <small
                    className="text-truncate text-muted mb-0">Location: {location}</small>
                <small
                    className="text-truncate text-muted mb-0">Price: {normal}</small>
                <small
                    className="text-truncate text-muted mb-0">Sale Price: {sale_price}</small>
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
            const options = data.map(({id, name, image, price, stock, min_price, normal_price, sku, location, sale_price, distributer_price, normal}) => {
                return {
                    label: renderItem({id, name, image, price, stock, location, normal_price, sale_price, distributer_price, normal}),
                    value: id,
                    item: {id, name, image, stock, price, min_price, normal_price, sku, location, sale_price, distributer_price, normal}
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
            const options = data.map(({id, name, image, price, stock, min_price, normal_price, sku, location, sale_price, distributer_price, normal}) => {
                return {
                    label: renderItem({id, name, image, price, stock, location, normal_price, sale_price, distributer_price, normal}),
                    value: id,
                    item: {id, name, image, stock, price, min_price, normal_price, sku, location, sale_price, distributer_price, normal}
                }
            })

            // Cache the results
            optionsCache.current.set(cacheKey, options)
            setDefaultOptions(options)
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