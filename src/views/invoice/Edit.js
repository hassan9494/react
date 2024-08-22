import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import { useCategory } from '@data/use-category'
import { useHistory, useParams } from 'react-router-dom'
import CategoryForm from './form'

const Add = () => {

    const history = useHistory()

    const { id } = useParams()

    const { data: model, update: updateCategory } = useCategory(id)

    const [formErrors, setFormErrors] = useState(null)

    const onSubmit = async data => {
        try {
            await updateCategory(data)
            history.push('/category/list')
        } catch (e) {
            setFormErrors(e.response?.data?.errors)
        }
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Categories' breadCrumbActive='Categories'/>
            <CategoryForm model={model} onSubmit={onSubmit} formErrors={formErrors} />
        </Fragment>
    )
}

export default Add
