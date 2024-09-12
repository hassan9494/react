import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import { useParams } from 'react-router-dom'
import { Button, Card, CardBody, Row, Col, Form, FormGroup, Input, Label } from 'reactstrap'
import FormErrors from '@components/form-errors'
import {Controller, useForm} from 'react-hook-form'
import CardHeader from 'reactstrap/lib/CardHeader'
import SmsMain from "./component/SmsMain"
import OrderStatus from "../../order/components/OrderStatus"
import ShippingStatus from "../../order/components/ShippingStatus"
import OrderOptions from "../../order/components/OrderOptions"

export default () => {
    const form = useForm()

    // const { data: model, update: updateCategory } = useCategory(id)
    const { register, errors, handleSubmit, control, setValue } = useForm()
    const [formErrors, setFormErrors] = useState(null)

    const onSubmit = async data => {
        console.log(data)
        try {
            // await updateCategory(data)
            history.push('/category/list')
        } catch (e) {
            setFormErrors(e.response?.data?.errors)
        }
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Settings' breadCrumbActive='Send Sms'/>
            <Form onSubmit={form.handleSubmit(onSubmit)}>
                <Row>
                    <Col md={12} sm={12}>
                        <SmsMain  form={form} isCompleted={false} isReorder={true}/>

                    </Col>
                </Row>
            </Form>
        </Fragment>
    )
}
