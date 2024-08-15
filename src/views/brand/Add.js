import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import { useHistory } from 'react-router-dom'
import BrandForm from './form'
import { api } from '@data/use-brand'

const Add = () => {

    const history = useHistory()

    const [formErrors, setFormErrors] = useState(null)

    const onSubmit = async data => {
        try {
            await api.create(data)
            history.push('/brand/list')
        } catch (e) {
            setFormErrors(e.response?.data?.errors)
        }
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Brands' breadCrumbActive='Brands'/>
            <BrandForm onSubmit={onSubmit} formErrors={formErrors} />
        </Fragment>
    )
}

export default Add
