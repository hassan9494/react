import { useEffect } from 'react'
import FormErrors from '@components/form-errors'
import {
    Col,
    Label,
    Input,
    Button,
    Form,
    FormGroup,
    Card,
    CardBody
} from 'reactstrap'
import { useForm, Controller } from 'react-hook-form'

export default function ({ onSubmit, model, formErrors }) {

    const { register, errors, handleSubmit, control, setValue } = useForm()

    useEffect(() => {
        if (model) {
            const fields = ['order', 'title', 'slug', 'icon', 'parent']
            fields.forEach(field => setValue(field, model[field]))
        }
    }, [model])

    return (
        <Card>
            <CardBody>
                <Form onSubmit={handleSubmit(onSubmit)}>

                    <FormGroup row>
                        <Label sm='3' for='name'>Name</Label>
                        <Col sm='9'>
                            <Input
                                type='number'
                                name='name'
                                id='name'
                                placeholder='Name'
                                innerRef={register({required: true})}
                                invalid={errors.name && true}
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label sm='3' for='type'>Type</Label>
                        <Col sm='9'>
                            <Input
                                type='text'
                                name='type'
                                id='type'
                                placeholder='Type'
                                innerRef={register({required: true})}
                                invalid={errors.type && true}
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label sm='3' for='cost'>Cost</Label>
                        <Col sm='9'>
                            <Input
                                type='number'
                                name='cost'
                                id='cost'
                                placeholder='Cost'
                                innerRef={register({required: true})}
                                invalid={errors.cost && true}
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup className='mb-0' row>
                        <Col className='d-flex' md={{size: 9, offset: 3}}>
                            <FormErrors errors={formErrors} />
                        </Col>
                        <Col className='d-flex' md={{size: 9, offset: 3}}>
                            <Button.Ripple className='mr-1' color='primary' type='submit'>
                                Submit
                            </Button.Ripple>
                        </Col>
                    </FormGroup>
                </Form>
            </CardBody>
        </Card>
    )
}
