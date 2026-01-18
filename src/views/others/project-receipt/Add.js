import { Fragment, useEffect, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import { useHistory, useLocation } from 'react-router-dom'
import Form from './form'
import { api } from '@data/use-project-receipt'
import { useModel as useStudent } from '@data/use-course-student'
import { useModel as useProject } from '@data/use-project'

const Add = () => {

    const history = useHistory()
    const [model, setModel] = useState()

    const { search }  = useLocation()
    const params = new URLSearchParams(search)
    const studentId = params.get('student')
    const projectId = params.get('project')

    const { data: student } = studentId ? useStudent(studentId) : {}
    const { data: project } = projectId ? useProject(projectId) : {}

    useEffect(() => {
        if (student) {
            setModel({
                name: student.name,
                explanation: student?.course?.name
            })
        }
        if (project) {
            setModel({
                name: project.name,
                explanation: project.name
            })
        }
    }, [student, project])


    const [formErrors, setFormErrors] = useState(null)

    const onSubmit = async data => {
        try {
            await api.create({
                course_student_id: studentId,
                graduation_project_id: projectId,
                ...data
            })
            history.goBack()
        } catch (e) {
            setFormErrors(e.response?.data?.errors)
        }
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Receipt' breadCrumbActive='Receipts'/>
            <Form
                model={model}
                onSubmit={onSubmit}
                formErrors={formErrors}
            />
        </Fragment>
    )
}

export default Add
