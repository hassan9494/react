import {
    Button,
    FormGroup,
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
import {api} from '@data/use-brand'
import ProductLink from "@components/product/link"

export default function ({disabled, form, isMigrated}) {


    const handleDelete = (brands, id, update) => {
        if (disabled || isMigrated) return
        const updated = brands.filter(e => e.id !== id).map(e => e)
        confirm(() => {
            update(updated)
        })
    }

    const handleNewBrand = (brands, brand, update) => {
        if (disabled || isMigrated) return
        brands = brands ?? []
        const exists = brands?.some(e => e.id === brand.id)
        if (!exists) {
            update([...brands, brand])
        }
    }

    return (
        <Table striped hover size='sm'>
            <thead>
            <tr>
                <th width={'70%'}>Brand</th>
                <th width={'10%'} className="text-center">Actions</th>
            </tr>
            </thead>
            <tbody>
            <Controller
                control={form.control}
                defaultValue={null}
                name="brands"
                render={
                    ({onChange, value, name, ref}) => {
                        return (
                            <>
                                {
                                    (value || []).map(
                                        e => (
                                            <tr key={e.id}>
                                                <td>
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
                                        <AddBrandForm brands={[]}
                                                      onSubmit={brand => handleNewBrand(value, brand, onChange)}/>
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

function AddBrandForm({brands, onSubmit}) {
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
            // Reset selection but keep modal open for adding more brands
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

    const renderItem = ({id, name}) => (
        <div>
            <div className="d-flex justify-content-left align-items-center">

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
            const options = data.map(({id, name }) => {
                return {
                    label: renderItem({id, name}),
                    value: id,
                    item: {id, name}
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
            const options = data.map(({id, name}) => {
                return {
                    label: renderItem({id, name}),
                    value: id,
                    item: {id, name}
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
                <ModalHeader toggle={handleModalClose}>Add Brand</ModalHeader>
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
                            placeholder="Search for brands..."
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