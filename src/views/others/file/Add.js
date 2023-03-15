import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import { useHistory } from 'react-router-dom'
import Form from './form'
import { api } from '@data/use-file'

const Add = () => {

    const history = useHistory()

    const [formErrors, setFormErrors] = useState(null)

    const onSubmit = async data => {
        try {
            const formData = new FormData()
            formData.append('name', data.name)
            formData.append('file', data.file[0])
            await api.create(formData)
            history.push('/file/list')
        } catch (e) {
            setFormErrors(e.response?.data?.errors)
        }
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Files' breadCrumbActive='Files'/>
            <Form onSubmit={onSubmit} formErrors={formErrors} model={{order: 1}} />
        </Fragment>
    )
}

export default Add
