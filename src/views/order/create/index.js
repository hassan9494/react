import { Row, Col, Form } from 'reactstrap'
import '@styles/base/pages/app-invoice.scss'

import { useForm } from 'react-hook-form'
import { api } from '@data/use-order'
import { toast } from 'react-toastify'

import OrderMain from '../components/OrderMain'
import OrderOptions from '../components/OrderOptions'
import ShippingStatus from '../components/ShippingStatus'
import { useHistory } from 'react-router-dom'

export default function () {

    const history = useHistory()
    const form = useForm()

    const onSubmit = async data => {
        try {
            data.products = data.products?.map(
                ({ id, price, quantity }) => ({ id, price, quantity })
            ) || []
            const { id: orderId } = await api.create(data)
            toast.success('Order Created')
            history.push(`/order/edit/${orderId}`)
        } catch (e) {
            toast.error(e?.response?.data?.message)
            console.log(e)
        }
    }

    return (
        <Form onSubmit={form.handleSubmit(onSubmit)}>
            <Row>
                <Col xl={9} md={8} sm={12}>
                    <OrderMain form={form} />
                </Col>
                <Col xl={3} md={4} sm={12}>
                    <ShippingStatus form={form}  />
                    <OrderOptions form={form} />
                </Col>
            </Row>
        </Form>
    )
}