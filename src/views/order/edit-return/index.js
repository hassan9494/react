import { Row, Col, Form } from 'reactstrap'
import '@styles/base/pages/app-invoice.scss'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import { Controller, useForm } from 'react-hook-form'
import { useOrder } from '@data/use-return-order'
import { toast } from 'react-toastify'

import OrderMain from '../components/return-order/OrderMain'
import OrderStatus from '../components/return-order/OrderStatus'
import OrderToFatora from '../components/return-order/OrderToFatora'
import OrderOptions from '../components/OrderOptions'
import ShippingStatus from '../components/ShippingStatus'
import OrderAttachments from '../components/OrderAttachments'
import ability from "../../../configs/acl/ability"
import ReturnOrderTransaction from "../components/return-order/OrderTransaction"

const fields = [
    'notes',
    'products',
    'discount',
    'discount_percentage',
    'extra_items',
    'attachments',
    'status',
    'order_id'
]

export default function () {

    const { id } = useParams()
    const {
        data: order,
        update: updateOrder,
        submitWithStatus,
        updateStatus,
        submitMigrate
    } = useOrder(id)

    const canMigrateOrder = ability.can('read', 'migrate_completed_order')
    const form = useForm()

    const [loaded, setLoaded] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)
    const [isMigrated, setIsMigrated] = useState(false)

    // Add transactions state for return orders
    const [transactions, setTransactions] = useState([])
    const [calculations, setCalculations] = useState(0)

    const user = JSON.parse(localStorage.getItem('user'))
    const discount = form.watch('discount') || 0

    // Fetch transactions when order changes
    useEffect(() => {
        if (order?.transaction && Array.isArray(order.transaction)) {
            console.log('Setting return order transactions from order:', order.transaction)
            setTransactions(order.transaction)
        } else {
            setTransactions([])
        }
    }, [order?.transaction])

    const onSubmit = async data => {
        console.log(form.watch('order_id'))
        console.log(data)
        try {
            data.products = data.products?.map(
                ({ id, price, returned_quantity, number, discount, quantity, main_discount }) => ({ id, price, returned_quantity, number, discount, quantity, main_discount })
            ) || []

            setLoaded(false)

            if (data.discount === undefined) {
                data.discount = form.watch('discount')
            }
            if (data.main_discount === undefined) {
                data.main_discount = form.watch('discount')
            }
            if (data.status === undefined) {
                data.status = form.watch('status')
            }
            if (data.order_id === null) {
                data.order_id = form.watch('order_id')
            }

            if (data.discount_percentage === undefined) {
                data.discount_percentage = form.watch('discount_percentage')
            }
            await updateOrder(data)
            setLoaded(true)
            toast.success('Return Order Updated')
            setTimeout(() => {
                window.location.reload()
            }, 1000)

        } catch (e) {
            toast.error(e?.response?.data?.message)
        }
    }

    const handleMigration = async () => {
        try {
            const formData = form.getValues()
            const preparedData = {
                ...formData,
                products: formData.products?.map(p => ({
                    id: p.id,
                    price: p.price,
                    quantity: p.quantity,
                    discount: p.discount,
                    number: p.number
                })) || []
            }

            const result = await submitMigrate(preparedData)
            toast.success('Migration successful')

            setTimeout(() => {
                window.location.reload()
            }, 1000)
        } catch (error) {
            console.error('Migration error:', error)
            toast.error(error.response?.data?.message || 'Migration failed')

            setTimeout(() => {
                window.location.reload()
            }, 1000)
        }
    }

    const onSubmitWithStatus = async data => {
        try {
            data.products = data.products?.map(
                ({  id, price, returned_quantity, number, discount, quantity, main_discount }) => ({  id, price, returned_quantity, number, discount, quantity, main_discount })
            ) || []

            if (data.discount === undefined) {
                data.discount = form.watch('discount')
            }
            if (data.main_discount === undefined) {
                data.main_discount = form.watch('discount')
            }
            if (data.status === undefined) {
                data.status = form.watch('status')
            }
            if (data.order_id === null) {
                data.order_id = form.watch('order_id')
            }

            if (data.discount_percentage === undefined) {
                data.discount_percentage = form.watch('discount_percentage')
            }
            await submitWithStatus(data)
            toast.success('Return Order Updated')
            setTimeout(() => {
                window.location.reload()
            }, 1000)

        } catch (e) {
            toast.error(e?.response?.data?.message)
        }
    }

    // Add handleCompleteWithData for return orders
    const handleCompleteWithData = async (completionData) => {
        try {
            // Calculate existing refunds total
            const existingRefundsTotal = transactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0)

            // Calculate remaining refund balance
            const returnOrderTotal = calculations?.total || order?.total || 0
            const remainingBalance = returnOrderTotal - existingRefundsTotal

            // Validate that the completion amount doesn't exceed remaining balance
            const completionAmount = parseFloat(completionData.amount)
            if (completionAmount > remainingBalance.toFixed(3)) {
                toast.error(`Completion amount (${completionAmount.toFixed(3)}) exceeds remaining refund balance (${remainingBalance.toFixed(3)})`)
                return
            }

            // Get current form values
            const formData = form.getValues()

            // Prepare complete data with form data + completion details
            const submitData = {
                ...formData,
                status: 'COMPLETED',
                payment_method: completionData.payment_method,
                amount: completionAmount,
                shipping_amount: completionData.shipping ? parseFloat(completionData.shipping) : 0,
                commission: completionData.commission ? parseFloat(completionData.commission) : 0
            }

            // Process products data
            submitData.products = submitData.products?.map(
                ({ id, price, returned_quantity, number, discount, quantity, main_discount }) => ({ id, price, returned_quantity, number, discount, quantity, main_discount })
            ) || []

            // Handle discount data
            if (submitData.discount === undefined) {
                submitData.discount = form.watch('discount')
            }

            if (submitData.discount_percentage === undefined) {
                submitData.discount_percentage = form.watch('discount_percentage')
            }

            await submitWithStatus(submitData)
            toast.success('Return Order Updated')
            setTimeout(() => {
                window.location.reload()
            }, 1000)

        } catch (e) {
            toast.error(e.response?.data?.message)
        }
    }

    useEffect(() => {
        if (!loaded && order) {
            setLoaded(true)
            for (const field of fields) {
                form.setValue(field, order[field])
            }
            form.setValue('products', order?.products)
            form.setValue('discount', discount)
        }
        const completed = order?.status === 'COMPLETED'
        const migrated = order?.is_migrated
        setIsCompleted(completed)
        setIsMigrated(migrated)
    }, [order, loaded])

    return (
        <Form onSubmit={form.handleSubmit(onSubmit)}>
            <Row>
                <Col md={9} sm={12}>
                    <OrderMain order={order} form={form} isCompleted={isCompleted} isMigrated={isMigrated} calculations={calculations} setCalculations={setCalculations}/>
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
                    { (ability.can('read', 'order_completed_update_status') || ability.can('read', 'order_deleted_update_status') || ability.can('read', 'order_returned_update_status') || (order && (order?.status !== 'COMPLETED' && order?.status !== 'CANCELED'))) &&
                    <OrderStatus
                        updateWithStatus={form.handleSubmit(onSubmitWithStatus)}
                        submitWithStatus={form.handleSubmit(onSubmitWithStatus)}
                        updateStatus={updateStatus}
                        form={form}
                        order={order}
                        isMigrated={isMigrated}
                        onCompleteWithData={handleCompleteWithData}
                        calculations={calculations}
                        transactions={transactions}
                    />
                    }

                    {/* Add Return Order Transaction Component */}
                    <ReturnOrderTransaction
                        form={form}
                        order={order}
                        calculations={calculations}
                        transactions={transactions}
                        setTransactions={setTransactions}
                    />

                    {
                        (canMigrateOrder && (order?.status !== 'DRAFT')) &&
                        <OrderToFatora
                            onMigrate={handleMigration}
                            order={order}
                        />
                    }
                </Col>
            </Row>
        </Form>
    )
}