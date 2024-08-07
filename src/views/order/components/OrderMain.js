import {
    Card,
    CardBody,
    Button
} from 'reactstrap'
import ProductsTable from './ProductsTable'
import moment from 'moment'
import { useEffect, useState } from 'react'
import {Plus, Printer, Save} from 'react-feather'
import { Link, useLocation } from 'react-router-dom'
import { getProductPrice } from "./helpers"
import OrderCustomer from './OrderCustomer'
import ExtraItems from './ExtraItems'
import OrderCalc from './OrderCalc'
import ability from "../../../configs/acl/ability"

const PreviewCard = ({ order, form, isCompleted, isReorder }) => {

    const [coupon, setCoupon] = useState()
    const [calculations, setCalculations] = useState(0)
    const [disabled, setDisabled] = useState(true)

    const products = form.watch('products')
    const extraItems = form.watch('extra_items')
    const discount = form.watch('discount')
    const shippingCost = form.watch('shipping.cost')
    const shippingFree = form.watch('shipping.free')
    const pricing = form.watch('options.pricing')
    const location = useLocation()
    const canReorderOrder = ability.can('read', 'order_reorder')
    const canPrintOrder = ability.can('read', 'order_print')

    const calculate = () => {

        let subtotal = 0
        for (const item of (products || [])) {
            const price = getProductPrice(item, pricing)
            subtotal += price * item.quantity
        }
        for (const item of (extraItems || [])) {
            subtotal += item.quantity * item.price
        }

        const totalWithCoupon = coupon ? (coupon.is_percentage ? subtotal * ((100 - coupon.amount) / 100) : (coupon.amount)) : 0

        const total = subtotal + Number.parseFloat(shippingFree ? 0 : (shippingCost || 0)) - Number.parseFloat(discount || 0)


        setCalculations({
            subtotal: subtotal.toFixed(2),
            total: total.toFixed(2),
            totalWithCoupon: totalWithCoupon.toFixed(2)
        })
    }

    useEffect(() => {
        calculate()
        setDisabled(((order && order?.status !== 'PENDING') || isCompleted) && !isReorder)
    }, [order, products, extraItems, discount, shippingCost, shippingFree, pricing, coupon])

    return (
        <Card>
            <CardBody className='px-2 pb-0'>
                {/* Header */}
                <div className='d-flex justify-content-between flex-md-row flex-column'>
                    <div>
                        <strong>{ order?.number ? `Order: #${order?.number} | ${order?.tax_number || '--'}` : 'New Order' }</strong>
                    </div>
                    <div>
                        Date: <span className='invoice-number'>{moment().format('Y-MM-DD')}</span>
                    </div>
                </div>
                {/* /Header */}
            </CardBody>

            <hr className='invoice-spacing'/>

            {/* Address and Contact */}
            <CardBody className='px-2 pt-0'>
                <OrderCustomer form={form} order={order} disabled={isCompleted} />
            </CardBody>
            {/* /Address and Contact */}

            {/* Products Table */}
            <ProductsTable form={form} disabled={disabled} />
            {/* /Products Table */}

            {/* Products Table */}
            <ExtraItems form={form} fieldName='extra_items' disabled={disabled} onUpdate={calculate} />
            {/* /Products Table */}

            <hr className='m-0' />

            {/* Total */}
            <OrderCalc form={form} calculations={calculations} disabled={isCompleted} setCoupon={setCoupon} />

            {/* Total */}
            <hr className='invoice-spacing' />

            {/* Invoice Note */}
            <CardBody className='invoice-padding pt-0 d-flex'>
                <div className="mr-auto">
                    {
                        (order && canPrintOrder) &&
                        <Link to={`/order/print/${order.id}`} id={`pw-tooltip-${order.id}`} target='_blank'>
                            <Button.Ripple color={'dark'}>
                                <Printer size={14} />
                                <span className='align-middle ml-25'>Print</span>
                            </Button.Ripple>
                        </Link>
                    }
                </div>
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
