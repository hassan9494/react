import { Fragment, useState, useRef } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import { useHistory } from 'react-router-dom'
import CategoryForm from './form'
import { api } from '@data/use-product'
import draftToHtml from 'draftjs-to-html'

export default function Add() {

    const history = useHistory()

    const [formErrors, setFormErrors] = useState(null)

    const onSubmit = async data => {
        try {
            await api.create(data)
            history.push('/product/list')
        } catch (e) {
            setFormErrors(e.response?.data?.errors)
        }
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Products' breadCrumbActive='New' />
            <CategoryForm onSubmit={onSubmit} formErrors={formErrors} />
        </Fragment>
    )

}
