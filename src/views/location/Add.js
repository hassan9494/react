import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import { useHistory } from 'react-router-dom'
import LocationForm from './form'
import { api } from '@data/use-location'

const Add = () => {

    const history = useHistory()

    const [formErrors, setFormErrors] = useState(null)

    const onSubmit = async data => {
        try {
            await api.create(data)
            history.push('/location/list')
        } catch (e) {
            setFormErrors(e.response?.data?.errors)
        }
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Locations' breadCrumbActive='Locations'/>
            <LocationForm onSubmit={onSubmit} formErrors={formErrors} />
        </Fragment>
    )
}

export default Add
