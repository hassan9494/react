import { Fragment, useState, useRef } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import {useHistory, useParams} from 'react-router-dom'
import CategoryForm from './form'
import { api } from '@data/use-variants-product'
import draftToHtml from 'draftjs-to-html'

export default function Add() {
    const { id } = useParams()
    const history = useHistory()

    const [formErrors, setFormErrors] = useState(null)

    const onSubmit = async data => {
        data['product_id'] = id
        try {
            await api.create(data)
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
