import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import { useModel } from '@data/use-links'
import { useHistory, useParams } from 'react-router-dom'
import Form from './form'

const Add = () => {

    const history = useHistory()

    const { id } = useParams()

    const { data: model, update } = useModel(id)

    const [formErrors, setFormErrors] = useState(null)

    const onSubmit = async data => {
        try {
            await update(data)
            history.push('/links/list')
        } catch (e) {
            setFormErrors(e.response?.data?.errors)
        }
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Promotions' breadCrumbActive='Promotions'/>
            <Form model={model} onSubmit={onSubmit} formErrors={formErrors} />
        </Fragment>
    )
}

export default Add
