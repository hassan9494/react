import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import { useHistory } from 'react-router-dom'
import Form from './form'
import { api } from '@data/use-tax-exempt'
import {useForm} from "react-hook-form"

const Add = () => {

    const history = useHistory()
    const form = useForm()

    const [formErrors, setFormErrors] = useState(null)

    const onSubmit = async data => {
        console.log(data)
        try {
            await api.create(data)
            history.push('/tax_exempt/list')
        } catch (e) {
            setFormErrors(e.response?.data?.errors)
        }
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='TaxExempt' breadCrumbActive='TaxExempt'/>
            <Form onSubmit={onSubmit} form={form} formErrors={formErrors} />
        </Fragment>
    )
}

export default Add
