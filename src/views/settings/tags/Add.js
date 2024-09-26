import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import { useHistory } from 'react-router-dom'
import Form from './form'
import { api } from '@data/use-tag'

const Add = () => {

    const history = useHistory()

    const [formErrors, setFormErrors] = useState(null)

    const onSubmit = async data => {
        try {
            await api.create(data)
            history.push('/settings/tags')
        } catch (e) {
            setFormErrors(e.response?.data?.errors)
        }
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Tags' breadCrumbActive='Tags'/>
            <Form onSubmit={onSubmit} formErrors={formErrors} model={{order: 1}} />
        </Fragment>
    )
}

export default Add
