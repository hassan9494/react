import { Fragment, useState } from 'react'
import { useModel } from '@data/use-course'
import Breadcrumbs from '@components/breadcrumbs'
import { useHistory, useParams } from 'react-router-dom'
import Form from './form'
import Students from './student/List'
import Payments from './payment/List'

const Add = () => {

    const history = useHistory()

    const { id } = useParams()

    const { data: model, update, usePayments, useStudents } = useModel(id)

    const [formErrors, setFormErrors] = useState(null)

    const onSubmit = async data => {
        try {
            await update(data)
            history.push('/course/list')
        } catch (e) {
            setFormErrors(e.response?.data?.errors)
        }
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Courses' breadCrumbActive={model?.name} />
            <Form model={model} onSubmit={onSubmit} formErrors={formErrors} />
            <Students useStudents={useStudents} />
            <Payments usePayments={usePayments} />
        </Fragment>
    )
}

export default Add
