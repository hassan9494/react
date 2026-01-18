import { Fragment, useState } from 'react'
import { useModel } from '@data/use-payment-method'
import Breadcrumbs from '@components/breadcrumbs'
import { useHistory, useParams } from 'react-router-dom'
import Form from './form'

const Edit = () => {
    const history = useHistory()
    const { id } = useParams()
    const { data: model, update } = useModel(id)
    const [formErrors, setFormErrors] = useState(null)

    const onSubmit = async data => {
        try {
            await update(data)
            history.push('/payment_method/list')
        } catch (e) {
            setFormErrors(e.response?.data?.errors)
        }
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Payment Method' breadCrumbActive='Edit' />
            {model && <Form model={model} onSubmit={onSubmit} formErrors={formErrors} />}
        </Fragment>
    )
}

export default Edit