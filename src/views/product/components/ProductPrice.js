import {
    Row,
    Card,
    CardBody,
    Col
} from 'reactstrap'
import { Field } from '@components/form/fields'
import ability from "../../../configs/acl/ability"

export default function Prices({ form }) {
    const canShowRealPrice = ability.can('read', 'show_product_real_price')
    return (
        <Card>
            <CardBody>
                <Row>
                    <Col sm={3}>
                        <Field
                            form={form}
                            label='Normal Price'
                            type='number'
                            step='0.001'
                            name='price.normal_price'
                            rules={{required: true}}
                        />
                    </Col>
                    <Col sm={3}>
                        <Field
                            form={form}
                            label='Sale Price'
                            type='number'
                            step='0.001'
                            name='price.sale_price'
                        />
                    </Col>
                    <Col sm={3}>
                        <Field
                            form={form}
                            label='Distributor Price'
                            type='number'
                            step='0.001'
                            name='price.distributor_price'
                            rules={{required: true}}
                        />
                    </Col>
                    {
                        canShowRealPrice ? <Col sm={3}>
                                <Field
                                    form={form}
                                    label='Real Price'
                                    type='number'
                                    step='0.001'
                                    name='price.real_price'
                                    rules={{required: true}}
                                />
                            </Col> : <Col sm={3}>
                                <Field
                                    form={form}
                                    label=''
                                    type='hidden'
                                    step='0.001'
                                    name='price.real_price'
                                    rules={{required: true}}

                                />
                            </Col>

                    }

                </Row>
            </CardBody>
        </Card>
    )
}
