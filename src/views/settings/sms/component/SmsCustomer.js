import {Col, CustomInput, FormGroup, Input, Label, Row} from 'reactstrap'
import React, { useEffect, useState } from 'react'
import AsyncSelect from 'react-select/async/dist/react-select.esm'
import { api } from '@data/use-user'
import { Controller } from 'react-hook-form'

export default function ({ form, disabled }) {

    const [user, setUser] = useState()


    const onUserChange = (value, { action, removedValue }) => {
        setUser(value?.item)
        if (value?.item) {
            form.setValue('customer.name', value.item.name)
            form.setValue('customer.email', value.item.email)
            form.setValue('customer.phone', value.item.phone)
        }
    }

    const renderItem = (item) => (
        <div className="d-flex justify-content-left align-items-center">
            <div className="d-flex flex-column">
                <h6 className="user-name text-truncate mb-0">{ item?.phone }</h6>
                <small className="text-truncate text-muted mb-0">{ item?.name }</small>
            </div>
        </div>
    )

    const promiseOptions = async inputValue => {
        const data = await api.autocomplete(inputValue)
        return data.map(({ id, name, email, phone }) => {
            return {
                label: renderItem({ id, name, email, phone }),
                value: id,
                item: { id, name, email, phone }
            }
        })
    }

    return (
        <Row>
            <Col sm='5'>
                <FormGroup>
                    <Label for='user_id'>User</Label>
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
            <Col sm='5'>
                <FormGroup>
                    <Label for='title'>Title</Label>
                    <Input
                        disabled={disabled}
                        type='text'
                        id='title'
                        placeholder={'Add Sms Title'}
                        name="title"
                        innerRef={form.register({required: true})}
                        invalid={form.errors.subject && true}
                    />
                </FormGroup>
            </Col>
            <Col sm='2'>
                <FormGroup>
                    <Label for='subject'>To All Users</Label>
                    <CustomInput
                        id='to_all'
                        type='switch'
                        disabled={disabled}
                        name='to_all'
                        innerRef={form.register()}
                    />

                </FormGroup>
            </Col>
            <Col sm='12'>
                <FormGroup>
                    <Label for='message'>Message</Label>
                    <Input
                        disabled={disabled}
                        id='message'
                        type='textarea'
                        name="message"
                        placeholder={'Add Sms Content'}
                        innerRef={form.register({required: false})}
                        invalid={form.errors.message && true}
                    />
                </FormGroup>
            </Col>
        </Row>
    )
}