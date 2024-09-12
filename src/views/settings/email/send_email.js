import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import { useParams } from 'react-router-dom'
import { Button, Card, CardBody, Row, Col, Form, FormGroup, Input, Label } from 'reactstrap'
import FormErrors from '@components/form-errors'
import {Controller, useForm} from 'react-hook-form'
import CardHeader from 'reactstrap/lib/CardHeader'
import EmailMain from "./component/EmailMain"
import { api } from '@data/use-email'

export default () => {
    const form = useForm()


    const { register, errors, handleSubmit, control, setValue } = useForm()
    const [formErrors, setFormErrors] = useState(null)

    const onSubmit = async data => {
        console.log(data)
        try {
            await api.create(data)
            history.push('/category/list')
        } catch (e) {
            setFormErrors(e.response?.data?.errors)
        }
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Settings' breadCrumbActive='Send Email'/>
            <Form onSubmit={form.handleSubmit(onSubmit)}>
                <Row>
                    <Col md={12} sm={12}>
                        <EmailMain  form={form} isCompleted={false} isReorder={true}/>

                    </Col>
                </Row>
            </Form>
        </Fragment>
    )
}
