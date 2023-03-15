import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import { useProduct } from '@data/use-product'
import { useHistory, useParams } from 'react-router-dom'
import CategoryForm from './form'
import { Button } from 'reactstrap'
import { toast } from 'react-toastify'

const Add = () => {

    const history = useHistory()

    const { id } = useParams()

    const { data: model, update } = useProduct(id)

    const [formErrors, setFormErrors] = useState(null)

    const onSubmit = async data => {
        try {
            await update(data)
            toast.success('Updated')
            // history.push('/category/list')
        } catch (e) {
            setFormErrors(e.response?.data?.errors)
        }
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Products' breadCrumbActive={model?.sku || 'Update'} />
            <CategoryForm model={model} onSubmit={onSubmit} formErrors={formErrors} />
        </Fragment>
    )
}

export default Add
