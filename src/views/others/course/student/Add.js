import { Fragment, useState } from 'react'
import { useModel } from '@data/use-course'
import { api } from '@data/use-course-student'
import Breadcrumbs from '@components/breadcrumbs'
import { useHistory, useParams } from 'react-router-dom'
import Form from './form'

const Add = () => {

    const history = useHistory()

    const { id } = useParams()

    const { data: model } = useModel(id)

    const [formErrors, setFormErrors] = useState(null)

    const onSubmit = async data => {
        try {
            api.create({
                course_id: id,
                ...data
            })
            history.push(`/course/edit/${id}`)
        } catch (e) {
            setFormErrors(e.response?.data?.errors)
        }
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Courses' breadCrumbParent={model?.name} breadCrumbActive={'New Student'} />
            <Form onSubmit={onSubmit} formErrors={formErrors} />
        </Fragment>
    )

}

export default Add
