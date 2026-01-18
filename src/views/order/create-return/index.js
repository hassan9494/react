import {Row, Col, Form} from 'reactstrap'
import '@styles/base/pages/app-invoice.scss'
import {useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import {Controller, useForm} from 'react-hook-form'
import {useOrder} from '@data/use-order'
import { api} from '@data/use-return-order'
import {toast} from 'react-toastify'

import OrderMain from '../components/return-order/OrderMain'
import OrderAttachments from '../components/OrderAttachments'
import OrderStatus from "../components/return-order/OrderStatus"
import ShippingStatus from "../components/ShippingStatus"
import OrderOptions from "../components/OrderOptions"


const fields = [
    'notes',
    'products',
    'discount',
    'discount_percentage',
    'extra_items',
    'attachments',
    'status'
]

export default function () {

    const form = useForm()
    const history = useHistory()

    const [loaded, setLoaded] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)

    // Add empty transactions state for create component
    const [transactions, setTransactions] = useState([])
    const [calculations, setCalculations] = useState(0)

    const discount = form.watch('discount') || 0

    useEffect(() => {
        if (!loaded) {
            form.setValue('discount', discount)
        }
    }, [loaded])

    const onSubmit = async data => {
        try {
            data.products = data.products?.map(
                ({id, price, quantity, number, discount, returned_quantity, main_discount}) => ({id, price, quantity, number, discount, returned_quantity, main_discount})
            ) || []

            const {id: orderId} = await api.create(data)
            toast.success('Order Created')
            history.push(`/return-order/edit/${orderId}`)
        } catch (e) {
            toast.error(e?.response?.data?.message)
            console.log(e)
        }
    }

    // Add empty function for onCompleteWithData in create mode
    const handleCompleteWithData = async (completionData) => {
        // This shouldn't be called in create mode, but we need to provide the function
        toast.error('Cannot complete order in create mode')
    }

    return (
        <Form onSubmit={form.handleSubmit(onSubmit)}>
            <Row>
                <Col md={9} sm={12}>
                    <OrderMain form={form} isCompleted={false} calculations={calculations} setCalculations={setCalculations}/>
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
                    <OrderStatus
                        form={form}
                        transactions={transactions} // Pass empty array for create
                        calculations={calculations}
                        onCompleteWithData={handleCompleteWithData}
                    />
                </Col>
            </Row>
        </Form>
    )
}