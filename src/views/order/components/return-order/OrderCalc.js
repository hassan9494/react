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
import { Controller } from 'react-hook-form'
import Select from 'react-select'
import { useEffect, useRef } from 'react'
import ExtraItems from "./ExtraItems"

const PreviewCard = ({ form, calculations, disabled }) => {
    const products = form.watch('products') || []
    const extraItems = form.watch('extra_items') || []
    const discount = form.watch('discount') || 0
    const subtotal = calculations?.subtotal || 0

    // Calculate total discount from all products and extra items
    const calculateTotalDiscount = () => {
        const productsDiscount = products.reduce((sum, p) => sum + (parseFloat(p.discount / p.quantity * p.returned_quantity) || 0), 0)
        const extraItemsDiscount = extraItems.reduce((sum, e) => sum + (parseFloat(e.discount / e.quantity * e.returned_quantity) || 0), 0)
        return productsDiscount + extraItemsDiscount
    }


    // Redistribute discount proportionally across all items
    const redistributeDiscount = (totalDiscount) => {
        if (subtotal <= 0) return

        // Calculate total value of all items (products + extra items)
        const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0) +
            extraItems.reduce((sum, e) => sum + (e.price * e.quantity), 0)

        // Update products
        const updatedProducts = products.map(p => {
            const productValue = p.price * p.quantity
            const discountShare = totalValue > 0 ? (productValue / totalValue) * totalDiscount : 0
            return {
                ...p,
                discount: parseFloat(discountShare).toFixed(3)
            }
        })

        // Update extra items
        const updatedExtraItems = extraItems.map(e => {
            const itemValue = e.price * e.quantity
            const discountShare = totalValue > 0 ? (itemValue / totalValue) * totalDiscount : 0
            return {
                ...e,
                discount: parseFloat(discountShare).toFixed(3)
            }
        })

        form.setValue('products', updatedProducts)
        form.setValue('extra_items', updatedExtraItems)
    }

    // Update form values when individual items change
    useEffect(() => {
        const totalDiscount = calculateTotalDiscount()
        if ((totalDiscount - discount) >= 0.01 || (discount - totalDiscount) >= 0.01) {
            form.setValue('discount', parseFloat(totalDiscount).toFixed(2))
        }

    }, [products, extraItems])

    // Handle manual discount change (from OrderCalc)
    const handleDiscountChange = (e) => {
        const newDiscount = parseFloat(e.target.value) || 0

        form.setValue('discount', newDiscount)

        redistributeDiscount(newDiscount)
    }

    return (
        <CardBody className='pb-2'>
            <Row className='justify-content-end'>
                <Col md='12'>
                    <Row className='justify-content-end'>
                        <Col md='9'>
                            <FormGroup row>
                                <Label sm='3' for='order'><strong>Subtotal</strong></Label>
                                <Col sm='9'>
                                    <InputGroup>
                                        <Input value={calculations?.subtotal || 0}  readOnly />
                                        <InputGroupAddon addonType='append'>
                                            <InputGroupText>$</InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </Col>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row className='justify-content-end'>
                        <Col md='9'>
                            <FormGroup row>
                                <Label sm='3' for='order'><strong>Discount</strong></Label>
                                <Col sm='3'>
                                    <Input
                                        disabled={disabled}
                                        name='discount'
                                        type='number'
                                        step='0.001'
                                        innerRef={form.register({required: true})}
                                        invalid={form.errors.discount && true}
                                        onChange={handleDiscountChange}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row className='justify-content-end'>
                        <Col md='9'>

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

                        </Col>
                    </Row>
                </Col>
            </Row>
        </CardBody>
    )
}

export default PreviewCard