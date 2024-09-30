import { Col, FormGroup, Input, Label, Row } from 'reactstrap'
import { useEffect, useState } from 'react'
import AsyncSelect from 'react-select/async/dist/react-select.esm'
import { api } from '@data/use-user'
import { Controller } from 'react-hook-form'
import { Field } from '@components/form/fields'

export default function ({ form, invoice, disabled }) {


    return (
        <Row>
            <Col sm='6'>
                <FormGroup>
                    <Label for='number'>Invoice Number</Label>
                    <Input
                        disabled={disabled}
                        id='number'
                        type='text'
                        name="number"
                        innerRef={form.register({required: false})}
                        invalid={form.errors.notes && true}
                    />
                </FormGroup>
            </Col>
            <Col sm='6'>
                <FormGroup>
                    {/*<Label for='date'>Invoice Date</Label>*/}
                    <Field
                        form={form}
                        label='Invoice Date'
                        type='date'
                        name='date'
                        rules={{required: false}}
                    />
                </FormGroup>
            </Col>
            <Col sm='12'>
                <FormGroup>
                    <Label for='note'>Invoice Notes</Label>
                    <Input
                        disabled={disabled}
                        id='note'
                        type='textarea'
                        name="note"
                        innerRef={form.register({required: false})}
                        invalid={form.errors.notes && true}
                    />
                </FormGroup>
            </Col>
        </Row>
    )
}