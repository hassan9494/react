import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import { useParams } from 'react-router-dom'
import { Button, Card, CardBody, Row, Col, Form, FormGroup, Input, Label } from 'reactstrap'
import FormErrors from '@components/form-errors'
import { useForm } from 'react-hook-form'
import CardHeader from 'reactstrap/lib/CardHeader'

export default () => {

    const { id } = useParams()

    // const { data: model, update: updateCategory } = useCategory(id)
    const { register, errors, handleSubmit, control, setValue } = useForm()
    const [formErrors, setFormErrors] = useState(null)

    const onSubmit = async data => {
        try {
            // await updateCategory(data)
            history.push('/category/list')
        } catch (e) {
            setFormErrors(e.response?.data?.errors)
        }
    }

    return (
        <Fragment>
        </Fragment>
    )
}