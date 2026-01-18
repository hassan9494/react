import {Row, Col, Form} from 'reactstrap'
import '@styles/base/pages/app-invoice.scss'
import {useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import {Controller, useForm} from 'react-hook-form'
import {useOrder, api} from '@data/use-order'
import {toast} from 'react-toastify'

import OrderMain from '../components/OrderMain'
import OrderStatus from '../components/OrderStatus'
import OrderOptionsPriceOffer from '../components/OrderOptionsPriceOffer'
import ShippingStatus from '../components/ShippingStatus'
import OrderAttachments from '../components/OrderAttachments'
import OrderTransaction from "../components/OrderTransaction"


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
    'pending',
    'attachments'
]

export default function () {

    const {id} = useParams()
    const {
        data: order,
        update: updateOrder,
        updateStatus
    } = useOrder(id)
    let isReorder
    if (id === undefined) {
        isReorder = false
    } else {
        isReorder = true
    }
    const [calculations, setCalculations] = useState(0)
    const form = useForm()
    const history = useHistory()

    const [loaded, setLoaded] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)
// Add empty transactions state for create component
    const [transactions, setTransactions] = useState([])
    const onSubmit = async data => {
        try {
            data.products = data.products?.map(
                ({id, price, quantity, discount, number}) => ({id, price, quantity, discount, number})
            ) || []
            const {id: orderId} = await api.create(data)
            toast.success('Order Created')
            history.push(`/order/edit/${orderId}`)
        } catch (e) {
            toast.error(e?.response?.data?.message)
            console.log(e)
        }
    }
    useEffect(() => {
        if (!loaded && order) {
            setLoaded(true)
            for (const field of fields) {
                if (field === 'shipping' || field === 'customer' || field === 'notes' || field === 'invoice_notes' || field === 'city_id' || field === 'coupon_id' || field === 'shipping_provider_id' || field === 'options' || field === 'discount' || field === 'user_id') {
                    form.setValue(field, null)
                }  else {
                    form.setValue(field, order[field])
                }

            }
            // form.setValue('has_shipping', null)
        }
        const completed = order?.status === 'COMPLETED'
        setIsCompleted(completed)
    }, [order])
    return (
        <Form onSubmit={form.handleSubmit(onSubmit)}>
            <Row>
                <Col md={9} sm={12}>
                    <OrderMain  calculations={calculations} setCalculations={setCalculations} order={order} form={form} isCompleted={false} isReorder={true}/>
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
                    <OrderStatus form={form}  transactions={[]}/>
                    <ShippingStatus form={form}/>
                    <OrderOptionsPriceOffer form={form} isReorder={true}/>
                </Col>
            </Row>
        </Form>
    )
}