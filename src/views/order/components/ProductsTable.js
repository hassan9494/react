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
import { Controller } from 'react-hook-form'
import { PlusCircle, Trash } from 'react-feather'
import { useEffect, useState } from 'react'
import AsyncSelect from 'react-select/async/dist/react-select.esm'
import { confirm } from '@components/sweetalert'
import NumberInput from '@components/number-input'
import { api } from '@data/use-product'
import { getProductPrice } from "./helpers"
import ProductLink from "@components/product/link"
import ability from "../../../configs/acl/ability"

export default function ({ disabled, form }) {
    const is_show_real_price = ability.can('read', 'show_real_price_for_product_in_order')

    const handleChanges = (products, id, event, update) => {
        console.log(event.name)
        if (disabled) return
        const updated = products.map(product => {
            if (product.id === id) product[event.name] = event.value
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
        const exists = products?.some(e => e.id === product.id)
        if (!exists) {
            update([...products, product])
        }
    }

    const pricing = form.watch('options.pricing')


    const applyPricingPolicy = async (pricingPolicy, onChange) => {
        if (disabled) return
        onChange(pricingPolicy)
    }

    return (
        <Table striped hover size='sm'>
            <thead>
            <tr>
                <th>Product</th>
                {
                    is_show_real_price &&
                    <th width={'15%'}>Real Price</th>
                }

                <th width={'15%'}>Quantity</th>
                <th width={'15%'}>Price</th>
                <th width={'15%'} className="text-center">Actions</th>
            </tr>
            </thead>
            <tbody>
            <Controller
                control={form.control}
                defaultValue={null}
                name="products"
                render={
                    ({ onChange, value, name, ref }) => {
                        return (
                            <>
                                {
                                    (value || []).map(
                                        e => (
                                            <tr key={e.id}>
                                                <td>
                                                    <img className='mr-75' src={e.image} alt='angular' height='60' width='60' />
                                                    <span className='align-middle font-weight-bold'>
                                                        <ProductLink data={e} />
                                                    </span>
                                                </td>
                                                {
                                                    is_show_real_price &&
                                                    <td>
                                                        <InputGroup>
                                                            <Input
                                                                disabled={true}
                                                                value={ e.real_price }
                                                                name='real_price'
                                                                type='number'
                                                                step={1}
                                                                required
                                                                onChange={(event) => {
                                                                    handleChanges(value, e.id, event.target, onChange)
                                                                    form.setValue('options.pricing', 'custom')
                                                                }}
                                                            />
                                                            <InputGroupAddon addonType='append'>
                                                                <InputGroupText>$</InputGroupText>
                                                            </InputGroupAddon>
                                                        </InputGroup>
                                                    </td>
                                                }

                                                <td>
                                                    <NumberInput
                                                        disabled={disabled}
                                                        value={ e.quantity }
                                                        name='quantity'
                                                        type='number'
                                                        required
                                                        onChange={(qty) => handleChanges(value, e.id, { name: 'quantity', value: qty}, onChange)}
                                                    />
                                                </td>
                                                <td>
                                                    <InputGroup>
                                                        <Input
                                                            disabled={disabled}
                                                            value={ getProductPrice(e, pricing) }
                                                            name='price'
                                                            type='number'
                                                            step={1}
                                                            required
                                                            onChange={(event) => {
                                                                handleChanges(value, e.id, event.target, onChange)
                                                                form.setValue('options.pricing', 'custom')
                                                            }}
                                                        />
                                                        <InputGroupAddon addonType='append'>
                                                            <InputGroupText>$</InputGroupText>
                                                        </InputGroupAddon>
                                                    </InputGroup>
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
                                    <td colSpan={3}>
                                        <Controller
                                            control={form.control}
                                            defaultValue={null}
                                            name="options.pricing"
                                            render={
                                                ({ onChange, value, name, ref }) => {
                                                    return (
                                                        <ButtonGroup>
                                                            <Button outline color='primary' onClick={() => applyPricingPolicy('normal', onChange)} active={value === 'normal' || !value} size='sm'>
                                                                Normal
                                                            </Button>
                                                            <Button outline color='primary' onClick={() => applyPricingPolicy('min', onChange)} active={value === 'min'} size='sm'>
                                                                Distributor
                                                            </Button>
                                                            <Button outline color='primary' onClick={() => applyPricingPolicy('custom', onChange)} active={value === 'custom'} size='sm'>
                                                                Custom
                                                            </Button>
                                                        </ButtonGroup>
                                                    )
                                                }}
                                            />
                                    </td>
                                    <td className="text-center p-2">
                                        <AddProductForm  products={[]} onSubmit={product => handleNewProduct(value, product, onChange)}/>
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
function AddProductForm({ products, onSubmit }) {
    const [formModal, setFormModal] = useState(false)
    const [data, setData] = useState(null)

    const onChange = (value, { action, removedValue }) => {
        setData(value?.item)
    }

    const handleSubmit = () => {
        if (onSubmit && data) onSubmit(data)
        // setFormModal(false)
    }

    const renderItem = ({ id, name, image, price, stock }) => (
        <div className="d-flex justify-content-left align-items-center">
            <div className="avatar mr-50" width="32" height="32">
                <img src={image} height="32" width="32" />
            </div>
            <div className="d-flex flex-column">
                <h6 className="user-name text-truncate mb-0">{ name }</h6><small
                className="text-truncate text-muted mb-0">Available Quantity: { stock }</small>
            </div>
        </div>
    )

    const promiseOptions = async inputValue => {
        const data = await api.autocomplete(inputValue)
        return data.map(({ id, name, image, price, stock, min_price, normal_price, sku }) => {
            return {
                label: renderItem({ id, name, image, price, stock }),
                value: id,
                item: { id, name, image, stock, price, min_price, normal_price, sku }
            }
        })
    }

    return (
        <>
            <PlusCircle
                className='cursor-pointer'
                size={22}
                onClick={() => setFormModal(true)}
            />
            <Modal isOpen={formModal} toggle={() => setFormModal(!formModal)} className='modal-dialog-centered'>
                <ModalHeader toggle={() => setFormModal(!formModal)}>Add Product</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <AsyncSelect
                            isClearable={true}
                            className='react-select'
                            classNamePrefix='select'
                            loadOptions={promiseOptions}
                            cacheOptions
                            onChange={onChange}
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
