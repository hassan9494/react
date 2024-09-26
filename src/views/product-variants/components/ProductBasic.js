import {
    Col,
    FormGroup,
    Card,
    CardBody, Row, CardHeader
} from 'reactstrap'
import {Field, SelectMulti, Select} from '@components/form/fields'

export default function Basic({form}) {

    const {register, errors, control} = form

    return (
        <Card>
            <CardHeader>
                <h4>Basic Info</h4>
            </CardHeader>
            <CardBody>
                <Row>
                    <Col sm={6}>
                        <Field
                            label={'Name'}
                            name={'name'}
                            rules={{required: true}}
                            form={form}
                        />
                    </Col>
                    <Col sm={6}>
                        <FormGroup>
                            <Field
                                form={form}
                                label={'Stock'}
                                type='number'
                                name='stock'
                                rules={{required: true}}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <FormGroup>
                            <Field
                                form={form}
                                label={'Min Quantity'}
                                type='number'
                                name='min_qty'
                                rules={{required: true}}
                            />
                        </FormGroup>
                    </Col>
                    <Col sm={6}>
                        <FormGroup>
                            <Field
                                form={form}
                                label={'Maximum sellable amount to single customer'}
                                type='number'
                                name='maxCartAmount'
                                rules={{required: false}}
                            />
                        </FormGroup>
                    </Col>
                </Row>

                <Field
                    label={'Short Description'}
                    name={'short_description'}
                    form={form}
                    type={'textarea'}
                />

            </CardBody>
        </Card>
    )
}

