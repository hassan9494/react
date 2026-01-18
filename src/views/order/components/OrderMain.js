import {
    Card,
    CardBody,
    Button,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap'
import ProductsTable from './ProductsTable'
import moment from 'moment'

import { useEffect, useState } from 'react'
import { Plus, Printer, Save, Download, Info  } from 'react-feather'
import { Link, useLocation, useHistory, useParams } from 'react-router-dom'
import { getProductPrice } from "./helpers"
import OrderCustomer from './OrderCustomer'
import ExtraItems from './ExtraItems'
import OrderCalc from './OrderCalc'
import ability from "../../../configs/acl/ability"
import {identity, pickBy} from "lodash"
import axiosInstance from './../../../utility/axiosIsntance'

import { orderToExcel  } from '@helpers/SingleOrder'

const PreviewCard = ({ order, form, isCompleted, isReorder, isMigrated, calculations, setCalculations }) => {
    const [coupon, setCoupon] = useState()
    // const [calculations, setCalculations] = useState(0)
    const [disabled, setDisabled] = useState(true)
    const [dropdownOpen, setDropdownOpen] = useState(false)

    const products = form.watch('products')
    const extraItems = form.watch('extra_items')
    const discount = form.watch('discount')
    const shippingCost = form.watch('shipping.cost')
    const shippingFree = form.watch('shipping.free')
    const pricing = form.watch('options.pricing')
    const location = useLocation()
    const canReorderOrder = ability.can('read', 'order_reorder')
    const canPrintOrder = ability.can('read', 'order_print')

    // In OrderMain.js, update the calculate function:

    const calculate = () => {
        let subtotal = 0
        let eligibleSubtotal = 0 // For percentage coupons

        // Get current coupon data
        const currentCoupon = coupon

        // Get excluded product and brand IDs for percentage coupons
        const excludedProductIds = currentCoupon?.is_percentage ? (currentCoupon.products?.map(p => p.id) || []) : []
        const excludedBrandIds = currentCoupon?.is_percentage ? (currentCoupon.brands?.map(b => b.id) || []) : []

        for (const item of (products || [])) {
            const price = getProductPrice(item, pricing)
            const itemTotal = price * item.quantity
            subtotal += itemTotal

            // For percentage coupons, calculate eligible subtotal excluding excluded products
            if (currentCoupon?.is_percentage) {
                const isExcluded = excludedProductIds.includes(item.id) ||
                    (item.brand_id && excludedBrandIds.includes(item.brand_id))
                if (!isExcluded) {
                    eligibleSubtotal += itemTotal
                }
            }
        }

        for (const item of (extraItems || [])) {
            const itemTotal = item.quantity * item.price
            subtotal += itemTotal

            // Extra items are always eligible for percentage coupons
            if (currentCoupon?.is_percentage) {
                eligibleSubtotal += itemTotal
            }
        }

        // Calculate totalWithCoupon based on coupon type
        let totalWithCoupon = 0
        if (currentCoupon) {
            if (currentCoupon.is_percentage) {
                // For percentage coupons: apply discount only to eligible items
                const discountAmount = (currentCoupon.amount / 100) * eligibleSubtotal
                totalWithCoupon = subtotal - discountAmount
            } else {
                // For fixed coupons: apply discount to entire order
                const discountAmount = Math.min(currentCoupon.amount, subtotal)
                totalWithCoupon = subtotal - discountAmount
            }
        }

        const total = subtotal + Number.parseFloat(shippingFree ? 0 : (shippingCost || 0)) - Number.parseFloat(discount || 0)

        setCalculations({
            subtotal: subtotal.toFixed(2),
            total: total.toFixed(2),
            totalWithCoupon: totalWithCoupon > 0 ? totalWithCoupon.toFixed(2) : subtotal.toFixed(2)
        })
    }
    useEffect(() => {
        calculate()
        setDisabled(((order && order?.status !== 'PENDING') || isCompleted) && !isReorder)
    }, [order, products, extraItems, discount, shippingCost, shippingFree, pricing, coupon])

    // Toggle dropdown
    const toggleDropdown = () => setDropdownOpen(prevState => !prevState)

    // Handle print option selection
    const handlePrintOption = (path) => {
        if (order) {
            window.open(path.replace(':id', order.id), '_blank')
        }
    }

    const { id } = useParams()
    const history = useHistory()

    const navigateToDetails = () => {
        history.push(`/order/details/${id}`)
    }

    const handleExport = async () => {
        const data = order
        const fileName = `order : ${order?.id}`

        // Record export action
        try {
            await axiosInstance.post(`/order/${order.id}/record-export`)
            // console.log('Export recorded successfully')
        } catch (error) {
            console.error('Error recording export:', error.response?.data || error.message)
        }

        orderToExcel(data, fileName)
    }
    const canViewOrderDetails = ability.can('read', 'order_details')

    return (
        <Card>
            <CardBody className='px-2 pb-0'>
                {/* Header */}
                <div className='d-flex justify-content-between flex-md-row flex-column'>
                    <div>
                        <strong>{ order?.number ? `Order: #${order?.number} | ${order?.tax_number || '--' } | ${(order?.taxed_at ? moment(order?.taxed_at).format('YYYY-MM-DD HH:mm') : '--')}` : 'New Order'  }</strong>
                    </div>
                    <div>
                        <strong>{ order?.is_migrated ? `Fatora Status:  ${order?.fatora_status }` : `Fatora Status:  ${order?.fatora_status ?? 'Not Sent' }`  }</strong>
                    </div>
                    <div className='d-flex align-items-center'>
                        Date: <span className='invoice-number'>{moment(order?.created_at).format('YYYY-MM-DD HH:mm')}</span>
                        {canViewOrderDetails && (
                            <Button
                                color=""
                                onClick={navigateToDetails}
                            >
                                <Info color='orange' size={16}  />
                            </Button>
                        )}

                    </div>

                </div>
                {/* /Header */}
            </CardBody>

            <hr className='invoice-spacing'/>

            {/* Address and Contact */}
            <CardBody className='px-2 pt-0'>
                <OrderCustomer form={form} order={order} disabled={isCompleted || isMigrated} />
            </CardBody>
            {/* /Address and Contact */}

            {/* Products Table */}
            <ProductsTable form={form} disabled={disabled} isMigrated={isMigrated}/>
            {/* /Products Table */}

            {/* Extra Items */}
            <ExtraItems form={form} fieldName='extra_items' disabled={disabled} onUpdate={calculate} isMigrated={isMigrated} />
            {/* /Extra Items */}

            <hr className='m-0' />

            {/* Total */}
            <OrderCalc form={form} orderId={order?.id} calculations={calculations} disabled={isCompleted} setCoupon={setCoupon}  isMigrated={isMigrated}/>

            {/* Total */}
            <hr className='invoice-spacing' />

            {/* Invoice Note */}
            <CardBody className='invoice-padding pt-0 d-flex'>
                {/*<div className="mr-auto">*/}
                {canPrintOrder && (
                    <>
                        <div className={'mr-auto'}>
                            <select
                                value={dropdownOpen || 'normal'}
                                onChange={(e) => setDropdownOpen(e.target.value)}
                                className="form-control mr-auto"
                            >
                                <option value="normal" selected>Normal</option>
                                <option value="price-offer">Price Offer</option>
                                <option value="locations">Locations</option>
                                <option value="pictures">Pictures</option>
                                <option value="prepare">Prepare</option>
                                <option value="receipt">Receipt</option>
                            </select>
                        </div>
                        <div  className={'mr-auto'}>
                            <Button.Ripple
                                color={'dark'}
                                onClick={() => {
                                    const pathMap = {
                                        normal: `/order/print/:id`,
                                        'price-offer': `/order/print-price-offer/:id`,
                                        locations: `/order/print-location/:id`,
                                        pictures: `/order/print-picture/:id`,
                                        prepare: `/order/print-prepare/:id`,
                                        receipt: `/order/print-receipt/:id`
                                    }
                                    handlePrintOption(pathMap[dropdownOpen || 'normal'])
                                }}
                                className="mt-0 mr-auto"
                            >
                                Print
                            </Button.Ripple>
                        </div>
                    </>
                )}
                {/*</div>*/}


                <div className="mr-auto">
                    {
                        (order && location.pathname.includes('edit') && canReorderOrder) &&
                        <Link to={`/order/create/${order.id}`} id={`pw-tooltip-${order.id}`} target='_blank'>
                            <Button.Ripple color={'primary'}>
                                <Plus size={14} />
                                <span className='align-middle ml-25'>Reorder</span>
                            </Button.Ripple>
                        </Link>
                    }
                </div>


                <div className="mr-auto">
                    {
                        (order && location.pathname.includes('edit')) &&
                        <Button.Ripple color={'primary'}  onClick={handleExport}>
                            <Download size={14} />
                            <span className='align-middle ml-25'>Export</span>
                        </Button.Ripple>
                    }
                </div>

                <Button.Ripple color='secondary' type='submit' >
                    <Save size={14} />
                    <span className='align-middle ml-25'>Save Changes</span>
                </Button.Ripple>
            </CardBody>
            {/* /Invoice Note */}

        </Card>
    )
}

export default PreviewCard