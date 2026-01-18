import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import {useHistory, useParams} from 'react-router-dom'
import CategoryForm from './form'
import { api } from '@data/use-variants-product'

export default function Add() {
    const { id } = useParams()
    const history = useHistory()
    const [formErrors, setFormErrors] = useState(null)

    const onSubmit = async data => {
        console.log('Form data:', data) // Debug log

        const payload = {
            product_id: id,
            name: data.name,
            selected_product_id: data.selected_product_id // Get from form data directly
        }

        console.log('Payload:', payload) // Debug log

        try {
            await api.create(payload)
            history.push(`/product_variants/show/${id}`)
        } catch (e) {
            setFormErrors(e.response?.data?.errors)
        }
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Products' breadCrumbActive='New' />
            <CategoryForm onSubmit={onSubmit} formErrors={formErrors} from={'add'} />
        </Fragment>
    )
}