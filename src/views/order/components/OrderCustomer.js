import { Col, FormGroup, Input, Label, Row } from 'reactstrap'
import { useEffect, useState } from 'react'
import AsyncSelect from 'react-select/async/dist/react-select.esm'
import { api } from '@data/use-user'
import { Controller } from 'react-hook-form'
import Select from "react-select"

export default function ({ form, order, disabled }) {

    const [user, setUser] = useState()
    const [cashier, setCashier] = useState()
    const customer = form.watch('customer')

    useEffect(() => {
        if (!customer) {
            form.setValue('customer', customer)
        }
    }, [customer])

    useEffect(() => {
        if (!user) setUser(order?.user)
        if (!cashier) setCashier(order?.cashier)
    }, [order])

    const onUserChange = (value, { action, removedValue }) => {
        setUser(value?.item)
        if (value?.item) {
            form.setValue('customer.name', value.item.name)
            form.setValue('customer.email', value.item.email)
            form.setValue('customer.phone', value.item.phone)
            // form.setValue('options.tax_exempt', !!value.item?.taxExempt?.tax_exempt)
            // form.setValue('options.tax_zero', value.item?.taxExempt?.tax_zero)
        }
    }

    const onCashierChange = (value, { action, removedValue }) => {
        setCashier(value?.item)
        if (value?.item) {
            form.setValue('cashier.name', value.item.name)
            form.setValue('cashier.email', value.item.email)
            form.setValue('cashier.phone', value.item.phone)
        }
    }

    const renderItem = (item) => (
        <div className="d-flex justify-content-left align-items-center">
            <div className="d-flex flex-column">
                <h6 className="user-name text-truncate mb-0">{ item?.name }</h6>
                <small className="text-truncate text-muted mb-0">{ item?.email }</small>
            </div>
        </div>
    )

    const promiseOptions = async inputValue => {
        const data = await api.autocomplete(inputValue)
        return data.map(({ id, name, email, phone, taxExempt }) => {
            return {
                label: renderItem({ id, name, email, phone, taxExempt }),
                value: id,
                item: { id, name, email, phone, taxExempt }
            }
        })
    }

    const cashierOptions = async inputValue => {
        const data = await api.autocompleteCashier(inputValue)
        return data.map(({ id, name, email, phone }) => {
            return {
                label: renderItem({ id, name, email, phone }),
                value: id,
                item: { id, name, email, phone }
            }
        })
    }

    const identity_number_typeOptions =  [
        {
            label: 'الرقم الوطني',
            value: 'NIN'
        },
        {
            label: 'الرقم الشخصي لغير الأردني',
            value: 'PN'
        },
        {
            label: 'الرقم الضريبي للمشتري',
            value: 'TN'
        }
    ]

    const handleChangeType = (status) => {
        form.setValue('identity_number_type', status?.value || 0)
    }


    return (
        <Row>
            <Col sm='12'>
                <FormGroup>
                    <Controller
                        control={form.control}
                        defaultValue={null}
                        name="user_id"
                        render={
                            ({ onChange, value, name, ref }) => {
                                return (
                                    <AsyncSelect
                                        isClearable={true}
                                        className='react-select'
                                        classNamePrefix='select'
                                        defaultOptions
                                        isDisabled={disabled}
                                        value={{value, label: renderItem(user)}}
                                        loadOptions={promiseOptions}
                                        cacheOptions
                                        onChange={
                                            (value, extra) => {
                                                onChange(value?.item.id)
                                                onUserChange(value, extra)
                                            }
                                        }
                                    />

                                )
                            }}
                        />

                </FormGroup>
            </Col>
            <Col sm='4'>

                <FormGroup>
                    <Label for='cashier_id'>Cashier</Label>
                    <Controller
                        control={form.control}
                        defaultValue={null}
                        name="cashier_id"
                        render={
                            ({ onChange, value, name, ref }) => {
                                return (
                                    <AsyncSelect
                                        isClearable={true}
                                        className='react-select'
                                        classNamePrefix='select'
                                        defaultOptions
                                        isDisabled={disabled}
                                        value={{value, label: renderItem(cashier)}}
                                        loadOptions={cashierOptions}
                                        cacheOptions
                                        onChange={
                                            (value, extra) => {
                                                onChange(value?.item.id)
                                                onCashierChange(value, extra)
                                            }
                                        }
                                    />

                                )
                            }}
                        />

                </FormGroup>
            </Col>
            <Col sm='4'>
                <FormGroup>
                    <Label for='customerName'>Name</Label>
                    <Input
                        disabled={disabled}
                        type='text'
                        id='customerName'
                        name="customer.name"
                        innerRef={form.register({required: true})}
                        invalid={form.errors.customer?.name && true}
                    />
                </FormGroup>
            </Col>
            <Col sm='4'>
                <FormGroup>
                    <Label for='customerPhone'>Phone</Label>
                    <Input
                        disabled={disabled}
                        type='text'
                        id='customerName'
                        name="customer.phone"
                        innerRef={form.register({required: true})}
                        invalid={form.errors.customer?.phone && true}
                    />
                </FormGroup>
            </Col>
            <Col sm='4'>
                <FormGroup>
                    <Label for='customerEmail'>Email</Label>
                    <Input
                        disabled={disabled}
                        type='text'
                        id='customerEmail'
                        name="customer.email"
                        innerRef={form.register({required: false})}
                        invalid={form.errors.customer?.email && true}
                    />
                </FormGroup>
            </Col>


            <Col sm='4'>

                <FormGroup>
                    <Label for='identity_number_type'>Identity Number Type</Label>
                    <Controller
                        control={form.control}
                        defaultValue={null}
                        name="identity_number_type"
                        render={({ onChange, value, name, ref }) => (
                            <Select
                                className='react-select'
                                classNamePrefix='select'
                                isDisabled={disabled}
                                value={identity_number_typeOptions.filter(list => list.value === (value || order?.identity_number_type))}
                                options={identity_number_typeOptions}
                                onChange={val => {
                                    onChange(val?.value || null)
                                    handleChangeType(val)
                                }}
                            />
                        )}
                    />

                </FormGroup>
            </Col>


            <Col sm='4'>
                <FormGroup>
                    <Label for='customer_identity_number'>Customer Identity Number</Label>
                    <Input
                        disabled={disabled}
                        type='text'
                        id='customer_identity_number'
                        name="customer_identity_number"
                        innerRef={form.register({required: false})}
                        invalid={form.errors.customer_identity_number && true}
                    />
                </FormGroup>
            </Col>
            <Col sm='12'>
                <FormGroup>
                    <Label for='notes'>Notes</Label>
                    <Input

                        id='notes'
                        type='textarea'
                        name="notes"
                        innerRef={form.register({required: false})}
                        invalid={form.errors.notes && true}
                    />
                </FormGroup>
            </Col>
            <Col sm='12'>
                <FormGroup>
                    <Label for='notes'>Invoice Notes</Label>
                    <Input
                        disabled={disabled}
                        id='invoiceNotes'
                        type='textarea'
                        name="invoice_notes"
                        innerRef={form.register({required: false})}
                        invalid={form.errors.notes && true}
                    />
                </FormGroup>
            </Col>
        </Row>
    )
}