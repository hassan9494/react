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
import {getProductDiscount, getProductPrice} from "./helpers"
import ProductLink from "@components/product/link"
import ability from "../../../../configs/acl/ability"

export default function ({ disabled, form, isMigrated}) {
    const is_show_real_price = ability.can('read', 'show_real_price_for_product_in_order')
    const [showTd, setShowTd] = useState('location')

    const handleChanges = (products, id, event, update) => {
        if (disabled || isMigrated) return
        const updated = products.map(product => {
            if (product.id === id) product[event.name] = event.value
            return product
        })
        update(updated)
    }
    const products = form.watch('products')
    useEffect(() => {

        products?.map(product => {
            if (product.returned_quantity === undefined) {
                product.returned_quantity = 0
            }
            if (product.main_discount === undefined) {
                product.main_discount = product.discount
            }
            console.log(product)
        })

    }, [products])
    // const handleDelete = (products, id, update) => {
    //     if (disabled || isMigrated) return
    //     const updated = products.filter(e => e.id !== id).map(e => e)
    //     confirm(() => {
    //         update(updated)
    //     })
    // }


    const pricing = form.watch('options.pricing')

    return (
        <Table striped hover size='sm'>
            <thead>
            <tr>
                <th width={'2%'}>Order</th>
                <th width={'40%'}>Product</th>

                <th width={'12%'}>Quantity</th>
                <th width={'12%'}>Returned Quantity</th>
                <th width={'12%'}>Price</th>
                <th width={'12%'}>discount</th>
                <th width={'12%'}>Main discount</th>
                <th width={'10%'} className="text-center">Actions</th>
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
                                                    <span>{e.number}</span>
                                                </td>
                                                <td>
                                                    <img className='mr-75' src={e.image} alt='angular' height='60' width='60' />
                                                    <span className='align-middle font-weight-bold'>
                                                        <ProductLink data={e} />
                                                    </span>
                                                </td>

                                                <td>
                                                    <span>{e.quantity}</span>
                                                </td>

                                                <td>
                                                    <input
                                                        type="number"
                                                        disabled={disabled || isMigrated}
                                                        value={e.returned_quantity}
                                                        min={0}
                                                        defaultValue={0}
                                                        max={e.quantity}
                                                        className="form-control" // Add basic styling
                                                        onChange={(event) => {
                                                            let newValue = parseInt(event.target.value) || 0

                                                            // Enforce min/max constraints
                                                            newValue = Math.max(0, Math.min(newValue, e.quantity))

                                                            handleChanges(value, e.id, {
                                                                name: 'returned_quantity',
                                                                value: newValue
                                                            }, onChange)
                                                        }}
                                                        onKeyDown={(event) => {
                                                            // Prevent entering negative numbers or decimal points
                                                            if (['-', '+', 'e', 'E', '.'].includes(event.key)) {
                                                                event.preventDefault()
                                                            }
                                                        }}
                                                    />
                                                </td>
                                                <td>
                                                    <span>{getProductPrice(e, pricing)}</span>
                                                </td>
                                                <td>
                                                    <span>{e.discount }</span>
                                                </td>
                                                <td>
                                                    <span>{e.main_discount}</span>
                                                </td>
                                                <td className="text-center">
                                                    {/*<Trash*/}
                                                    {/*    className='cursor-pointer'*/}
                                                    {/*    size={20}*/}
                                                    {/*    onClick={() => handleDelete(value, e.id, onChange)}*/}
                                                    {/*/>*/}
                                                </td>
                                            </tr>
                                        )
                                    )
                                }
                                <tr>
                                    <td colSpan={6}>
                                                        {/*<ButtonGroup>*/}
                                                        {/*    <Button outline color='primary' onClick={() => applyShowTd('location', onChange)} active={showTd === 'location'}  size='sm'>*/}
                                                        {/*        Location*/}
                                                        {/*    </Button>*/}
                                                        {/*    <Button outline color='primary' onClick={() => applyShowTd('distributer', onChange)} active={showTd === 'distributer'} size='sm'>*/}
                                                        {/*        Distributor*/}
                                                        {/*    </Button>*/}
                                                        {/*    <Button outline color='primary' onClick={() => applyShowTd('normal', onChange)} active={showTd === 'normal'} size='sm'>*/}
                                                        {/*        Normal*/}
                                                        {/*    </Button>*/}
                                                        {/*</ButtonGroup>*/}

                                    </td>
                                    <td className="text-center p-2">
                                        {/*<AddProductForm  products={[]} onSubmit={product => handleNewProduct(value, product, onChange)}/>*/}
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
