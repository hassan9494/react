import {
    Row,
    Card,
    CardBody,
    Col
} from 'reactstrap'
import { Field } from '@components/form/fields'

export default function ProductSale({ form }) {

    return (
        <Card>
            <CardBody row>
                <Row>
                    <Col sm={4}>
                        <Field
                            form={form}
                            label='Sale Price'
                            type='number'
                            step='0.001'
                            name='price.sale_price'
                            rules={{required: true}}
                        />
                    </Col>
                    <Col sm={4}>
                        <Field
                            form={form}
                            label='Start Date'
                            type='date'
                            name='price.sale_start_date'
                            rules={{required: true}}
                        />
                    </Col>
                    <Col sm={4}>
                        <Field
                            form={form}
                            label='End Date'
                            type='date'
                            name='price.sale_end_date'
                            rules={{required: true}}
                        />
                    </Col>
                </Row>
            </CardBody>
        </Card>
    )
}
