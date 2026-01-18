import {
    Row,
    Card,
    CardBody,
    Col, Button
} from 'reactstrap'
import { Field } from '@components/form/fields'
import ability from "../../../configs/acl/ability"
import {RefreshCw} from "react-feather"

export default function Prices({ form }) {
    const canShowRealPrice = ability.can('read', 'show_product_real_price')
    const handleCalc = async () => {
        const price = form.watch('price')
        const exchange_factor = form.watch('exchange_factor')
        const base_purchases_price = form.watch('base_purchases_price')
        price.real_price = base_purchases_price * exchange_factor
        form.setValue('price', price)
        console.log(form.watch('price'))
    }
    return (
        <Card>
            <CardBody>
                <Row>
                    <Col sm={2}>
                        <Field
                            form={form}
                            label='Normal Price'
                            type='number'
                            step='0.001'
                            defaultValue='0'
                            name='price.normal_price'
                            rules={{required: true}}
                        />
                    </Col>
                    <Col sm={2}>
                        <Field
                            form={form}
                            label='Sale Price'
                            type='number'
                            step='0.001'
                            defaultValue='0'
                            name='price.sale_price'
                        />
                    </Col>
                    <Col sm={2}>
                        <Field
                            form={form}
                            label='Distributor Price'
                            type='number'
                            step='0.001'
                            defaultValue='0'
                            name='price.distributor_price'
                            rules={{required: true}}
                        />
                    </Col>
                    {
                        canShowRealPrice ? <Col sm={2}>
                                <Field
                                    form={form}
                                    label='Real Price'
                                    type='number'
                                    step='0.001'
                                    defaultValue='0'
                                    name='price.real_price'
                                    rules={{required: false}}
                                />
                            </Col> : <Col sm={2}>
                                <Field
                                    form={form}
                                    label=''
                                    type='hidden'
                                    step='0.001'
                                    name='price.real_price'
                                    rules={{required: false}}

                                />
                            </Col>

                    }
                    {
                        canShowRealPrice ? <Col sm={2}>
                                <Field
                                    form={form}
                                    label='Purchases Price'
                                    type='number'
                                    step='0.001'
                                    defaultValue='0'
                                    name='base_purchases_price'
                                    rules={{required: false}}
                                />
                            </Col> : <Col sm={2}>
                                <Field
                                    form={form}
                                    label=''
                                    type='hidden'
                                    step='0.001'
                                    name='base_purchases_price'
                                    rules={{required: false}}

                                />
                            </Col>

                    }
                    {
                        canShowRealPrice ? <Col sm={2}>
                                <Field
                                    form={form}
                                    label='Exchange Factor'
                                    type='number'
                                    step='0.001'
                                    defaultValue='1'
                                    name='exchange_factor'
                                    rules={{required: false}}
                                />
                            </Col> : <Col sm={2}>
                                <Field
                                    form={form}
                                    label=''
                                    type='hidden'
                                    step='0.001'
                                    name='exchange_factor'
                                    rules={{required: false}}

                                />
                            </Col>

                    }

                </Row>
                {/*<div className="mr-auto">*/}
                {/*    <Button.Ripple color={'primary'}  onClick={handleCalc}>*/}
                {/*        <RefreshCw size={14} />*/}
                {/*        <span className='align-middle ml-25'>Calculate</span>*/}
                {/*    </Button.Ripple>*/}
                {/*</div>*/}
            </CardBody>
        </Card>
    )
}
