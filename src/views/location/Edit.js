import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import { useLocation } from '@data/use-location'
import { useHistory, useParams } from 'react-router-dom'
import LocationForm from './form'

const Add = () => {

    const history = useHistory()

    const { id } = useParams()

    const { data: model, update: updateLocation } = useLocation(id)

    const [formErrors, setFormErrors] = useState(null)

    const onSubmit = async data => {
        try {
            await updateLocation(data)
            history.push('/location/list')
        } catch (e) {
            setFormErrors(e.response?.data?.errors)
        }
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Locations' breadCrumbActive='Locations'/>
            <LocationForm model={model} onSubmit={onSubmit} formErrors={formErrors} />
        </Fragment>
    )
}

export default Add
