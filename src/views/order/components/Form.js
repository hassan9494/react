import {
    Card,
    CardBody,
    Row,
    Col,
    FormGroup,
    Input,
    Label,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Button
} from 'reactstrap'
import ProductsTable from '../components/ProductsTable'
import moment from 'moment'
import { useEffect, useState } from 'react'

const PreviewCard = ({ order, form }) => {

    const [calculations, setCalculations] = useState(0)
    const [disabled, setDisabled] = useState(true)

    const status = form.watch('status')
    const products = form.watch('products')
    const discount = form.watch('discount')
    const shippingCost = form.watch('shipping.cost')

    const calculate = () => {
        let subtotal = 0
        for (const item of products || []) {
            subtotal += item.price * item.quantity
        }
        const total = subtotal + Number.parseFloat(shippingCost || 0) - Number.parseFloat(discount || 0)
        setCalculations({ subtotal, total })
    }

    useEffect(() => {
        calculate()
        setDisabled(order && order?.status !== 'PENDING')
    }, [products, discount, shippingCost, status])

    return (
        <Card>

            <CardBody className='px-2 pb-0'>
                <div className='d-flex justify-content-between flex-md-row flex-column'>
                    <div>
                        <strong>New Order</strong>
                    </div>
                    <div>
                        Date: <span className='invoice-number'>{moment().format('Y-m-d')}</span>
                    </div>
                </div>
            </CardBody>

            <hr className='invoice-spacing'/>

            <CardBody className='px-2 pt-0'>
                <Row>
                    <Col sm='4'>
                        <FormGroup>
                            <Label for='customerName'>Name</Label>
                            <Input
                                type='text'
                                id='customerName'
                                name="customer.name"
                                innerRef={form.register({required: true})}
                                invalid={form.errors.customer?.name && true}
                            />
                        </FormGroup>
                    </Col>
                    <Col sm='4'>
                        <FormGroup>
                            <Label for='customerPhone'>Phone</Label>
                            <Input
                                type='text'
                                id='customerName'
                                name="customer.phone"
                                innerRef={form.register({required: true})}
                                invalid={form.errors.customer?.phone && true}
                            />
                        </FormGroup>
                    </Col>
                    <Col sm='4'>
                        <FormGroup>
                            <Label for='customerEmail'>Email</Label>
                            <Input
                                type='text'
                                id='customerEmail'
                                name="customer.email"
                                innerRef={form.register({required: true})}
                                invalid={form.errors.customer?.email && true}
                            />
                        </FormGroup>
                    </Col>
                    <Col sm='12'>
                        <FormGroup>
                            <Label for='notes'>Notes</Label>
                            <Input
                                id='notes'
                                type='textarea'
                                name="notes"
                                innerRef={form.register({ required: false })}
                                invalid={form.errors.notes && true}
                            />
                        </FormGroup>
                    </Col>

                </Row>
            </CardBody>
            {/* /Address and Contact */}

            {/* Products Table */}
            <ProductsTable form={form} disabled={disabled} />
            {/* /Products Table */}

            <hr className='m-0' />

            {/* Total */}
            <CardBody className='pb-2'>
                <Row className='justify-content-end'>
                    <Col md='4'>
                        <FormGroup row>
                            <Label sm='4' for='order'><strong>Subtotal</strong></Label>
                            <Col sm='8'>
                                <InputGroup>
                                    <Input value={calculations?.subtotal || 0}  disabled />
                                    <InputGroupAddon addonType='append'>
                                        <InputGroupText>$</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm='4' for='order'><strong>Discount</strong></Label>
                            <Col sm='8'>
                                <InputGroup>
                                    <Input
                                        name={'discount'}
                                        type='number'
                                        defaultValue={0}
                                        min={0}
                                        innerRef={form.register({required: true})}
                                        invalid={form.errors.discount && true}
                                    />
                                    <InputGroupAddon addonType='append'>
                                        <InputGroupText>$</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            </Col>
                        </FormGroup>
                        <hr className='invoice-spacing' />
                        <FormGroup row>
                            <Label sm='4' for='order'><strong>Total</strong></Label>
                            <Col sm='8'>
                                <InputGroup>
                                    <Input value={calculations?.total || 0} disabled />
                                    <InputGroupAddon addonType='append'>
                                        <InputGroupText>$</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            </Col>
                        </FormGroup>
                    </Col>
                </Row>
            </CardBody>

            {/* Total */}
            <hr className='invoice-spacing' />

            {/* Invoice Note */}
            <CardBody className='invoice-padding pt-0 d-flex justify-content-end'>
                <Button.Ripple color={'success'} type='submit' >
                    Save Changes
                </Button.Ripple>
            </CardBody>
            {/* /Invoice Note */}

        </Card>
    )
}

export default PreviewCard
