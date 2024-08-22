import { Card, CardBody, FormGroup, CardHeader, CustomInput, Input, Label } from 'reactstrap'
import Select from 'react-select'
import { Controller } from 'react-hook-form'
import { useModels as useCities } from '@data/use-city'
import { useModels as useShippingProviders } from '@data/use-shipping-provider'
import { useEffect, useState } from 'react'

export default function ({ form, isCompleted }) {

    const [oldState, setOldState] = useState({})

    const { data: cities } = useCities()
    const { data: providers } = useShippingProviders()

    const citiesList = cities.map(e => ({ label: e.name, value: e.id, cost: e.shipping_cost }))
    const providersList = providers.map(e => ({ label: e.name, value: e.id }))

    const hasShipping = form.watch('has_shipping')

    const handleChangeShipping = (state) => {
        if (!state) {
            setOldState({
                city: form.getValues('city_id'),
                shipping_provider: form.getValues('shipping_provider_id'),
                shipping: {
                    cost: form.getValues('shipping.cost'),
                    address: form.getValues('shipping.address'),
                    status: form.getValues('shipping.status')
                }
            })
            form.setValue('shipping.cost', null)
            form.setValue('shipping.address', null)
            form.setValue('shipping.status', null)
            form.setValue('city_id', null)
            form.setValue('shipping_provider_id', null)
        } else if (oldState) {
            form.setValue('shipping', oldState.shipping)
            form.setValue('city_id', oldState.city)
            form.setValue('shipping_provider_id', oldState.shipping_provider)
        }
    }

    const handleChangeShippingLocation = (city) => {
        form.setValue('shipping.cost', city?.cost || 0)
    }

    const list = [
        {
            label: 'Waiting for shipping',
            value: 'WAITING'
        },
        {
            label: 'On The Way',
            value: 'SHIPPED'
        },
        {
            label: 'Delivered',
            value: 'DELIVERED'
        }
    ]

    return (
        <Card>
            <CardHeader>
                Shipping
                <CustomInput
                    disabled={isCompleted}
                    id='order-has-shipping'
                    type='switch'
                    name='has_shipping'
                    innerRef={form.register()}
                    onChange={e => handleChangeShipping(e.target.checked)}
                />
            </CardHeader>
            {
                <CardBody>

                    <FormGroup>
                        <Controller
                            control={form.control}
                            defaultValue={null}
                            name="city_id"
                            render={({ onChange, value, name, ref }) => (
                                <Select
                                    className='react-select'
                                    classNamePrefix='select'
                                    value={citiesList.filter(option => option.value === value)}
                                    inputRef={ref}
                                    placeholder={'Select City...'}
                                    options={citiesList}
                                    onChange={val => {
                                        onChange(val?.value || null)
                                        handleChangeShippingLocation(val)
                                    }}
                                    isClearable={true}
                                    isDisabled={!hasShipping || isCompleted}
                                />
                            )}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Controller
                            control={form.control}
                            defaultValue={null}
                            name="shipping_provider_id"
                            render={({ onChange, value, name, ref }) => (
                                <Select
                                    className='react-select'
                                    classNamePrefix='select'
                                    placeholder={'Select Shipping Provider...'}
                                    value={providersList.filter(option => option.value === value)}
                                    inputRef={ref}
                                    options={providersList}
                                    onChange={val => onChange(val?.value || null)}
                                    isClearable={true}
                                    isDisabled={!hasShipping || isCompleted}
                                />
                            )}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Input
                            disabled={!hasShipping || isCompleted}
                            type='textarea'
                            name='shipping.address'
                            placeholder='Shipping Address'
                            innerRef={form.register({required: hasShipping})}
                            invalid={form.errors.shipping?.address && true}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Input
                            disabled={!hasShipping || isCompleted}
                            type='number'
                            name='shipping.cost'
                            placeholder='Cost'
                            step="0.1"
                            innerRef={form.register({required: hasShipping})}
                            invalid={form.errors.shipping?.cost && true}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Controller
                            control={form.control}
                            defaultValue={'WAITING'}
                            name="shipping.status"
                            render={({ onChange, value, name, ref }) => (
                                <Select
                                    isDisabled={!hasShipping || isCompleted}
                                    className='react-select'
                                    classNamePrefix='select'
                                    value={list.filter(option => option.value === value)}
                                    inputRef={ref}
                                    options={list}
                                    onChange={val => onChange(val?.value)}
                                />
                            )}
                        />
                    </FormGroup>
                    <FormGroup>
                        <div className='d-flex justify-content-between mt-1'>
                            <Label className='mb-0' for='order-free-shipping'>
                                Free Shipping
                            </Label>
                            <CustomInput
                                disabled={!hasShipping || isCompleted}
                                id='order-free-shipping'
                                type='switch'
                                name='shipping.free'
                                innerRef={form.register()}
                            />
                        </div>
                    </FormGroup>
                </CardBody>
            }
        </Card>
    )
}
