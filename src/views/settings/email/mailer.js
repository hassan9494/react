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
            <Breadcrumbs breadCrumbTitle='Settings' breadCrumbActive='Mailer'/>
            <Row>
                <Col lg='6'>
                    <Card>
                    <CardHeader className='p-1'>
                        Mailer
                        <Button.Ripple color='success' type='submit' onClick={handleSubmit(onSubmit)}>
                            Save
                        </Button.Ripple>
                    </CardHeader>
                    <hr className='m-0'/>
                        <CardBody>
                            <Form onSubmit={handleSubmit(onSubmit)}>

                                <FormGroup>
                                    <Label for='mailer'>Mailer</Label>
                                    <Input
                                        type='text'
                                        name='mailer'
                                        id='mailer'
                                        innerRef={register({required: true})}
                                        invalid={errors.mailer && true}
                                    />
                                </FormGroup>

                                <FormGroup >
                                    <Label for='host'>Host</Label>
                                    <Input
                                        id='host'
                                        type='text'
                                        name='host'
                                        innerRef={register({required: true})}
                                        invalid={errors.host && true}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label for='host'>Port</Label>
                                        <Input
                                            type='text'
                                            name='port'
                                            id='port'
                                            innerRef={register({required: true})}
                                            invalid={errors.port && true}
                                        />
                                </FormGroup>

                                <FormGroup>
                                    <Label for='username'>Username</Label>
                                    <Input
                                        type='text'
                                        name='username'
                                        id='username'
                                        innerRef={register({required: true})}
                                        invalid={errors.username && true}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label for='password'>Password</Label>
                                    <Input
                                        type='text'
                                        name='password'
                                        id='password'
                                        innerRef={register({required: true})}
                                        invalid={errors.password && true}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label for='password'>Encryption</Label>
                                    <Input
                                        type='text'
                                        name='encryption'
                                        id='encryption'
                                        innerRef={register({required: true})}
                                        invalid={errors.encryption && true}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label for='from'>From Email</Label>
                                    <Input
                                        type='text'
                                        name='from'
                                        id='from'
                                        innerRef={register({required: true})}
                                        invalid={errors.from && true}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label for='name'>From Name</Label>
                                    <Input
                                        type='text'
                                        name='name'
                                        id='name'
                                        innerRef={register({required: true})}
                                        invalid={errors.name && true}
                                    />
                                </FormGroup>


                                <FormGroup className='mb-0' row>
                                    <Col className='d-flex' md={{size: 9, offset: 3}}>
                                        <FormErrors errors={formErrors} />
                                    </Col>
                                    <Col className='d-flex' md={{size: 9, offset: 3}}>
                                   
                                    </Col>
                                </FormGroup>

                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}
