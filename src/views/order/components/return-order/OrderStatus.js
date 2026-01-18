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
    const [isCommissionManual, setIsCommissionManual] = useState(false)

    // Calculate totals considering existing transactions - FIXED: handle undefined transactions
    const returnOrderTotal = calculations?.total || order?.total || 0
    const existingRefundsTotal = (transactions || []).reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0)
    console.log(returnOrderTotal)
    const remainingBalance = returnOrderTotal - existingRefundsTotal
    const maxCompletionAmount = Math.max(0, remainingBalance.toFixed(3))

    // Fetch payment methods from backend
    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                const response = await api.index()
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

        switch (paymentMethod.commission_type) {
            case 'Fixed':
                return parseFloat(paymentMethod.commission) || 0
            case 'Percent':
                const percent = parseFloat(paymentMethod.commission) || 0
                return (numericAmount * percent) / 100
            case 'Range':
                if (!paymentMethod.commission_range) return 0
                try {
                    const ranges = typeof paymentMethod.commission_range === 'string' ? JSON.parse(paymentMethod.commission_range) : paymentMethod.commission_range
                    if (!Array.isArray(ranges)) return 0
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

    // Set default values when modal opens
    useEffect(() => {
        if (showCompletionModal && order) {
            const cashPaymentMethod = paymentMethods.find(method => method.id === 1) || paymentMethods[0]
            const initialData = {
                payment_method: cashPaymentMethod ? cashPaymentMethod.id.toString() : (paymentMethods[0]?.id.toString() || ''),
                amount: maxCompletionAmount > 0 ? maxCompletionAmount.toFixed(3) : '0',
                shipping: '0',
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
            label: 'DRAFT',
            value: 'DRAFT'
        },
        {
            label: 'COMPLETED',
            value: 'COMPLETED'
        }
    ]

    const handleStatusChange = (selectedStatus) => {
        form.setValue('status', selectedStatus?.value || null)
        setStatus(selectedStatus?.value)
    }

    const onSubmit = async () => {
        console.log('Current status:', status)

        // Show completion modal when status is COMPLETED
        if (status === 'COMPLETED') {
            console.log('Showing completion modal')
            setShowCompletionModal(true)
            return
        }

        // For other statuses, use the normal confirmation
        confirm(async () => {
            try {
                await updateWithStatus({ status })
            } catch (e) {
                toast.error(e.response?.data?.message)
            }
        })
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

    const handleChangeStatus = (status) => {
        form.setValue('status', status?.value || 0)
        setStatus(status?.value)
    }

    // Handle completion modal functions
    const handlePaymentMethodChange = (paymentMethodId) => {
        setCompletionData(prev => ({
            ...prev,
            payment_method: paymentMethodId
        }))
        setIsCommissionManual(false)
    }

    const handleAmountChange = (amount) => {
        const numericAmount = parseFloat(amount) || 0
        const finalAmount = Math.min(numericAmount, maxCompletionAmount)
        setCompletionData(prev => ({
            ...prev,
            amount: finalAmount.toString()
        }))
        setIsCommissionManual(false)
    }

    const handleCommissionChange = (commission) => {
        setCompletionData(prev => ({
            ...prev,
            commission
        }))
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

    const handleCompleteOrder = async () => {
        if (!completionData.payment_method || !completionData.amount) {
            toast.error('Payment method and amount are required')
            return
        }

        if (parseFloat(completionData.amount) < 0) {
            toast.error('Amount must be greater than 0')
            return
        }

        if (parseFloat(completionData.amount) > remainingBalance.toFixed(3)) {
            toast.error(`Amount cannot exceed remaining refund balance of ${remainingBalance.toFixed(3)}`)
            return
        }

        try {
            await onCompleteWithData(completionData)
            setShowCompletionModal(false)
        } catch (e) {
            toast.error(e.response?.data?.message)
        }
    }

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
                                value={list.filter(list => list.value === (value || order?.status))}
                                options={list}
                                onChange={val => {
                                    onChange(val?.value || null)
                                    handleChangeStatus(val)
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
                        Complete Return Order
                    </ModalHeader>
                    <ModalBody>
                        <div className="alert alert-info">
                            <strong>Return Order Total:</strong> {returnOrderTotal}<br />
                            <strong>Existing Refunds:</strong> {existingRefundsTotal.toFixed(3)}<br />
                            <strong>Remaining Refund Balance:</strong> {remainingBalance.toFixed(3)}<br />
                            <strong>Maximum Refund Allowed:</strong> {maxCompletionAmount.toFixed(3)}
                        </div>

                        <p>Are you sure you want to mark this return order as COMPLETED?</p>

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
                        </FormGroup>

                        <FormGroup>
                            <Label for="amount">Refund Amount *</Label>
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
                                Maximum allowed: {maxCompletionAmount.toFixed(3)} (Remaining refund balance)
                            </small>
                        </FormGroup>

                        <FormGroup>
                            <Label for="shipping">Shipping Refund</Label>
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
                                {isCommissionManual ? "Commission is manually set. Click 'Auto' to recalculate." : "Commission is auto-calculated based on payment method and amount."}
                            </small>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => setShowCompletionModal(false)}>
                            Cancel
                        </Button>
                        <Button color="primary" onClick={handleCompleteOrder}>
                            Yes, Complete Return Order
                        </Button>
                    </ModalFooter>
                </Modal>
            </CardBody>
        </Card>
    )
}

export default OrderStatus