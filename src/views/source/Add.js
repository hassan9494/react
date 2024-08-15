import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import { useHistory } from 'react-router-dom'
import SourceForm from './form'
import { api } from '@data/use-source'

const Add = () => {

    const history = useHistory()

    const [formErrors, setFormErrors] = useState(null)

    const onSubmit = async data => {
        try {
            await api.create(data)
            history.push('/source/list')
        } catch (e) {
            setFormErrors(e.response?.data?.errors)
        }
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Sources' breadCrumbActive='Sources'/>
            <SourceForm onSubmit={onSubmit} formErrors={formErrors} />
        </Fragment>
    )
}

export default Add
