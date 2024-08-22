import {
    Input,
    Button,
    InputGroupAddon, InputGroupText, InputGroup, Table
} from 'reactstrap'
import { Controller } from 'react-hook-form'
import { Plus, PlusCircle, Trash } from 'react-feather'
import NumberInput from '@components/number-input'

export default function Datasheets({form, disabled, fieldName, onUpdate}) {

    const newRow = {price: 1, quantity: 1, name: ''}

    const data = form.watch(fieldName)


    const addRow = () => {
        if (disabled) return
        const newData = data || []
        form.setValue(fieldName, [...newData, newRow])
    }

    const deleteRow = (i, onChange) => {
        const newData = data
        newData.splice(i, 1)
        onChange(newData)
        onUpdate()
    }

    const updateRow = (i, row, name, value, onChange) => {
        const newData = data
        newData[i] = {...row, [name]: value}
        onChange(newData)
        onUpdate()
    }


    const renderRow = ({value, onChange}) => (
        <>
            {
                value?.map((row, i) => (
                    <tr key={i}>
                        <td>
                            <Input
                                disabled={disabled}
                                type='text'
                                name='name'
                                placeholder='Name'
                                value={row.name}
                                required
                                onChange={(event) => updateRow(i, row, 'name', event.target.value, onChange)}
                            />
                        </td>
                        <td>
                            <NumberInput
                                disabled={disabled}
                                value={row.quantity}
                                name='quantity'
                                type='number'
                                required
                                onChange={(value) => updateRow(i, row, 'quantity', value, onChange)}
                            />
                        </td>
                        <td>
                            <NumberInput
                                disabled={disabled}
                                value={row.price}
                                name='price'
                                type='number'
                                required
                                onChange={(value) => updateRow(i, row, 'price', value, onChange)}
                            />
                        </td>
                        <td className="text-center">
                            <Trash
                                className='cursor-pointer'
                                size={20}
                                onClick={() => deleteRow(i, onChange)}
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
                    <th>Extra</th>
                    <th width={'15%'}>Quantity</th>
                    <th width={'15%'}>Price</th>
                    <th width={'15%'} className="text-center">Actions</th>
                </tr>
                </thead>
                <tbody>
                <Controller
                    control={form.control}
                    defaultValue={[]}
                    name={fieldName}
                    render={renderRow}
                />
                <tr>
                    <td colSpan={3}>
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
