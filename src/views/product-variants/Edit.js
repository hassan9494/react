import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import { useProductVariant } from '@data/use-variants-product'
import { useHistory, useParams } from 'react-router-dom'
import CategoryForm from './form'
import { Button } from 'reactstrap'
import { toast } from 'react-toastify'

const Edit = () => {
    const history = useHistory()
    const { id } = useParams()
    const { data: model, update } = useProductVariant(id)
    const [formErrors, setFormErrors] = useState(null)

    const onSubmit = async data => {
        const payload = {
            name: data.name,
            selected_product_id: data.selected_product_id
        }

        try {
            await update(payload)
            toast.success('Updated')
        } catch (e) {
            setFormErrors(e.response?.data?.errors)
        }
    }

    if (!model) {
        return <div>Loading...</div>
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Products' breadCrumbActive={model?.name || 'Update'} />
            <CategoryForm model={model} onSubmit={onSubmit} formErrors={formErrors} from={'edit'}/>
        </Fragment>
    )
}

export default Edit