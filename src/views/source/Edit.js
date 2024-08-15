import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import { useSource } from '@data/use-source'
import { useHistory, useParams } from 'react-router-dom'
import SourceForm from './form'

const Add = () => {

    const history = useHistory()

    const { id } = useParams()

    const { data: model, update: updateSource } = useSource(id)

    const [formErrors, setFormErrors] = useState(null)

    const onSubmit = async data => {
        try {
            await updateSource(data)
            history.push('/source/list')
        } catch (e) {
            setFormErrors(e.response?.data?.errors)
        }
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Sources' breadCrumbActive='Sources'/>
            <SourceForm model={model} onSubmit={onSubmit} formErrors={formErrors} />
        </Fragment>
    )
}

export default Add
