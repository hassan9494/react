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
import ProductLink from "@components/product/link"
import ability from "../../../../configs/acl/ability"

export default function ({disabled, form, isMigrated}) {

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
        const exists = products?.some(e => e.id === product.id)
        if (!exists) {
            update([...products, product])
        }
    }

    return (
        <Table striped hover size='sm'>
            <thead>
            <tr>
                <th width={'70%'}>Product</th>
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
                                        e => (
                                            <tr key={e.id}>
                                                <td>
                                                    <img className='mr-75' src={e.image} alt='angular' height='60'
                                                         width='60'/>
                                                    <span className='align-middle font-weight-bold'>
                                                        <ProductLink data={e}/>
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
                                    )
                                }
                                <tr>

                                    <td colSpan={1}></td>
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

    const renderItem = ({id, name, image}) => (
        <div>
            <div className="d-flex justify-content-left align-items-center">
                <div className="avatar mr-50" width="32" height="32">
                    <img src={image} height="32" width="32" alt={name}/>
                </div>
                <div className="d-flex flex-column">
                    <h6 className="user-name text-truncate mb-0">{name}</h6>

                </div>
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
            const options = data.map(({id, name, image }) => {
                return {
                    label: renderItem({id, name, image}),
                    value: id,
                    item: {id, name, image}
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
            const options = data.map(({id, name, image}) => {
                return {
                    label: renderItem({id, name, image}),
                    value: id,
                    item: {id, name, image}
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