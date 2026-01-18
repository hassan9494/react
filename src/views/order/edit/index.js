import { Row, Col, Form } from 'reactstrap'
import '@styles/base/pages/app-invoice.scss'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import { Controller, useForm } from 'react-hook-form'
import { useOrder } from '@data/use-order'
import { toast } from 'react-toastify'

import OrderMain from '../components/OrderMain'
import OrderStatus from '../components/OrderStatus'
import OrderToFatora from '../components/OrderToFatora'
import OrderOptions from '../components/OrderOptions'
import ShippingStatus from '../components/ShippingStatus'
import OrderAttachments from '../components/OrderAttachments'
import ability from "../../../configs/acl/ability"
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
    'discount_percentage',
    'extra_items',
    'user_id',
    'tax_exempt_id',
    'cashier_id',
    'attachments',
    'status',
    'customer_identity_number',
    'identity_number_type',
    'pending',
    'is_migrated',
    'payment_method',
    'amount',
    'shipping_amount',
    'commission'
]

// Define which fields should be arrays
const arrayFields = ['products', 'attachments', 'extra_items']

export default function () {

    const { id } = useParams()
    const {
        data: order,
        update: updateOrder,
        updateStatus,
        submitWithStatus,
        submitMigrate
    } = useOrder(id)
    const [xmlModal, setXmlModal] = useState({
        show: false,
        content: ''
    })
    const canMigrateOrder = ability.can('read', 'migrate_completed_order')
    const [calculations, setCalculations] = useState(0)

    // Add transactions state
    const [transactions, setTransactions] = useState([])

    // Initialize form with proper default values
    const form = useForm({
        defaultValues: {
            payment_method: '',
            amount: 0,
            shipping_amount: 0,
            commission: 0,
            customer: {},
            notes: '',
            invoice_notes: '',
            products: [],
            shipping: {},
            city_id: null,
            coupon_id: null,
            shipping_provider_id: null,
            options: {},
            discount: 0,
            discount_percentage: 0,
            extra_items: [], // Make sure this is an array
            user_id: null,
            tax_exempt_id: null,
            cashier_id: null,
            attachments: [],
            status: null,
            customer_identity_number: '',
            identity_number_type: '',
            pending: false,
            is_migrated: false
        }
    })

    const [loaded, setLoaded] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)
    const [isMigrated, setIsMigrated] = useState(false)

    const user = JSON.parse(localStorage.getItem('user'))

    // Fetch transactions when order changes
    useEffect(() => {
        if (order?.transaction && Array.isArray(order.transaction)) {
            console.log('Setting transactions from order:', order.transaction)
            setTransactions(order.transaction)
        } else {
            setTransactions([])
        }
    }, [order?.transaction])

    const onSubmit = async data => {
        try {
            data.products = data.products?.map(
                ({ id, price, quantity, number, discount }) => ({ id, price, quantity, number, discount })
            ) || []
            data.status = null
            setLoaded(false)
            if (data.customer.name === undefined) {
                data.customer = form.watch('customer')
            }

            if (data.discount === undefined) {
                data.discount = form.watch('discount')
            }

            if (data.discount_percentage === undefined) {
                data.discount_percentage = form.watch('discount_percentage')
            }
            await updateOrder(data)
            setLoaded(true)
            toast.success('Order Updated')
            setTimeout(() => {
                window.location.reload()
            }, 1000)

        } catch (e) {
            toast.error(e?.response?.data?.message)
        }
    }

    const onSubmitWithStatus = async data => {
        try {
            data.products = data.products?.map(
                ({ id, price, quantity, number, discount }) => ({ id, price, quantity, number, discount })
            ) || []

            if (data.customer.name === undefined) {
                data.customer = form.watch('customer')
            }

            if (data.discount === undefined) {
                data.discount = form.watch('discount')
            }

            if (data.discount_percentage === undefined) {
                data.discount_percentage = form.watch('discount_percentage')
            }

            await submitWithStatus(data)
            toast.success('Order Updated')
            setTimeout(() => {
                window.location.reload()
            }, 1000)

        } catch (e) {
            toast.error(e?.response?.data?.message)
        }
    }

    // Update handleCompleteWithData to consider existing transactions
    const handleCompleteWithData = async (completionData) => {
        try {
            // Calculate existing payments total
            const existingPaymentsTotal = transactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0
            )

            // Calculate remaining balance
            const orderTotal = calculations?.total || order?.total || 0
            const remainingBalance = orderTotal - existingPaymentsTotal

            // Validate that the completion amount doesn't exceed remaining balance
            const completionAmount = parseFloat(completionData.amount)
            if (completionAmount > remainingBalance.toFixed(3)) {
                toast.error(`Completion amount (${completionAmount.toFixed(3)}) exceeds remaining balance (${remainingBalance.toFixed(3)})`)
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
                ({ id, price, quantity, number, discount }) => ({ id, price, quantity, number, discount })
            ) || []

            // Handle customer data
            if (submitData.customer?.name === undefined) {
                submitData.customer = form.watch('customer')
            }

            if (submitData.discount === undefined) {
                submitData.discount = form.watch('discount')
            }

            if (submitData.discount_percentage === undefined) {
                submitData.discount_percentage = form.watch('discount_percentage')
            }

            await submitWithStatus(submitData)
            toast.success('Order Updated')
            setTimeout(() => {
                window.location.reload()
            }, 1000)

        } catch (e) {
            toast.error(e.response?.data?.message)
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
            console.log('Migration result:', result)
            setTimeout(() => {
                window.location.reload()
            }, 1000)
            toast.success('Migration successful')
        } catch (error) {
            console.error('Migration error:', error)
            toast.error(error.response?.data?.message || 'Migration failed')
        }
    }

    const onSaveChanges = async data => {
        try {
            data.products = data.products?.map(
                ({ id, price, quantity, number, discount }) => ({ id, price, quantity, number, discount })
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
                let value = order[field]

                // Handle array fields specifically
                if (arrayFields.includes(field)) {
                    // If the value is null, undefined, or not an array, set to empty array
                    if (!value || !Array.isArray(value)) {
                        value = []
                    }
                    form.setValue(field, value)
                    // eslint-disable-next-line brace-style
                }
                // Handle object fields
                else if (field === 'customer' || field === 'shipping' || field === 'options') {
                    // If the value is null or undefined, set to empty object
                    if (!value || typeof value !== 'object') {
                        value = {}
                    }
                    form.setValue(field, value)
                    // eslint-disable-next-line brace-style
                }
                // Handle number fields
                else if (field === 'amount' || field === 'shipping_amount' || field === 'commission' ||
                    field === 'discount' || field === 'discount_percentage') {
                    // If the value is null or undefined, set to 0
                    if (value === null || value === undefined) {
                        value = 0
                    }
                    form.setValue(field, value)
                    // eslint-disable-next-line brace-style
                }
                // Handle other fields
                else {
                    // If the value is null or undefined, set to empty string
                    form.setValue(field, value || '')
                }
            }
            form.setValue('has_shipping', !!order.shipping?.address)

            // Set default values for the new completion fields if they don't exist in order
            if (!order.payment_method) form.setValue('payment_method', '')
            if (order.amount === null || order.amount === undefined) form.setValue('amount', 0)
            if (order.shipping_amount === null || order.shipping_amount === undefined) form.setValue('shipping_amount', 0)
            if (order.commission === null || order.commission === undefined) form.setValue('commission', 0)
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
                    <OrderMain calculations={calculations} setCalculations={setCalculations} order={order} form={form} isCompleted={isCompleted} isMigrated={isMigrated}/>
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
                        transactions={transactions} // Add transactions prop
                    />
                    }

                    <OrderTransaction
                        updateWithStatus={form.handleSubmit(onSubmitWithStatus)}
                        submitWithStatus={form.handleSubmit(onSubmitWithStatus)}
                        updateStatus={updateStatus}
                        form={form}
                        order={order}
                        isMigrated={isMigrated}
                        onCompleteWithData={handleCompleteWithData}
                        calculations={calculations}
                        transactions={transactions} // Add transactions prop
                        setTransactions={setTransactions} // Add setTransactions prop
                    />

                    <ShippingStatus form={form} order={order} isCompleted={isCompleted} isMigrated={isMigrated}/>
                    <OrderOptions form={form} order={order} isCompleted={isCompleted} isMigrated={isMigrated}/>

                    {
                        (canMigrateOrder && (order?.options.taxed && order?.status !== 'PENDING')) &&
                        <OrderToFatora
                            onMigrate={handleMigration}
                            order={order}
                        />
                    }

                    {/* XML Modal */}
                    {xmlModal.show && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1000
                        }}>
                            <div style={{
                                background: 'white',
                                padding: '20px',
                                borderRadius: '8px',
                                maxWidth: '90%',
                                maxHeight: '90vh',
                                overflow: 'auto'
                            }}>
                                <h2>Invoice XML</h2>
                                <div style={{ margin: '15px 0', display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(xmlModal.content)
                                                .then(() => toast.success('XML copied!'))
                                                .catch(() => toast.error('Copy failed'))
                                        }}
                                    >
                                        Copy XML
                                    </button>
                                    <button
                                        onClick={() => window.print()}
                                    >
                                        Print
                                    </button>
                                    <button
                                        onClick={() => setXmlModal({ show: false, content: '' })}
                                    >
                                        Close
                                    </button>
                                </div>
                                <pre style={{
                                    background: '#f5f5f5',
                                    padding: '15px',
                                    borderRadius: '5px',
                                    border: '1px solid #ddd',
                                    overflow: 'auto',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {xmlModal.content}
                                </pre>
                            </div>
                        </div>
                    )}

                </Col>
            </Row>
        </Form>
    )
}