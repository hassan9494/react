import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import { useHistory } from 'react-router-dom'
import CategoryForm from './form'
import { api } from '@data/use-category'

const Add = () => {

    const history = useHistory()

    const [formErrors, setFormErrors] = useState(null)

    const onSubmit = async data => {
        try {
            await api.create(data)
            history.push('/sub-category/list')
        } catch (e) {
            setFormErrors(e.response?.data?.errors)
        }
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Sub Categories' breadCrumbActive='Sub Categories'/>
            <CategoryForm onSubmit={onSubmit} formErrors={formErrors} />
        </Fragment>
    )
}

export default Add
