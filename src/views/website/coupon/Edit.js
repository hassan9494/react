import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import { useModel } from '@data/use-coupon'
import { useHistory, useParams } from 'react-router-dom'
import Form from './form'

const Edit = () => {
    const history = useHistory()
    const { id } = useParams()
    const { data: model, update, isLoading } = useModel(id)
    const [formErrors, setFormErrors] = useState(null)

    const onSubmit = async data => {
        try {
            await update(data)
            history.push('/coupon/list')
        } catch (e) {
            setFormErrors(e.response?.data?.errors)
        }
    }

    if (isLoading) {
        return (
            <Fragment>
                <Breadcrumbs breadCrumbTitle='Coupons' breadCrumbActive='Edit Coupon'/>
                <div>Loading...</div>
            </Fragment>
        )
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Coupons' breadCrumbActive='Edit Coupon'/>
            <Form model={model} onSubmit={onSubmit} formErrors={formErrors} />
        </Fragment>
    )
}

export default Edit