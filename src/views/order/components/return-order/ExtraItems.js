import React, {useEffect} from 'react'
import {
    Input,
    Button,
    InputGroupAddon, InputGroupText, InputGroup, Table
} from 'reactstrap'
import { Controller } from 'react-hook-form'
import { Plus, PlusCircle, Trash } from 'react-feather'
import NumberInput from '@components/number-input'
import ability from "../../../../configs/acl/ability"

export default function Datasheets({form, disabled, onUpdate, isMigrated}) {
    const is_show_real_price = ability.can('read', 'show_real_price_for_extra_in_order')
    const newRow = () => ({ id: Date.now(), price: 1, quantity: 1, name: '', discount : 0 })

    const data = form.watch('extra_items')
    useEffect(() => {

        data?.map(product => {
            if (product.returned_quantity === undefined) {
                product.returned_quantity = 0
            }
            console.log(product)
        })

    }, [data])

    const addRow = () => {
        if (disabled || isMigrated) return
        const newData = data || []
        form.setValue('extra_items', [...newData, newRow()])
        onUpdate()
    }

    const deleteRow = (id, onChange) => {
        if (isMigrated) return
        const newData = data.filter(row => row.id !== id)
        onChange(newData)
        onUpdate()
    }

    const updateRow = (id, name, value, onChange) => {
        if (isMigrated) return
        const newData = data.map(row => (row.id === id ? {...row, [name]: value} : row)
        )
        onChange(newData)
        onUpdate()
    }
    const handleChanges = (data, id, event, update) => {
        if (disabled || isMigrated) return
        const updated = data.map(product => {
            if (product.id === id) product[event.name] = event.value
            return product
        })
        update(updated)
    }
    const renderRow = ({value, onChange}) => (
        <>
            {
                value?.map((row) => (
                    <tr key={row.id}>
                        <td>
                            <span>{row.number}</span>
                        </td>
                        <td>
                            <span>{row.name}</span>
                        </td>
                        {
                            is_show_real_price &&
                            <span>{row.real_price}</span>
                        }

                        <td>
                            <span>{row.quantity}</span>
                        </td>
                        <td>
                            <input
                                type="number"
                                disabled={disabled || isMigrated}
                                value={row.returned_quantity}
                                min={0}
                                defaultValue={0}
                                max={row.quantity}
                                className="form-control" // Add basic styling
                                onChange={(event) => {
                                    let newValue = parseInt(event.target.value) || 0

                                    // Enforce min/max constraints
                                    newValue = Math.max(0, Math.min(newValue, row.quantity))

                                    handleChanges(value, row.id, {
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
                            {/*<NumberInput*/}
                            {/*    disabled={disabled || isMigrated}*/}
                            {/*    value={ row.returned_quantity }*/}
                            {/*    name='returned_quantity'*/}
                            {/*    type='number'*/}
                            {/*    min={0}*/}
                            {/*    max={row.quantity}*/}
                            {/*    required*/}
                            {/*    onChange={(qty) => handleChanges(value, row.id, { name: 'returned_quantity', value: qty}, onChange)}*/}
                            {/*/>*/}
                        </td>
                        <td>
                            <span>{row.price}</span>
                        </td>
                        <td>
                            <span>{row.discount}</span>
                        </td>
                        <td className="text-center">
                            {/*<Trash*/}
                            {/*    className='cursor-pointer'*/}
                            {/*    size={20}*/}
                            {/*    onClick={() => deleteRow(row.id, onChange)}*/}
                            {/*/>*/}
                        </td>
                    </tr>
                ))
            }
        </>
    )

    return (
        <>
            <Table striped hover size='sm'>
                <thead>
                <tr>
                    <th>Order</th>
                    <th>Extra</th>
                    {
                        is_show_real_price &&
                        <th width={'15%'}>Real Price</th>
                    }

                    <th width={'15%'}>Quantity</th>
                    <th width={'15%'}>Returned Quantity</th>
                    <th width={'15%'}>Price</th>
                    <th width={'15%'}>Discount</th>
                    <th width={'15%'} className="text-center">Actions</th>
                </tr>
                </thead>
                <tbody>
                <Controller
                    control={form.control}
                    defaultValue={[]}
                    name={'extra_items'}
                    render={renderRow}
                />
                <tr>
                    <td colSpan={is_show_real_price ? 4 : 3}>
                    </td>
                    <td className={'text-center py-2'}>
                        {/*<PlusCircle*/}
                        {/*    className='cursor-pointer'*/}
                        {/*    size={22}*/}
                        {/*    onClick={addRow}*/}
                        {/*/>*/}
                    </td>
                </tr>
                </tbody>
            </Table>
        </>
    )
}
