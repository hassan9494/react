import { Col, FormGroup, Input, Label, Row } from 'reactstrap'
import { useEffect, useState } from 'react'
import AsyncSelect from 'react-select/async/dist/react-select.esm'
import { api } from '@data/use-order'
import { Controller } from 'react-hook-form'
import Select from "react-select"

export default function ({ form, order, disabled }) {

    const [oldOrder, setOldOrder] = useState()
    const [oldOrderSelect, setOldOrderSelect] = useState()
    const list = [
        {
            label: 'DRAFT',
            value: 'DRAFT'
        },
        {
            label: 'COMPLETED',
            value: 'COMPLETED'
        }
    ]

    const handleChangeStatus = (status) => {
        form.setValue('status', status?.value || 0)
    }

    useEffect(() => {
        if (!oldOrder) setOldOrder(order?.order)
        if (!oldOrder) setOldOrderSelect(order?.oldOrder ?? order?.order)
        if (!oldOrder) form.setValue('order_id', order?.oldOrder?.id ?? order?.order?.id)

    }, [order])

    useEffect(() => {
        form.setValue('products', oldOrder?.products)
        form.setValue('extra_items', oldOrder?.extra_items)
        form.setValue('discount_percentage', oldOrder?.discount_percentage)
    }, [oldOrder])

    const onOldOrderChange = (value, { action, removedValue }) => {
        setOldOrder(value?.item)
        setOldOrderSelect(value?.item)


    }
    const renderItem = (item) => (
        <div className="d-flex justify-content-left align-items-center">
            <div className="d-flex flex-column">
                <h6 className="user-name text-truncate mb-0">{ item?.tax_number }</h6>
            </div>
        </div>
    )

    const promiseOptions = async inputValue => {
        const data = await api.autocomplete(inputValue)
        return data.map(({ id, tax_number, products, extra_items, discount_percentage, discount, customer }) => {
            return {
                label: renderItem({ id, tax_number, products, extra_items, discount_percentage, discount, customer}),
                value: id,
                item: { id, tax_number, products, extra_items, discount_percentage, discount, customer }
            }
        })
    }


    return (
        <Row>
            <Col sm='12'>
                <FormGroup>
                    <Controller
                        control={form.control}
                        defaultValue={null}
                        name="order_id"
                        render={
                            ({ onChange, value, name, ref }) => {
                                return (
                                    <AsyncSelect
                                        isClearable={true}
                                        className='react-select'
                                        classNamePrefix='select'
                                        defaultOptions
                                        isDisabled={disabled}
                                        value={{value, label: renderItem(oldOrderSelect)}}
                                        loadOptions={promiseOptions}
                                        cacheOptions
                                        onChange={
                                            (value, extra) => {
                                                onChange(value?.item.id)
                                                onOldOrderChange(value, extra)
                                            }
                                        }
                                    />

                                )
                            }}
                        />

                </FormGroup>
            </Col>
            <Col sm='12'>
                <FormGroup>
                    <div className={'d-flex justify-content-between'}>
                        <Label for='notes'>Customer Name: {order?.oldOrder?.customer ? order?.oldOrder?.customer.name : oldOrder?.customer?.name}</Label>
                        <Label for='notes'>Customer Phone: {order?.oldOrder?.customer ? order?.oldOrder?.customer.phone : oldOrder?.customer?.phone}</Label>
                        <Label for='notes'>Customer Email: {order?.oldOrder?.customer ? order?.oldOrder?.customer.email : oldOrder?.customer?.email}</Label>

                    </div>

                </FormGroup>
            </Col>
            <Col sm='12'>
                <FormGroup>
                    <Label for='notes'>Reason for return</Label>
                    <Input

                        id='notes'
                        type='textarea'
                        name="notes"
                        innerRef={form.register({required: false})}
                        invalid={form.errors.notes && true}
                    />
                </FormGroup>
            </Col>
        </Row>
    )
}