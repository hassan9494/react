import { Col, FormGroup, Input, Label, Row } from 'reactstrap'
import { useEffect, useState } from 'react'
import AsyncSelect from 'react-select/async/dist/react-select.esm'
import { api } from '@data/use-user'
import { Controller } from 'react-hook-form'
import { Field, Select } from '@components/form/fields'
import {useSources} from "@data/use-source"

export default function ({ form, invoice, disabled }) {
    const {data: sources} = useSources()

    const sourcesSelect = [
        { value: 0, label: 'No Choice' },
        ...sources.map(e => ({
            value: e.id,
            label: e.name
        }))
    ]

    const sourcesTypeSelect = [
        { value: 'air', label: 'Air' },
        { value: 'sea', label: 'Sea' },
        { value: 'local', label: 'Local' }
    ]

    return (
        <Row>
            <Col sm='3'>
                <FormGroup>
                    <Label for='name'>Invoice Name</Label>
                    <Input
                        disabled={disabled}
                        id='name'
                        type='text'
                        name="name"
                        innerRef={form.register({required: false})}
                        invalid={form.errors.name && true}
                    />
                </FormGroup>
            </Col>
            <Col sm='3'>
                <FormGroup>
                    <Label for='number'>Invoice Number</Label>
                    <Input
                        disabled={disabled}
                        id='number'
                        type='text'
                        name="number"
                        innerRef={form.register({required: false})}
                        invalid={form.errors.number && true}
                    />
                </FormGroup>
            </Col>
            <Col sm='3'>
                <FormGroup>
                    <Label for='tax_number'>Tax Number</Label>
                    <Input
                        disabled={disabled}
                        id='tax_number'
                        type='number'
                        name="tax_number"
                        innerRef={form.register({required: false})}
                        invalid={form.errors.tax_number && true}
                    />
                </FormGroup>
            </Col>
            <Col sm='3'>
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
            <Col sm='3'>
                <FormGroup>
                    <Label for='exchange_factor'>Exchange Factor</Label>
                    <Input
                        disabled={disabled}
                        id='exchange_factor'
                        type='number'
                        step={0.001}
                        name="exchange_factor"
                        innerRef={form.register({required: false})}
                        invalid={form.errors.exchange_factor && true}
                    />
                </FormGroup>
            </Col>
            <Col sm='3'>
                <FormGroup>
                    {/* <Label for='note'>Source</Label> */}
                    <Select
                        label={'Source'}
                        name={'source_id'}
                        isClearable={true}
                        list={sourcesSelect}
                        form={form}
                    />
                </FormGroup>
            </Col>
            <Col sm='3'>
                <FormGroup>
                    {/* <Label for='note'>Source</Label> */}
                    <Select
                        label={'Source Type'}
                        name={'source_type'}
                        isClearable={true}
                        list={sourcesTypeSelect}
                        form={form}
                    />
                </FormGroup>
            </Col>
            <Col sm='6'>
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