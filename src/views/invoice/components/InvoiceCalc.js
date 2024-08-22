import {
    CardBody,
    Row,
    Col,
    FormGroup,
    Input,
    Label,
    InputGroup,
    InputGroupAddon,
    InputGroupText
} from 'reactstrap'
import { useModels as useCoupons } from '@data/use-coupon'
import { Controller } from 'react-hook-form'
import Select from 'react-select'
import { useEffect } from 'react'


const PreviewCard = ({ form, calculations, disabled, setCoupon }) => {

    const { data: coupons } = useCoupons()
    const couponsList = coupons.map(e => ({label: e.name, value: e.id, data: e}))

    const coupon = form.watch('coupon_id')

    useEffect(() => {
        const res = coupons.filter(e => coupon === e.id)
        if (res.length > 0) setCoupon(res[0])
    }, [coupon, coupons])

    return (
        <CardBody className='pb-2'>
            <Row className='justify-content-end'>
                <Col md='6'>
                    <FormGroup row>
                        <Label sm='3' for='order'><strong>Subtotal</strong></Label>
                        <Col sm='9'>
                            <InputGroup>
                                <Input value={calculations?.subtotal || 0}  disabled />
                                <InputGroupAddon addonType='append'>
                                    <InputGroupText>$</InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label sm='3' for='order'><strong>Discount</strong></Label>
                        <Col sm='3'>
                            <Input
                                disabled={disabled}
                                name='discount'
                                type='number'
                                min={0}
                                step='0.1'
                                defaultValue={0}
                                innerRef={form.register({required: true})}
                                invalid={form.errors.discount && true}
                            />
                        </Col>
                        <Col sm='6'>
                            <Controller
                                control={form.control}
                                name="coupon_id"
                                render={({ onChange, value, name, ref }) => (
                                    <Select
                                        isDisabled={disabled}
                                        className='react-select'
                                        classNamePrefix='select'
                                        placeholder='Coupon'
                                        value={couponsList.filter(option => option.value === value)}
                                        inputRef={ref}
                                        isClearable={true}
                                        options={couponsList}
                                        onChange={val => onChange(val?.value || null)}
                                    />
                                )}
                            />
                        </Col>
                    </FormGroup>
                    <hr className='invoice-spacing' />
                    <FormGroup row>
                        <Label sm='3' for='order'><strong>Total</strong></Label>
                        <Col sm='9'>
                            <InputGroup>
                                <Input value={calculations?.total || 0} disabled />
                                <InputGroupAddon addonType='append'>
                                    <InputGroupText>$</InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                        </Col>
                    </FormGroup>
                    {
                        coupon &&
                        <FormGroup row>
                            <Label sm='3' for='order'><strong>With Coupon</strong></Label>
                            <Col sm='9'>
                                <InputGroup>
                                    <Input value={calculations?.totalWithCoupon || 0} disabled />
                                    <InputGroupAddon addonType='append'>
                                        <InputGroupText>$</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            </Col>
                        </FormGroup>

                    }
                </Col>
            </Row>
        </CardBody>
    )
}

export default PreviewCard
