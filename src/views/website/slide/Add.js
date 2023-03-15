import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import { useHistory } from 'react-router-dom'
import Form from './form'
import { api } from '@data/use-slide'

const Add = () => {

    const history = useHistory()

    const [formErrors, setFormErrors] = useState(null)

    const onSubmit = async data => {
        try {
            await api.create(data)
            history.push('/slide/list')
        } catch (e) {
            setFormErrors(e.response?.data?.errors)
        }
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Slides' breadCrumbActive='Slides'/>
            <Form onSubmit={onSubmit} formErrors={formErrors} model={{order: 1}} />
        </Fragment>
    )
}

export default Add
