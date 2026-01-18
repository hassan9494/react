import React from 'react'
import {
    Input,
    Button,
    InputGroupAddon, InputGroupText, InputGroup, Table
} from 'reactstrap'
import { Controller } from 'react-hook-form'
import { Plus, PlusCircle, Trash } from 'react-feather'
import NumberInput from '@components/number-input'
import ability from "../../../configs/acl/ability"

export default function Datasheets({form, disabled, onUpdate, isMigrated}) {
    const is_show_real_price = ability.can('read', 'show_real_price_for_extra_in_order')
    const newRow = () => ({ id: Date.now(), price: 1, quantity: 1, name: '', discount : 0 })

    const data = form.watch('extra_items')

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
                            <Input
                                disabled={disabled || isMigrated}
                                value={row.number}
                                name='number'
                                type='number'
                                required
                                onChange={(value) => updateRow(row.id, 'number', event.target.value, onChange)}
                            />
                        </td>
                        <td>
                            <Input
                                disabled={disabled || isMigrated}
                                type='text'
                                name='name'
                                placeholder='Name'
                                value={row.name}
                                required
                                onChange={(event) => updateRow(row.id, 'name', event.target.value, onChange)}
                            />
                        </td>
                        {
                            is_show_real_price &&
                            <td>
                                <NumberInput
                                    disabled={disabled || isMigrated}
                                    value={row.real_price}
                                    name='real_price'
                                    type='number'
                                    required
                                    onChange={(value) => updateRow(row.id, 'real_price', value, onChange)}
                                />
                            </td>
                        }

                        <td>
                            <NumberInput
                                disabled={disabled || isMigrated}
                                value={row.quantity}
                                name='quantity'
                                type='number'
                                required
                                onChange={(value) => updateRow(row.id, 'quantity', value, onChange)}
                            />
                        </td>
                        <td>
                            <NumberInput
                                disabled={disabled || isMigrated}
                                value={row.price}
                                name='price'
                                type='number'
                                required
                                onChange={(value) => updateRow(row.id, 'price', value, onChange)}
                            />
                        </td>
                        <td>
                            <InputGroup>
                                <Input
                                    disabled={disabled || isMigrated}
                                    value={row.discount}
                                    name='discount'
                                    type='number'
                                    step={0.01}
                                    required
                                    onChange={(event) => {
                                        handleChanges(value, row.id, {
                                            name: 'discount',
                                            value: parseFloat(event.target.value) || 0
                                        }, onChange)
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
                                onClick={() => deleteRow(row.id, onChange)}
                            />
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
                        <PlusCircle
                            className='cursor-pointer'
                            size={22}
                            onClick={addRow}
                        />
                    </td>
                </tr>
                </tbody>
            </Table>
        </>
    )
}
