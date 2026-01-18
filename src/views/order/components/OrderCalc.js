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
import { useValidCoupons } from '@data/use-coupon' // Import the new hook
import { Controller } from 'react-hook-form'
import Select from 'react-select'
import { useEffect, useState } from 'react'

const PreviewCard = ({ form, calculations, orderId, disabled, setCoupon, isMigrated }) => {
    const user = form.watch('user_id')
    const products = form.watch('products') || []
    const extraItems = form.watch('extra_items') || []
    const currentCoupon = form.watch('coupon_id')
    const shipping = form.watch('shipping')
    const hasShipping = form.watch('has_shipping')
    const discount = form.watch('discount')
    const discountPercentage = form.watch('discount_percentage')
    const subtotal = calculations?.subtotal || 0


    // Prepare products data for validation
    const productsData = products.map(p => ({
        id: p.id,
        brand_id: p.brand_id,
        price: p.price,
        quantity: p.quantity
    }))

    // Use the new hook for valid coupons
    const { data: validCoupons, loading: isValidating } = useValidCoupons({
        user_id: user,
        order_id: orderId,
        products: productsData
    })

    const couponsList = (validCoupons || []).map(e => ({
        label: `${e.name} (${e.code}) - ${e.is_percentage ? `${e.amount  }%` : `$${  e.amount}`}`,
        value: e.id,
        data: e,
        is_percentage: e.is_percentage,
        amount: e.amount
    }))

    // Calculate total discount from all products and extra items
    const calculateTotalDiscount = () => {
        const productsDiscount = products.reduce((sum, p) => sum + (parseFloat(p.discount) || 0), 0)
        const extraItemsDiscount = extraItems.reduce((sum, e) => sum + (parseFloat(e.discount) || 0), 0)
        return productsDiscount + extraItemsDiscount
    }

    // Calculate percentage based on total discount
    const calculatePercentage = (totalDiscount) => {
        return subtotal > 0 ? (totalDiscount / subtotal) * 100 : 0
    }

    // In OrderCalc.js, replace the redistributeDiscount function with this:

// Enhanced redistributeDiscount function with proper exclusion support
    const redistributeDiscount = (totalDiscount, currentCoupon = null) => {
        if (subtotal <= 0) return

        const couponData = currentCoupon || validCoupons.find(c => c.id === currentCoupon)
        const isPercentage = couponData?.is_percentage

        // Get excluded product and brand IDs from coupon
        const excludedProductIds = couponData?.products?.map(p => p.id) || []
        const excludedBrandIds = couponData?.brands?.map(b => b.id) || []

        let totalEligibleValue = 0
        const productsWithEligibility = []

        // Calculate eligible values and mark products
        products.forEach(product => {
            const productValue = product.price * product.quantity

            // Check if product is excluded
            const isExcluded = excludedProductIds.includes(product.id) ||
                (product.brand_id && excludedBrandIds.includes(product.brand_id))

            productsWithEligibility.push({
                ...product,
                value: productValue,
                eligible: !isExcluded,
                isExcluded
            })

            // For percentage coupons, only include eligible products in distribution
            // For fixed coupons, include all products
            if (!isPercentage || (isPercentage && !isExcluded)) {
                totalEligibleValue += productValue
            }
        })

        // Include extra items
        // For percentage coupons: extra items are always eligible
        // For fixed coupons: extra items are included in distribution
        const extraItemsWithEligibility = extraItems.map(item => {
            const itemValue = item.price * item.quantity
            totalEligibleValue += itemValue
            return {
                ...item,
                value: itemValue,
                eligible: true,
                isExcluded: false
            }
        })

        // Update products with distributed discount
        const updatedProducts = productsWithEligibility.map(item => {
            let discountShare = 0

            if (isPercentage) {
                // For percentage coupons: only distribute to eligible items
                if (item.eligible && totalEligibleValue > 0) {
                    discountShare = (item.value / totalEligibleValue) * totalDiscount
                }
            } else {
                // For fixed coupons: distribute to all items (including excluded ones)
                if (totalEligibleValue > 0) {
                    discountShare = (item.value / totalEligibleValue) * totalDiscount
                }
            }

            return {
                ...item,
                discount: parseFloat(discountShare).toFixed(3)
            }
        })

        // Update extra items with distributed discount
        const updatedExtraItems = extraItemsWithEligibility.map(item => {
            let discountShare = 0

            if (totalEligibleValue > 0) {
                discountShare = (item.value / totalEligibleValue) * totalDiscount
            }

            return {
                ...item,
                discount: parseFloat(discountShare).toFixed(3)
            }
        })

        form.setValue('products', updatedProducts)
        form.setValue('extra_items', updatedExtraItems)
    }

    // Update form values when individual items change
    useEffect(() => {
        const totalDiscount = calculateTotalDiscount()
        const newPercentage = calculatePercentage(totalDiscount)

        // Only update if there's a significant difference to avoid infinite loops
        if (Math.abs(totalDiscount - discount) >= 0.01 || Math.abs(discount - totalDiscount) >= 0.01) {
            form.setValue('discount', parseFloat(totalDiscount).toFixed(2))
            form.setValue('discount_percentage', parseFloat(newPercentage).toFixed(2))
        }
    }, [products, extraItems])

    // Handle coupon change
    useEffect(() => {
        if (!currentCoupon || validCoupons.length === 0) return

        const coupon = validCoupons.find(c => c.id === currentCoupon)
        setCoupon(coupon)

        if (coupon) {
            if (coupon.is_percentage) {
                // For percentage coupons: calculate based on eligible products only
                const excludedProductIds = coupon.products?.map(p => p.id) || []
                const excludedBrandIds = coupon.brands?.map(b => b.id) || []

                let eligibleSubtotal = 0

                // Calculate eligible subtotal (excluding excluded products)
                products.forEach(product => {
                    const isExcluded = excludedProductIds.includes(product.id) ||
                        (product.brand_id && excludedBrandIds.includes(product.brand_id))
                    if (!isExcluded) {
                        eligibleSubtotal += product.price * product.quantity
                    }
                })

                // Include extra items in eligible subtotal for percentage coupons
                extraItems.forEach(item => {
                    eligibleSubtotal += item.price * item.quantity
                })

                const discountAmount = (coupon.amount / 100) * eligibleSubtotal
                form.setValue('discount_percentage', parseFloat(coupon.amount).toFixed(2))
                form.setValue('discount', parseFloat(discountAmount).toFixed(2))
                redistributeDiscount(discountAmount, coupon)
            } else {
                // Fixed coupon: apply to entire order
                const discountAmount = Math.min(coupon.amount, subtotal)
                form.setValue('discount', discountAmount)
                const percentage = subtotal > 0 ? (discountAmount / subtotal) * 100 : 0
                form.setValue('discount_percentage', parseFloat(percentage).toFixed(2))
                redistributeDiscount(discountAmount, coupon)
            }
        }
    }, [currentCoupon, validCoupons])

    // Clear coupon if it becomes invalid when valid coupons change
    useEffect(() => {
        if (currentCoupon && validCoupons.length > 0) {
            const isStillValid = validCoupons.some(coupon => coupon.id === currentCoupon)
            if (!isStillValid) {
                form.setValue('coupon_id', null)
                // Reset discount if it was set by coupon
                if (discount > 0) {
                    form.setValue('discount', 0)
                    form.setValue('discount_percentage', 0)
                }
            }
        }
    }, [validCoupons, currentCoupon])

    // Handle manual discount change
    const handleDiscountChange = (e) => {
        const newDiscount = parseFloat(e.target.value) || 0
        const newPercentage = calculatePercentage(newDiscount)

        // Clear coupon when manually changing discount
        if (currentCoupon) {
            form.setValue('coupon_id', null)
        }

        form.setValue('discount', newDiscount)
        form.setValue('discount_percentage', parseFloat(newPercentage).toFixed(2))
        redistributeDiscount(newDiscount)
    }

    // Handle manual percentage change
    const handlePercentageChange = (e) => {
        const newPercentage = parseFloat(e.target.value) || 0
        const newDiscount = (newPercentage / 100) * subtotal

        // Clear coupon when manually changing discount
        if (currentCoupon) {
            form.setValue('coupon_id', null)
        }

        form.setValue('discount', parseFloat(newDiscount).toFixed(2))
        form.setValue('discount_percentage', newPercentage)
        redistributeDiscount(newDiscount)
    }

    return (
        <CardBody className='pb-2'>
            <Row className='justify-content-end'>
                <Col md='12'>
                    <Row className='justify-content-end'>
                        <Col md='6'>
                            <FormGroup row>
                                <Label sm='3' for='order'><strong>Subtotal</strong></Label>
                                <Col sm='9'>
                                    <InputGroup>
                                        <Input value={calculations?.subtotal || 0} disabled />
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
                                <Label sm='1' for='order'><strong>%</strong></Label>
                                <Col sm='3'>
                                    <Input
                                        disabled={disabled || isMigrated}
                                        name='discount_percentage'
                                        type='number'
                                        step='0.001'
                                        defaultValue={0}
                                        innerRef={form.register({required: true})}
                                        invalid={form.errors.discount_percentage && true}
                                        onChange={handlePercentageChange}
                                    />
                                </Col>
                                <Label sm='2' for='order'><strong>Discount</strong></Label>
                                <Col sm='3'>
                                    <Input
                                        disabled={disabled || isMigrated}
                                        name='discount'
                                        type='number'
                                        defaultValue={0}
                                        step='0.001'
                                        innerRef={form.register({required: true})}
                                        invalid={form.errors.discount && true}
                                        onChange={handleDiscountChange}
                                    />
                                </Col>
                                <Col sm='3'>
                                    <Controller
                                        control={form.control}
                                        name="coupon_id"
                                        render={({ onChange, value, name, ref }) => (
                                            <div>
                                                <Select
                                                    isDisabled={disabled || isMigrated || isValidating}
                                                    className='react-select'
                                                    classNamePrefix='select'
                                                    placeholder={
                                                        isValidating ? 'Loading valid coupons...' : !user ? 'Select a customer first' : 'Coupon'
                                                    }
                                                    value={couponsList.filter(option => option.value === value)}
                                                    inputRef={ref}
                                                    isClearable={true}
                                                    options={couponsList}
                                                    onChange={val => {
                                                        onChange(val?.value || null)
                                                        if (form.formState.errors.coupon_id) {
                                                            form.clearErrors('coupon_id')
                                                        }
                                                    }}
                                                />
                                                {isValidating && (
                                                    <div className="text-info small mt-1">
                                                        Loading valid coupons...
                                                    </div>
                                                )}
                                                {!user && (
                                                    <div className="text-warning small mt-1">
                                                        Please select a customer to see available coupons
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row className='justify-content-end'>
                        <Col md='6'>

                            {
                                currentCoupon &&
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
                            {
                                hasShipping &&
                                <FormGroup row>
                                    <Label sm='3' for='order'><strong>Shipping</strong></Label>
                                    <Col sm='9'>
                                        <InputGroup>
                                            {
                                                shipping?.free ? <Input value={'Free'} disabled /> : <Input value={shipping?.cost || 0} disabled />
                                            }
                                            <InputGroupAddon addonType='append'>
                                                <InputGroupText>$</InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </Col>
                                </FormGroup>
                            }
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