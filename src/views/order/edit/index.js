import { Row, Col, Form } from 'reactstrap'
import '@styles/base/pages/app-invoice.scss'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import { Controller, useForm } from 'react-hook-form'
import { useOrder } from '@data/use-order'
import { toast } from 'react-toastify'

import OrderMain from '../components/OrderMain'
import OrderStatus from '../components/OrderStatus'
import OrderOptions from '../components/OrderOptions'
import ShippingStatus from '../components/ShippingStatus'
import OrderAttachments from '../components/OrderAttachments'

const fields = [
    'customer',
    'notes',
    'invoice_notes',
    'products',
    'shipping',
    'city_id',
    'coupon_id',
    'shipping_provider_id',
    'options',
    'discount',
    'extra_items',
    'user_id',
    'attachments'
]

export default function () {

    const { id } = useParams()
    const {
        data: order,
        update: updateOrder,
        updateStatus
    } = useOrder(id)

    const form = useForm()

    const [loaded, setLoaded] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)

    const onSubmit = async data => {
        try {
            data.products = data.products?.map(
                ({ id, price, quantity }) => ({ id, price, quantity })
            ) || []
            await updateOrder(data)
            toast.success('Order Updated')
        } catch (e) {
            toast.error(e?.response?.data?.message)
        }
    }

    useEffect(() => {
        if (!loaded && order) {
            setLoaded(true)
            for (const field of fields) {
                form.setValue(field, order[field])
            }
            form.setValue('has_shipping', !!order.shipping?.address)
        }
        const completed = order?.status === 'COMPLETED'
        setIsCompleted(completed)
    }, [order])

    return (
        <Form onSubmit={form.handleSubmit(onSubmit)}>
            <Row>
                <Col md={9} sm={12}>
                    <OrderMain order={order} form={form} isCompleted={isCompleted} />
                    <Controller
                        control={form.control}
                        defaultValue={[]}
                        name={'attachments'}
                        render={({value, onChange}) => {
                            return (
                                <OrderAttachments
                                    onChange={onChange}
                                    files={value}
                                />
                            )
                        }}
                    />

                </Col>
                <Col md={3} sm={12}>
                    <OrderStatus update={updateStatus} order={order} />
                    <ShippingStatus form={form} order={order} isCompleted={isCompleted}/>
                    <OrderOptions form={form} order={order} isCompleted={isCompleted} />
                </Col>
            </Row>
        </Form>
    )
}