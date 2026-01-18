import { Card, CardBody, Button, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, Table, Badge } from 'reactstrap'
import Select from 'react-select'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { confirmDelete } from '@components/sweetalert'
import { api } from '@data/use-payment-method'
import ability from "../../../configs/acl/ability"
import {Link} from "react-router-dom"
import {Edit, Printer, Trash} from "react-feather"
import { api as transactionApi } from '@data/use-transaction'

const OrderTransaction = ({form, order, calculations, transactions, setTransactions }) => {
    const [paymentMethods, setPaymentMethods] = useState([])
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState(null)
    const [newPaymentData, setNewPaymentData] = useState({
        payment_method: '',
        amount: '',
        commission: ''
    })
    const [editPaymentData, setEditPaymentData] = useState({
        payment_method: '',
        amount: '',
        commission: ''
    })
    const [isCommissionManual, setIsCommissionManual] = useState(false)
    const [isEditCommissionManual, setIsEditCommissionManual] = useState(false)

    const shippingFreeForAmount = form.watch('shipping.free')
    const shippingCostMustDeletedForAmount = shippingFreeForAmount ? 0 : (order?.shipping?.cost || 0)
    // Calculate totals
    const orderTotalWithoutShipping = calculations?.total || order?.total || 0
    const orderTotal = calculations?.total - shippingCostMustDeletedForAmount || order?.total - shippingCostMustDeletedForAmount || 0
    const existingPaymentsTotal = transactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0)

    const remainingBalance = orderTotal - existingPaymentsTotal
    const maxPaymentAmount = Math.max(0, remainingBalance)

    // Calculate max amount for editing (remaining balance + current transaction amount)
    const getMaxEditAmount = () => {
        if (!editingTransaction) return 0
        const currentTransactionAmount = parseFloat(editingTransaction.amount.toFixed(3) || 0)
        const lastRemain = remainingBalance + currentTransactionAmount
        return lastRemain.toFixed(3)
    }
    const maxEditAmount = getMaxEditAmount()

    // Fetch payment methods
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

    // Commission calculation function
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

    // Auto-calculate commission when payment method or amount changes
    useEffect(() => {
        if (!isCommissionManual && newPaymentData.payment_method && newPaymentData.amount) {
            const calculatedCommission = calculateCommission(
                newPaymentData.payment_method,
                newPaymentData.amount
            )

            setNewPaymentData(prev => ({
                ...prev,
                commission: calculatedCommission.toFixed(3)
            }))
        }
    }, [newPaymentData.payment_method, newPaymentData.amount, paymentMethods, isCommissionManual])

    // Auto-calculate commission for edit modal when payment method or amount changes
    useEffect(() => {
        if (showEditModal && !isEditCommissionManual && editPaymentData.payment_method && editPaymentData.amount) {
            const calculatedCommission = calculateCommission(
                editPaymentData.payment_method,
                editPaymentData.amount
            )

            setEditPaymentData(prev => ({
                ...prev,
                commission: calculatedCommission.toFixed(3)
            }))
        }
    }, [editPaymentData.payment_method, editPaymentData.amount, paymentMethods, isEditCommissionManual, showEditModal])

    // Reset form when add modal opens
    useEffect(() => {
        if (showAddModal) {
            const cashPaymentMethod = paymentMethods.find(method => method.id === 1) || paymentMethods[0]

            setNewPaymentData({
                payment_method: cashPaymentMethod ? cashPaymentMethod.id.toString() : (paymentMethods[0]?.id.toString() || ''),
                amount: maxPaymentAmount > 0 ? maxPaymentAmount.toFixed(3) : '0',
                commission: '0'
            })
            setIsCommissionManual(false)

            // Calculate initial commission
            if (cashPaymentMethod && maxPaymentAmount > 0) {
                const initialCommission = calculateCommission(
                    cashPaymentMethod.id.toString(),
                    maxPaymentAmount.toString()
                )
                setNewPaymentData(prev => ({
                    ...prev,
                    commission: initialCommission.toFixed(3)
                }))
            }
        }
    }, [showAddModal, paymentMethods, maxPaymentAmount])

    const handlePaymentMethodChange = (paymentMethodId) => {
        setNewPaymentData(prev => ({
            ...prev,
            payment_method: paymentMethodId
        }))
        setIsCommissionManual(false)
    }

    const handleAmountChange = (amount) => {
        // Ensure amount doesn't exceed remaining balance
        const numericAmount = parseFloat(amount) || 0
        const finalAmount = Math.min(numericAmount, maxPaymentAmount)

        setNewPaymentData(prev => ({
            ...prev,
            amount: finalAmount.toString()
        }))
        setIsCommissionManual(false)
    }

    const handleCommissionChange = (commission) => {
        setNewPaymentData(prev => ({
            ...prev,
            commission
        }))
        setIsCommissionManual(true)
    }

    const recalculateCommission = () => {
        if (newPaymentData.payment_method && newPaymentData.amount) {
            const calculatedCommission = calculateCommission(
                newPaymentData.payment_method,
                newPaymentData.amount
            )

            setNewPaymentData(prev => ({
                ...prev,
                commission: calculatedCommission.toFixed(3)
            }))
            setIsCommissionManual(false)
        }
    }

    const handleAddPayment = async () => {
        if (!newPaymentData.payment_method || !newPaymentData.amount) {
            toast.error('Payment method and amount are required')
            return
        }

        if (parseFloat(newPaymentData.amount) <= 0) {
            toast.error('Amount must be greater than 0')
            return
        }

        try {
            const newTransaction = await transactionApi.create({
                order_id: order.id,
                payment_method_id: newPaymentData.payment_method,
                amount: parseFloat(newPaymentData.amount),
                commission: parseFloat(newPaymentData.commission || 0)
            })

            // Use setTransactions from props
            setTransactions(prev => [...prev, newTransaction])
            setShowAddModal(false)
            toast.success('Payment added successfully')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add payment')
        }
    }

    const handleDeletePayment = async (transactionId) => {
        confirmDelete(async () => {
            try {
                await transactionApi.delete(transactionId)

                // Use setTransactions from props
                setTransactions(prev => prev.filter(t => t.id !== transactionId))
                toast.success('Payment deleted successfully')
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete payment')
            }
        })
    }

    // Edit transaction functions
    const handleEditClick = (transaction) => {
        setEditingTransaction(transaction)
        setEditPaymentData({
            payment_method: transaction.payment_method_id?.toString() || '',
            amount: transaction.amount?.toString() || '',
            commission: transaction.commission?.toString() || '0'
        })
        setIsEditCommissionManual(false)
        setShowEditModal(true)
    }

    const handleEditPaymentMethodChange = (paymentMethodId) => {
        setEditPaymentData(prev => ({
            ...prev,
            payment_method: paymentMethodId
        }))
        setIsEditCommissionManual(false)
    }

    const handleEditAmountChange = (amount) => {
        // Ensure amount doesn't exceed the maximum allowed for editing
        const numericAmount = parseFloat(amount).toFixed(3) || 0
        const finalAmount = Math.min(numericAmount, maxEditAmount)

        setEditPaymentData(prev => ({
            ...prev,
            amount: finalAmount
        }))
        setIsEditCommissionManual(false)
    }

    const handleEditCommissionChange = (commission) => {
        setEditPaymentData(prev => ({
            ...prev,
            commission
        }))
        setIsEditCommissionManual(true)
    }

    const recalculateEditCommission = () => {
        if (editPaymentData.payment_method && editPaymentData.amount) {
            const calculatedCommission = calculateCommission(
                editPaymentData.payment_method,
                editPaymentData.amount
            )

            setEditPaymentData(prev => ({
                ...prev,
                commission: calculatedCommission.toFixed(3)
            }))
            setIsEditCommissionManual(false)
        }
    }

    const handleUpdatePayment = async () => {
        if (!editPaymentData.payment_method || !editPaymentData.amount) {
            toast.error('Payment method and amount are required')
            return
        }

        if (parseFloat(editPaymentData.amount) <= 0) {
            toast.error('Amount must be greater than 0')
            return
        }

        // Calculate what the new total would be after this update
        const currentTransactionAmount = parseFloat(editingTransaction.amount || 0)
        const newTransactionAmount = parseFloat(editPaymentData.amount)
        const amountDifference = newTransactionAmount - currentTransactionAmount

        // Check if the update would exceed the order total
        if (existingPaymentsTotal + amountDifference > orderTotal) {
            toast.error(`This update would exceed the order total. Maximum allowed increase: ${(orderTotal - existingPaymentsTotal).toFixed(3)}`)
            return
        }

        try {
            const updatedTransaction = await transactionApi.update(editingTransaction.id, {
                payment_method_id: editPaymentData.payment_method,
                amount: newTransactionAmount,
                commission: parseFloat(editPaymentData.commission || 0)
            })

            // Use setTransactions from props
            setTransactions(prev => prev.map(t => (t.id === editingTransaction.id ? updatedTransaction : t)
            ))

            setShowEditModal(false)
            setEditingTransaction(null)
            toast.success('Payment updated successfully')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update payment')
        }
    }

    const getPaymentMethodName = (paymentMethodId) => {

        // First try to find in paymentMethods array
        const method = paymentMethods.find(m => m.id.toString() === paymentMethodId?.toString())
        if (method) {

            return method.name
        }

        // If not found, check if the transaction already has paymentMethod property
        // This handles the case where backend already provides the name
        const transaction = transactions.find(t => t.payment_method_id?.toString() === paymentMethodId?.toString())
        if (transaction?.paymentMethod) {
            return transaction.paymentMethod
        }

        return 'Unknown'
    }


    return (
        <Card className='invoice-action-wrapper'>
            <CardBody className={'p-1'}>
                {/* Summary Section */}
                <div className="mb-3 p-1 pt-2 pb-2 bg-light rounded">
                    <div className="row text-center">
                        <div className="col-4" style={{paddingLeft:'0.5rem', paddingRight:'0.5rem'}}>
                            <h6 className="mb-1" style={{fontSize:12}}>Total</h6>
                            <h4 className="mb-0 text-primary"  style={{fontSize:14}}>{orderTotal}</h4>
                        </div>
                        <div className="col-4" style={{paddingLeft:'0.5rem', paddingRight:'0.5rem'}}>
                            <h6 className="mb-1" style={{fontSize:12}}>Paid</h6>
                            <h4 className="mb-0 text-success" style={{fontSize:14}}>{existingPaymentsTotal?.toFixed(2)}</h4>
                        </div>
                        <div className="col-4" style={{paddingLeft:'0.5rem', paddingRight:'0.5rem'}}>
                            <h6 className="mb-1" style={{fontSize:12}}>Remaining</h6>
                            <h4 className={`mb-0 ${remainingBalance > 0 ? 'text-warning' : 'text-success'}`} style={{fontSize:14}}>
                                {remainingBalance?.toFixed(2)}
                            </h4>
                        </div>
                    </div>
                </div>

                {/* Add Payment Button */}
                <div style={{width:'50%'}}>
                    <Button.Ripple
                        color='dark'
                        block
                        size={'sm'}
                        className={'pt-1 pb-1'}
                        onClick={() => setShowAddModal(true)}
                        disabled={maxPaymentAmount <= 0}
                    >
                        Add Payment
                    </Button.Ripple>
                </div>

                {/* Transactions Table */}
                {transactions.length > 0 && (
                    <div className="mt-3">
                        <h6>Payment History</h6>
                        <Table striped>
                            <thead>
                            <tr>
                                <th style={{padding:'10px 6px'}}>Method</th>
                                <th style={{padding:'10px 4px'}}>Amount</th>
                                <th style={{padding:'10px 4px'}}>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {transactions.map(transaction => {
                                return (
                                    <tr key={transaction.id}>
                                        <td style={{padding:'10px 6px'}}>
                                            {getPaymentMethodName(transaction.payment_method_id)}
                                        </td>
                                        <td style={{padding:'10px 4px'}}>
                                            <strong>
                                                {transaction.amount ? parseFloat(transaction.amount).toFixed(3) : '0.000'
                                                }
                                            </strong>
                                        </td>
                                        <td style={{padding:'10px 4px'}}>
                                            <div className='column-action d-flex align-items-start'>
                                                <Link to={`/receipt/create/${transaction.id}`} target='_blank'>
                                                    <Printer size={17} />
                                                </Link>
                                                <Link to='#' onClick={(e) => {
                                                    e.preventDefault()
                                                    handleEditClick(transaction)
                                                }} className='ml-1 mr-1'>
                                                    <Edit size={17} />
                                                </Link>
                                                <Link to='#'>
                                                    <Trash size={17} onClick={() => handleDeletePayment(transaction.id)}/>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </Table>
                    </div>
                )}

                {/* No transactions message */}
                {transactions.length === 0 && (
                    <div className="text-center mt-3 p-3 border rounded">
                        <p className="mb-0 text-muted">No payments recorded yet</p>
                    </div>
                )}

                {/* Add Payment Modal */}
                <Modal isOpen={showAddModal} toggle={() => setShowAddModal(false)}>
                    <ModalHeader toggle={() => setShowAddModal(false)}>
                        Add New Payment
                    </ModalHeader>
                    <ModalBody>
                        <div className="alert alert-info">
                            <strong>Remaining Balance:</strong> {remainingBalance.toFixed(3)}<br />
                            <strong>Maximum Payment:</strong> {maxPaymentAmount.toFixed(3)}
                        </div>

                        <FormGroup>
                            <Label for="payment_method">Payment Method *</Label>
                            <Input
                                type="select"
                                id="payment_method"
                                value={newPaymentData.payment_method}
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
                            <Label for="amount">Amount *</Label>
                            <Input
                                type="number"
                                id="amount"
                                step="0.001"
                                min="0"
                                max={maxPaymentAmount}
                                value={newPaymentData.amount}
                                onChange={(e) => handleAmountChange(e.target.value)}
                                required
                            />
                            <small className="text-muted">
                                Maximum allowed: {maxPaymentAmount.toFixed(3)}
                            </small>
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
                                    value={newPaymentData.commission}
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
                                {isCommissionManual ? "Commission is manually set. Click 'Auto' to recalculate." : "Commission is auto-calculated based on payment method and amount."
                                }
                            </small>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => setShowAddModal(false)}>
                            Cancel
                        </Button>
                        <Button color="primary" onClick={handleAddPayment}>
                            Add Payment
                        </Button>
                    </ModalFooter>
                </Modal>

                {/* Edit Payment Modal */}
                <Modal isOpen={showEditModal} toggle={() => setShowEditModal(false)}>
                    <ModalHeader toggle={() => setShowEditModal(false)}>
                        Edit Payment
                    </ModalHeader>
                    <ModalBody>
                        {editingTransaction && (
                            <>
                                <div className="alert alert-info">
                                    <strong>Order Total:</strong> {orderTotal}<br />
                                    <strong>Current Paid Total:</strong> {existingPaymentsTotal.toFixed(3)}<br />
                                    <strong>Remaining Balance:</strong> {remainingBalance.toFixed(3)}<br />
                                    <strong>Original Transaction Amount:</strong> {parseFloat(editingTransaction.amount).toFixed(3)}<br />
                                    <strong>Maximum Allowed for this Transaction:</strong> {maxEditAmount}
                                </div>

                                <FormGroup>
                                    <Label for="edit_payment_method">Payment Method *</Label>
                                    <Input
                                        type="select"
                                        id="edit_payment_method"
                                        value={editPaymentData.payment_method}
                                        onChange={(e) => handleEditPaymentMethodChange(e.target.value)}
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
                                    <Label for="edit_amount">Amount *</Label>
                                    <Input
                                        type="number"
                                        id="edit_amount"
                                        step="0.001"
                                        min="0"
                                        max={maxEditAmount}
                                        value={editPaymentData.amount}
                                        onChange={(e) => handleEditAmountChange(e.target.value)}
                                        required
                                    />
                                    <small className="text-muted">
                                        Maximum allowed: {maxEditAmount} (Remaining balance + current transaction amount)
                                    </small>
                                </FormGroup>

                                <FormGroup>
                                    <Label for="edit_commission">
                                        Commission {isEditCommissionManual && <span className="text-warning">(Manual)</span>}
                                    </Label>
                                    <div className="d-flex">
                                        <Input
                                            type="number"
                                            id="edit_commission"
                                            step="0.001"
                                            min="0"
                                            value={editPaymentData.commission}
                                            onChange={(e) => handleEditCommissionChange(e.target.value)}
                                            style={{
                                                borderColor: isEditCommissionManual ? '#ffc107' : ''
                                            }}
                                        />
                                        {isEditCommissionManual && (
                                            <Button
                                                color="secondary"
                                                outline
                                                size="sm"
                                                className="ms-2"
                                                onClick={recalculateEditCommission}
                                                title="Recalculate commission based on payment method and amount"
                                            >
                                                Auto
                                            </Button>
                                        )}
                                    </div>
                                    <small className="text-muted">
                                        {isEditCommissionManual ? "Commission is manually set. Click 'Auto' to recalculate." : "Commission is auto-calculated based on payment method and amount."
                                        }
                                    </small>
                                </FormGroup>
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => setShowEditModal(false)}>
                            Cancel
                        </Button>
                        <Button color="primary" onClick={handleUpdatePayment}>
                            Update Payment
                        </Button>
                    </ModalFooter>
                </Modal>
            </CardBody>
        </Card>
    )
}

export default OrderTransaction