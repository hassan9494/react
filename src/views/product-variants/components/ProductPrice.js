import {
    Row,
    Card,
    CardBody,
    Col
} from 'reactstrap'
import { Field } from '@components/form/fields'

export default function Prices({ form }) {

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
                    <Col sm={3}>
                        <Field
                            form={form}
                            label='Real Price'
                            type='number'
                            step='0.001'
                            name='price.real_price'
                            rules={{required: true}}
                        />
                    </Col>
                </Row>
            </CardBody>
        </Card>
    )
}
