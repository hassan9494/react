import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import { useBrand } from '@data/use-brand'
import { useHistory, useParams } from 'react-router-dom'
import BrandForm from './form'

const Add = () => {

    const history = useHistory()

    const { id } = useParams()

    const { data: model, update: updateBrand } = useBrand(id)

    const [formErrors, setFormErrors] = useState(null)

    const onSubmit = async data => {
        try {
            await updateBrand(data)
            history.push('/brand/list')
        } catch (e) {
            setFormErrors(e.response?.data?.errors)
        }
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Brands' breadCrumbActive='Brands'/>
            <BrandForm model={model} onSubmit={onSubmit} formErrors={formErrors} />
        </Fragment>
    )
}

export default Add
