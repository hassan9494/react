import { Card, CardBody, Button, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input } from 'reactstrap'
import Select from 'react-select'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { confirm, confirmDelete } from '@components/sweetalert'
import { Controller } from "react-hook-form"
import { api } from '@data/use-payment-method'

const OrderStatus = ({ form, updateWithStatus, updateStatus, order, isMigrated, onCompleteWithData, calculations, transactions }) => {
    const user = JSON.parse(localStorage.getItem('user'))
    const [status, setStatus] = useState(null)
    const [showCompletionModal, setShowCompletionModal] = useState(false)
    const [completionData, setCompletionData] = useState({
        payment_method: '',
        amount: '',
        shipping: '',
        commission: ''
    })
    const [paymentMethods, setPaymentMethods] = useState([])
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)
    const [isCommissionManual, setIsCommissionManual] = useState(false)

    // Calculate totals considering existing transactions
    const orderTotal = calculations?.total || order?.total || 0
    const existingPaymentsTotal = transactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0
    )
    const shippingFreeForAmount = form.watch('shipping.free')
    const shippingCostForAmount = !shippingFreeForAmount ? 0 : (order?.shipping?.cost || 0)
    const shippingCostMustDeletedForAmount = shippingFreeForAmount ? 0 : (order?.shipping?.cost || 0)
    const remainingBalance = orderTotal - existingPaymentsTotal - shippingCostMustDeletedForAmount
    const maxCompletionAmount = Math.max(0, remainingBalance.toFixed(3))

    // Fetch payment methods from backend
    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                const response = await api.index()
                console.log('Payment methods:', response)
                setPaymentMethods(response || [])
            } catch (error) {
                console.error('Failed to fetch payment methods:', error)
                toast.error('Failed to load payment methods')
            }
        }
        fetchPaymentMethods()
    }, [])

    // Calculate commission based on payment method type and amount
    const calculateCommission = (paymentMethodId, amount) => {
        if (!paymentMethodId || !amount) return 0

        const paymentMethod = paymentMethods.find(method => method.id.toString() === paymentMethodId.toString())
        if (!paymentMethod) return 0

        const numericAmount = parseFloat(amount)
        if (isNaN(numericAmount)) return 0

        console.log('Calculating commission for:', {
            paymentMethod,
            amount: numericAmount,
            type: paymentMethod.commission_type
        })

        switch (paymentMethod.commission_type) {
            case 'Fixed':
                // For fixed type, use the fixed commission value
                return parseFloat(paymentMethod.commission) || 0

            case 'Percent':
                // For percent type, calculate percentage of amount
                const percent = parseFloat(paymentMethod.commission) || 0
                return (numericAmount * percent) / 100

            case 'Range':
                // For range type, find the matching range
                if (!paymentMethod.commission_range) return 0

                try {
                    const ranges = typeof paymentMethod.commission_range === 'string' ? JSON.parse(paymentMethod.commission_range) : paymentMethod.commission_range

                    if (!Array.isArray(ranges)) return 0

                    // Find the range where amount falls between from and to
                    const matchingRange = ranges.find(range => {
                        const from = parseFloat(range.from) || 0
                        const to = parseFloat(range.to) || Infinity
                        return numericAmount >= from && numericAmount <= to
                    })

                    return matchingRange ? parseFloat(matchingRange.commission) || 0 : 0
                } catch (error) {
                    console.error('Error parsing commission_range:', error)
                    return 0
                }

            default:
                return 0
        }
    }

    // Update commission when payment method or amount changes (only if not manually set)
    useEffect(() => {
        if (!isCommissionManual && completionData.payment_method && completionData.amount) {
            const calculatedCommission = calculateCommission(
                completionData.payment_method,
                completionData.amount
            )

            setCompletionData(prev => ({
                ...prev,
                commission: calculatedCommission.toFixed(3)
            }))
        }
    }, [completionData.payment_method, completionData.amount, paymentMethods, isCommissionManual])

    // Set default values when modal opens or when order changes
    useEffect(() => {
        if (showCompletionModal && order) {
            // Find Cash payment method (ID: 1) or use first available
            const cashPaymentMethod = paymentMethods.find(method => method.id === 1) || paymentMethods[0]

            // Calculate shipping cost
            const shippingFree = form.watch('shipping.free')
            const shippingCost = !shippingFree ? 0 : (order.shipping?.cost || 0)

            const initialData = {
                payment_method: cashPaymentMethod ? cashPaymentMethod.id.toString() : (paymentMethods[0]?.id.toString() || ''),
                amount: maxCompletionAmount > 0 ? maxCompletionAmount.toFixed(3) : '0',
                shipping: shippingCost.toString(),
                commission: '0'
            }

            setCompletionData(initialData)
            setIsCommissionManual(false)

            // Calculate initial commission
            if (cashPaymentMethod && maxCompletionAmount > 0) {
                const initialCommission = calculateCommission(
                    cashPaymentMethod.id.toString(),
                    maxCompletionAmount.toString()
                )
                setCompletionData(prev => ({
                    ...prev,
                    commission: initialCommission.toFixed(3)
                }))
            }
        }
    }, [showCompletionModal, order, paymentMethods, maxCompletionAmount])

    useEffect(() => {
        if (!status) setStatus(order?.status)
    }, [order])

    const list = [
        {
            label: 'New Order',
            value: 'PENDING'
        },
        {
            label: 'Processing',
            value: 'PROCESSING'
        },
        {
            label: 'Completed',
            value: 'COMPLETED'
        }
    ]

    const handleStatusChange = (selectedStatus) => {
        form.setValue('status', selectedStatus?.value || null)
        setStatus(selectedStatus?.value)
    }

    const handlePaymentMethodChange = (paymentMethodId) => {
        const paymentMethod = paymentMethods.find(method => method.id.toString() === paymentMethodId.toString())
        setSelectedPaymentMethod(paymentMethod)

        setCompletionData(prev => ({
            ...prev,
            payment_method: paymentMethodId
        }))

        // Reset manual flag when payment method changes so commission auto-updates
        setIsCommissionManual(false)
    }

    const handleAmountChange = (amount) => {
        // Ensure amount doesn't exceed remaining balance
        const numericAmount = parseFloat(amount) || 0
        const finalAmount = Math.min(numericAmount, maxCompletionAmount)

        setCompletionData(prev => ({
            ...prev,
            amount: finalAmount.toString()
        }))

        // Reset manual flag when amount changes so commission auto-updates
        setIsCommissionManual(false)
    }

    const handleCommissionChange = (commission) => {
        setCompletionData(prev => ({
            ...prev,
            commission
        }))
        // Set manual flag when user manually changes commission
        setIsCommissionManual(true)
    }

    const recalculateCommission = () => {
        if (completionData.payment_method && completionData.amount) {
            const calculatedCommission = calculateCommission(
                completionData.payment_method,
                completionData.amount
            )

            setCompletionData(prev => ({
                ...prev,
                commission: calculatedCommission.toFixed(3)
            }))
            setIsCommissionManual(false)
        }
    }

    const onSubmit = async () => {
        if (status === 'COMPLETED') {
            setShowCompletionModal(true)
            return
        }

        confirm(async () => {
            try {
                await updateWithStatus({ status })
            } catch (e) {
                toast.error(e.response?.data?.message)
            }
        })
    }

    const handleCompleteOrder = async () => {
        if (!completionData.payment_method || !completionData.amount) {
            toast.error('Payment method and amount are required')
            return
        }

        if (parseFloat(completionData.amount) < 0) {
            toast.error('Amount must be greater than 0')
            return
        }
        console.log(parseFloat(completionData.amount))
        console.log(remainingBalance.toFixed(3))
        // Check if amount exceeds remaining balance
        if (parseFloat(completionData.amount) > remainingBalance.toFixed(3)) {
            toast.error(`Amount cannot exceed remaining balance of ${remainingBalance.toFixed(3)}`)
            return
        }

        try {
            await onCompleteWithData(completionData)
            setShowCompletionModal(false)
        } catch (e) {
            toast.error(e.response?.data?.message)
        }
    }

    const onCancel = async () => {
        confirmDelete(async () => {
            try {
                await updateStatus({ status: 'CANCELED' })
                toast.success('Success')
            } catch (e) {
                toast.error(e.response?.data?.message)
            }
        })
    }

    // Get current payment method details for display
    const getCurrentPaymentMethodDetails = () => {
        if (!completionData.payment_method) return null
        return paymentMethods.find(method => method.id.toString() === completionData.payment_method.toString())
    }

    const currentPaymentMethod = getCurrentPaymentMethodDetails()

    return (
        <Card className='invoice-action-wrapper'>
            <CardBody>
                <FormGroup>
                    <Controller
                        control={form.control}
                        defaultValue={null}
                        name="status"
                        render={({ onChange, value, name, ref }) => (
                            <Select
                                className='react-select'
                                classNamePrefix='select'
                                value={list.filter(item => item.value === (value || order?.status))}
                                options={list}
                                onChange={val => {
                                    onChange(val?.value || null)
                                    handleStatusChange(val)
                                }}
                            />
                        )}
                    />
                </FormGroup>
                <Button.Ripple color='primary' block onClick={onSubmit}>
                    Update Status
                </Button.Ripple>
                {
                    order?.status === 'PENDING' && !isMigrated && !order?.options?.taxed &&
                    <Button.Ripple color='danger' outline className='mt-1' block onClick={onCancel}>
                        Delete Order
                    </Button.Ripple>
                }

                {/* Completion Confirmation Modal */}
                <Modal isOpen={showCompletionModal} toggle={() => setShowCompletionModal(false)}>
                    <ModalHeader toggle={() => setShowCompletionModal(false)}>
                        Complete Order
                    </ModalHeader>
                    <ModalBody>
                        <div className="alert alert-info">
                            <strong>Order Total:</strong> {orderTotal}<br />
                            <strong>Existing Payments:</strong> {existingPaymentsTotal.toFixed(3)}<br />
                            <strong>Remaining Balance:</strong> {remainingBalance.toFixed(3)}<br />
                            <strong>Maximum Payment Allowed:</strong> {maxCompletionAmount.toFixed(3)}
                        </div>

                        <p>Are you sure you want to mark this order as COMPLETED?</p>

                        <FormGroup>
                            <Label for="payment_method">Payment Method *</Label>
                            <Input
                                type="select"
                                id="payment_method"
                                value={completionData.payment_method}
                                onChange={(e) => handlePaymentMethodChange(e.target.value)}
                                required
                            >
                                <option value="">Select Payment Method</option>
                                {paymentMethods.map(method => (
                                    <option key={method.id} value={method.id}>
                                        {method.name} ({method.commission_type})
                                    </option>
                                ))}
                            </Input>
                            {currentPaymentMethod && (
                                <small className="text-muted">
                                    Type: {currentPaymentMethod.commission_type}
                                    {currentPaymentMethod.commission_type === 'Fixed' && ` - ${currentPaymentMethod.commission} fixed`}
                                    {currentPaymentMethod.commission_type === 'Percent' && ` - ${currentPaymentMethod.commission}%`}
                                    {currentPaymentMethod.commission_type === 'Range' && ' - Based on amount ranges'}
                                </small>
                            )}
                        </FormGroup>

                        <FormGroup>
                            <Label for="amount">Amount *</Label>
                            <Input
                                type="number"
                                id="amount"
                                step="0.001"
                                min="0"
                                max={maxCompletionAmount}
                                value={completionData.amount}
                                onChange={(e) => handleAmountChange(e.target.value)}
                                required
                            />
                            <small className="text-muted">
                                Maximum allowed: {maxCompletionAmount.toFixed(3)} (Remaining balance after existing payments)
                            </small>
                        </FormGroup>

                        <FormGroup>
                            <Label for="shipping">Shipping</Label>
                            <Input
                                type="number"
                                id="shipping"
                                step="0.001"
                                min="0"
                                value={completionData.shipping}
                                onChange={(e) => setCompletionData(prev => ({
                                    ...prev,
                                    shipping: e.target.value
                                }))}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="commission">
                                Commission {isCommissionManual && <span className="text-warning">(Manual)</span>}
                            </Label>
                            <div className="d-flex">
                                <Input
                                    type="number"
                                    id="commission"
                                    step="0.001"
                                    min="0"
                                    value={completionData.commission}
                                    onChange={(e) => handleCommissionChange(e.target.value)}
                                    style={{
                                        borderColor: isCommissionManual ? '#ffc107' : ''
                                    }}
                                />
                                {isCommissionManual && (
                                    <Button
                                        color="secondary"
                                        outline
                                        size="sm"
                                        className="ms-2"
                                        onClick={recalculateCommission}
                                        title="Recalculate commission based on payment method and amount"
                                    >
                                        Auto
                                    </Button>
                                )}
                            </div>
                            <small className="text-muted">
                                {isCommissionManual ? "Commission is manually set. Click 'Auto' to recalculate based on payment method." : "Commission is auto-calculated based on payment method and amount."}
                            </small>
                        </FormGroup>

                        {/* Debug info for commission calculation */}
                        {currentPaymentMethod && completionData.amount && (
                            <div className="mt-2 p-2 border rounded" style={{ backgroundColor: '#e9ecef' }}>
                                <small>
                                    <strong>Commission Calculation:</strong><br />
                                    Payment Method: {currentPaymentMethod.name}<br />
                                    Type: {currentPaymentMethod.commission_type}<br />
                                    Amount: {completionData.amount}<br />
                                    {currentPaymentMethod.commission_type === 'Fixed' && `Fixed Commission: ${currentPaymentMethod.commission}`}
                                    {currentPaymentMethod.commission_type === 'Percent' && `Percentage: ${currentPaymentMethod.commission}%`}
                                    {currentPaymentMethod.commission_type === 'Range' && 'Commission based on matching range'}
                                    {isCommissionManual && <><br /><strong>Currently manually overridden</strong></>}
                                </small>
                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => setShowCompletionModal(false)}>
                            Cancel
                        </Button>
                        <Button color="primary" onClick={handleCompleteOrder}>
                            Yes, Complete Order
                        </Button>
                    </ModalFooter>
                </Modal>
            </CardBody>
        </Card>
    )
}

export default OrderStatus