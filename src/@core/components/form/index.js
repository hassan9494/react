import { Button, Form, FormGroup } from 'reactstrap'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { Field, Checkbox, ReactSelect, ReactSelectMulti, Editor, Uploader, FileField, CkeEditor, CustomUploader } from './fields'

import moment from 'moment'
import Uppy from "./fields/Uppy"

export default function FormBuilder({
    fields,
    onSubmit,
    initialValues
}) {

    const form = useForm()

    useEffect(() => {
        if (!initialValues) return
        for (const field of fields) {

            if (!initialValues.hasOwnProperty(field.name)) continue

            if (field.type === 'date') {
                form.setValue(field.name, moment(initialValues[field.name]).format('Y-MM-DD'))
                continue
            }

            form.setValue(field.name, initialValues[field.name])
        }

    }, [initialValues, fields])

    return (
        <Form onSubmit={form.handleSubmit(onSubmit)}>

            { fields.map((field, i) => {
                if (field.type === 'react-select') {
                    return <ReactSelect key={i} {...field} form={form} />
                }
                if (field.type === 'react-select-multi') {
                    return <ReactSelectMulti key={i} {...field} form={form} />
                }
                if (field.type === 'checkbox') {
                    return <Checkbox key={i} {...field} form={form} />
                }
                if (field.type === 'editor') {
                    return <Editor key={i} {...field} form={form} />
                }
                if (field.type === 'uploader') {
                    return <Uploader key={i} {...field} form={form} />
                }
                if (field.type === 'customUploader') {
                    return <CustomUploader key={i} {...field} form={form} />
                }
                if (field.type === 'uppy') {
                    return <Uppy key={i} {...field} form={form} />
                }
                if (field.type === 'file') {
                    return <FileField key={i} {...field} form={form} />
                }
                if (field.type === 'cke') {
                    return <CkeEditor key={i} {...field} form={form} />
                }
                return <Field key={i} {...field} form={form} />
            }) }

            <FormGroup className='mb-0 d-flex'>
                <Button.Ripple className='mr-1' color='secondary' type='submit'>
                    Save
                </Button.Ripple>
            </FormGroup>

        </Form>
    )
}

