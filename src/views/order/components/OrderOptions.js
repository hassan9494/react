import {Col, CustomInput, FormGroup, Label} from 'reactstrap'
import {useEffect, useState} from 'react'
import {Controller} from "react-hook-form"
import AsyncSelect from "react-select/async/dist/react-select.esm"
import { api } from '@data/use-user'

export default function ({ form, order, isCompleted, isMigrated}) {
    const [taxExempt, setTaxExempt] = useState()
    const taxed = form.watch('options.taxed')
    const tax_exempt = form.watch('options.tax_exempt')

    const renderItem = (item) => (
        <div className="d-flex justify-content-left align-items-center">
            <div className="d-flex flex-column">
                <h6 className="user-name text-truncate mb-0">{ item?.name }</h6>
                <small className="text-truncate text-muted mb-0">{ item?.email }</small>
            </div>
        </div>
    )

    const promisesOptions = async inputValue => {
        const data = await api.autocompleteTaxExempt(inputValue)
        return data.map(({ id, name, email, phone, identity_number_type, tax_exempt, tax_zero, identity_number }) => {
            return {
                label: renderItem({ id, name, email, phone, identity_number_type, tax_exempt, tax_zero, identity_number }),
                value: id,
                item: { id, name, email, phone, identity_number_type, tax_exempt, tax_zero, identity_number }
            }
        })
    }

    useEffect(() => {
        if (!taxed) {
            form.setValue('options.tax_exempt', false)
            form.setValue('options.tax_zero', false)
        } else {
            form.setValue('options.price_offer', false)
        }
        if (!tax_exempt) {
            form.setValue('options.tax_zero', false)
        }
    }, [taxed, tax_exempt])
    useEffect(() => {
        if (!taxExempt) setTaxExempt(order?.taxExempt)
    }, [order])

    const onTaxExemptChange = (value, { action, removedValue }) => {
        console.log(value?.item)
        setTaxExempt(value?.item)
        if (value?.item) {
            form.setValue('customer.name', value.item.name)
            form.setValue('customer.email', value.item.email)
            form.setValue('identity_number_type', value.item.identity_number_type)
            form.setValue('customer_identity_number', value.item.identity_number)
            form.setValue('options.tax_exempt', value.item?.tax_exempt)
            form.setValue('options.tax_zero', value.item?.tax_zero)
        }
    }

    return (
        <div className='mt-1'>
            <div className='d-flex justify-content-between'>
                <CustomInput
                    id='order-taxed'
                    type='switch'
                    disabled={!!order?.tax_number || isCompleted || isMigrated}
                    name='options.taxed'
                    innerRef={form.register()}
                />
                <Label className='mb-0 font-medium-1' for='order-taxed'>
                    <strong>فاتورة ضريبية</strong>
                </Label>
            </div>
            <div className='d-flex justify-content-between mt-1'>
                <CustomInput
                    disabled={!taxed || isCompleted || isMigrated}
                    id='order-tax-exempt'
                    type='switch'
                    name='options.tax_exempt'
                    innerRef={form.register()}
                />
                <Label className='mb-0 font-medium-1' for='order-tax-exempt'>
                    <strong>معفي من الضريبة</strong>
                </Label>
            </div>
            <div className='d-flex justify-content-between mt-1'>

                <CustomInput
                    disabled={!taxed || isCompleted || !tax_exempt || isMigrated}
                    id='order-tax-zero'
                    type='switch'
                    name='options.tax_zero'
                    innerRef={form.register()}
                />
                <Label className='mb-0 font-medium-1' for='order-tax-zero'>
                    <strong>معفي بنسبة الصفر</strong>
                </Label>

            </div>
            <div className='d-flex justify-content-between mt-1'>
                <CustomInput
                    disabled={isCompleted || isMigrated}
                    id='order-dept'
                    type='switch'
                    name='options.dept'
                    innerRef={form.register()}
                />
                <Label className='mb-0 font-medium-1' for='order-dept'>
                    <strong>فاتورة ذمم</strong>
                </Label>
            </div>
            <div className='d-flex justify-content-between mt-1'>
                <CustomInput
                    disabled={taxed || isCompleted || isMigrated}
                    id='order-price-offer'
                    type='switch'
                    name='options.price_offer'
                    innerRef={form.register()}
                />
                <Label className='mb-0 font-medium-1' for='order-price-offer'>
                    <strong>عرض سعر</strong>
                </Label>
            </div>
            <div className='d-flex justify-content-between mt-1'>
                <CustomInput
                    id='pending'
                    type='switch'
                    name='pending'
                    innerRef={form.register()}
                />
                <Label className='mb-0 font-medium-1' for='pending'>
                    <strong>Pending</strong>
                </Label>
            </div>
            {
                (taxed || !order) &&
                <div className='d-flex justify-content-between mt-1'>
                    <FormGroup style={{width:'100%'}}>
                        <Controller
                            control={form.control}

                            defaultValue={null}
                            name="tax_exempt_id"
                            render={
                                ({ onChange, value, name, ref }) => {
                                    return (
                                        <AsyncSelect
                                            isClearable={true}
                                            className='react-select'
                                            classNamePrefix='select'
                                            isDisabled={isCompleted || isMigrated}
                                            defaultOptions
                                            value={{value, label: renderItem(taxExempt)}}
                                            loadOptions={promisesOptions}
                                            onChange={
                                                (value, extra) => {
                                                    onChange(value?.item.id)
                                                    onTaxExemptChange(value, extra)
                                                }
                                            }
                                        />

                                    )
                                }}
                        />

                    </FormGroup>
                </div>

            }
        </div>
    )

}