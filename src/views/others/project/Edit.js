import { Fragment, useState } from 'react'
import { useModel } from '@data/use-project'
import Breadcrumbs from '@components/breadcrumbs'
import { useHistory, useParams } from 'react-router-dom'
import Form from './form'
import Payments from './payment/List'

const Add = () => {

    const history = useHistory()

    const { id } = useParams()

    const { data: model, update, usePayments } = useModel(id)

    const [formErrors, setFormErrors] = useState(null)

    const onSubmit = async data => {
        try {
            await update(data)
            history.push('/project/list')
        } catch (e) {
            setFormErrors(e.response?.data?.errors)
        }
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Projects' breadCrumbActive={model?.name} />
            <Form model={model} onSubmit={onSubmit} formErrors={formErrors} />
            <Payments usePayments={usePayments} />
        </Fragment>
    )
}

export default Add
