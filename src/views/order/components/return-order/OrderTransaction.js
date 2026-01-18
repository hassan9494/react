import { Card, CardBody, Button, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, Table, Badge } from 'reactstrap'
import Select from 'react-select'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { confirmDelete } from '@components/sweetalert'
import { api } from '@data/use-payment-method'
import {Link} from "react-router-dom"
import {Edit, Printer, Trash} from "react-feather"
import { api as transactionApi } from '@data/use-transaction' // You'll need to create this hook

const ReturnOrderTransaction = ({ order, calculations, transactions, setTransactions }) => {
    const [paymentMethods, setPaymentMethods] = useState([])
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState(null)
    const [newRefundData, setNewRefundData] = useState({
        payment_method: '',
        amount: '',
        commission: ''
    })
    const [editRefundData, setEditRefundData] = useState({
        payment_method: '',
        amount: '',
        commission: ''
    })
    const [isCommissionManual, setIsCommissionManual] = useState(false)
    const [isEditCommissionManual, setIsEditCommissionManual] = useState(false)

    // Calculate totals for return order
    const returnOrderTotal = calculations?.total || order?.total || 0
    const existingRefundsTotal = transactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0)
    const remainingBalance = returnOrderTotal - existingRefundsTotal
    const maxRefundAmount = Math.max(0, remainingBalance)

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
        if (!isCommissionManual && newRefundData.payment_method && newRefundData.amount) {
            const calculatedCommission = calculateCommission(
                newRefundData.payment_method,
                newRefundData.amount
            )

            setNewRefundData(prev => ({
                ...prev,
                commission: calculatedCommission.toFixed(3)
            }))
        }
    }, [newRefundData.payment_method, newRefundData.amount, paymentMethods, isCommissionManual])

    // Auto-calculate commission for edit modal when payment method or amount changes
    useEffect(() => {
        if (showEditModal && !isEditCommissionManual && editRefundData.payment_method && editRefundData.amount) {
            const calculatedCommission = calculateCommission(
                editRefundData.payment_method,
                editRefundData.amount
            )

            setEditRefundData(prev => ({
                ...prev,
                commission: calculatedCommission.toFixed(3)
            }))
        }
    }, [editRefundData.payment_method, editRefundData.amount, paymentMethods, isEditCommissionManual, showEditModal])

    // Reset form when add modal opens
    useEffect(() => {
        if (showAddModal) {
            const cashPaymentMethod = paymentMethods.find(method => method.id === 1) || paymentMethods[0]

            setNewRefundData({
                payment_method: cashPaymentMethod ? cashPaymentMethod.id.toString() : (paymentMethods[0]?.id.toString() || ''),
                amount: maxRefundAmount > 0 ? maxRefundAmount.toFixed(3) : '0',
                commission: '0'
            })
            setIsCommissionManual(false)

            // Calculate initial commission
            if (cashPaymentMethod && maxRefundAmount > 0) {
                const initialCommission = calculateCommission(
                    cashPaymentMethod.id.toString(),
                    maxRefundAmount.toString()
                )
                setNewRefundData(prev => ({
                    ...prev,
                    commission: initialCommission.toFixed(3)
                }))
            }
        }
    }, [showAddModal, paymentMethods, maxRefundAmount])

    const handlePaymentMethodChange = (paymentMethodId) => {
        setNewRefundData(prev => ({
            ...prev,
            payment_method: paymentMethodId
        }))
        setIsCommissionManual(false)
    }

    const handleAmountChange = (amount) => {
        // Ensure amount doesn't exceed remaining balance
        const numericAmount = parseFloat(amount) || 0
        const finalAmount = Math.min(numericAmount, maxRefundAmount)

        setNewRefundData(prev => ({
            ...prev,
            amount: finalAmount.toString()
        }))
        setIsCommissionManual(false)
    }

    const handleCommissionChange = (commission) => {
        setNewRefundData(prev => ({
            ...prev,
            commission
        }))
        setIsCommissionManual(true)
    }

    const recalculateCommission = () => {
        if (newRefundData.payment_method && newRefundData.amount) {
            const calculatedCommission = calculateCommission(
                newRefundData.payment_method,
                newRefundData.amount
            )

            setNewRefundData(prev => ({
                ...prev,
                commission: calculatedCommission.toFixed(3)
            }))
            setIsCommissionManual(false)
        }
    }

    const handleAddRefund = async () => {
        if (!newRefundData.payment_method || !newRefundData.amount) {
            toast.error('Payment method and amount are required')
            return
        }

        if (parseFloat(newRefundData.amount) <= 0) {
            toast.error('Amount must be greater than 0')
            return
        }

        try {
            const newTransaction = await transactionApi.create({
                return_order_id: order.id,
                payment_method_id: newRefundData.payment_method,
                amount: parseFloat(newRefundData.amount),
                commission: parseFloat(newRefundData.commission || 0)
            })

            // Use setTransactions from props
            setTransactions(prev => [...prev, newTransaction])
            setShowAddModal(false)
            toast.success('Refund added successfully')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add refund')
        }
    }

    const handleDeleteRefund = async (transactionId) => {
        confirmDelete(async () => {
            try {
                await transactionApi.delete(transactionId)

                // Use setTransactions from props
                setTransactions(prev => prev.filter(t => t.id !== transactionId))
                toast.success('Refund deleted successfully')
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete refund')
            }
        })
    }

    // Edit transaction functions
    const handleEditClick = (transaction) => {
        setEditingTransaction(transaction)
        setEditRefundData({
            payment_method: transaction.payment_method_id?.toString() || '',
            amount: transaction.amount?.toString() || '',
            commission: transaction.commission?.toString() || '0'
        })
        setIsEditCommissionManual(false)
        setShowEditModal(true)
    }

    const handleEditPaymentMethodChange = (paymentMethodId) => {
        setEditRefundData(prev => ({
            ...prev,
            payment_method: paymentMethodId
        }))
        setIsEditCommissionManual(false)
    }

    const handleEditAmountChange = (amount) => {
        // Ensure amount doesn't exceed the maximum allowed for editing
        const numericAmount = parseFloat(amount).toFixed(3) || 0
        const finalAmount = Math.min(numericAmount, maxEditAmount)

        setEditRefundData(prev => ({
            ...prev,
            amount: finalAmount
        }))
        setIsEditCommissionManual(false)
    }

    const handleEditCommissionChange = (commission) => {
        setEditRefundData(prev => ({
            ...prev,
            commission
        }))
        setIsEditCommissionManual(true)
    }

    const recalculateEditCommission = () => {
        if (editRefundData.payment_method && editRefundData.amount) {
            const calculatedCommission = calculateCommission(
                editRefundData.payment_method,
                editRefundData.amount
            )

            setEditRefundData(prev => ({
                ...prev,
                commission: calculatedCommission.toFixed(3)
            }))
            setIsEditCommissionManual(false)
        }
    }

    const handleUpdateRefund = async () => {
        if (!editRefundData.payment_method || !editRefundData.amount) {
            toast.error('Payment method and amount are required')
            return
        }

        if (parseFloat(editRefundData.amount) <= 0) {
            toast.error('Amount must be greater than 0')
            return
        }

        // Calculate what the new total would be after this update
        const currentTransactionAmount = parseFloat(editingTransaction.amount || 0)
        const newTransactionAmount = parseFloat(editRefundData.amount)
        const amountDifference = newTransactionAmount - currentTransactionAmount

        // Check if the update would exceed the return order total
        if (existingRefundsTotal + amountDifference > returnOrderTotal) {
            toast.error(`This update would exceed the return order total. Maximum allowed increase: ${(returnOrderTotal - existingRefundsTotal).toFixed(3)}`)
            return
        }

        try {
            const updatedTransaction = await transactionApi.update(editingTransaction.id, {
                payment_method_id: editRefundData.payment_method,
                amount: newTransactionAmount,
                commission: parseFloat(editRefundData.commission || 0)
            })

            // Use setTransactions from props
            setTransactions(prev => prev.map(t => (t.id === editingTransaction.id ? updatedTransaction : t)
            ))

            setShowEditModal(false)
            setEditingTransaction(null)
            toast.success('Refund updated successfully')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update refund')
        }
    }

    const getPaymentMethodName = (paymentMethodId) => {
        // First try to find in paymentMethods array
        const method = paymentMethods.find(m => m.id.toString() === paymentMethodId?.toString())
        if (method) {
            return method.name
        }

        // If not found, check if the transaction already has paymentMethod property
        const transaction = transactions.find(t => t.payment_method_id?.toString() === paymentMethodId?.toString())
        if (transaction?.paymentMethod) {
            return transaction.paymentMethod
        }

        return 'Unknown'
    }

    return (
        <Card className='invoice-action-wrapper mt-2'>
            <CardBody className={'p-1'}>
                {/* Summary Section */}
                <div className="mb-3 p-1 pt-2 pb-2 bg-light rounded">
                    <div className="row text-center">
                        <div className="col-4" style={{paddingLeft:'0.5rem', paddingRight:'0.5rem'}}>
                            <h6 className="mb-1" style={{fontSize:12}}>Total</h6>
                            <h4 className="mb-0 text-primary" style={{fontSize:14}}>{returnOrderTotal}</h4>
                        </div>
                        <div className="col-4" style={{paddingLeft:'0.5rem', paddingRight:'0.5rem'}}>
                            <h6 className="mb-1" style={{fontSize:12}}>Refunded</h6>
                            <h4 className="mb-0 text-success" style={{fontSize:14}}>{existingRefundsTotal?.toFixed(2)}</h4>
                        </div>
                        <div className="col-4" style={{paddingLeft:'0.5rem', paddingRight:'0.5rem'}}>
                            <h6 className="mb-1" style={{fontSize:12}}>Remaining</h6>
                            <h4 className={`mb-0 ${remainingBalance > 0 ? 'text-warning' : 'text-success'}`} style={{fontSize:14}}>
                                {remainingBalance?.toFixed(2)}
                            </h4>
                        </div>
                    </div>
                </div>

                {/* Add Refund Button */}
                <div style={{width:'50%'}}>
                    <Button.Ripple
                        color='dark'
                        block
                        size={'sm'}
                        className={'pt-1 pb-1'}
                        onClick={() => setShowAddModal(true)}
                        disabled={maxRefundAmount <= 0}
                    >
                        Add Refund
                    </Button.Ripple>
                </div>

                {/* Refund Transactions Table */}
                {transactions.length > 0 && (
                    <div className="mt-3">
                        <h6>Refund History</h6>
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
                                                {transaction.amount ? parseFloat(transaction.amount).toFixed(3) : '0.000'}
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
                                                    <Trash size={17} onClick={() => handleDeleteRefund(transaction.id)}/>
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
                        <p className="mb-0 text-muted">No refunds recorded yet</p>
                    </div>
                )}

                {/* Add Refund Modal */}
                <Modal isOpen={showAddModal} toggle={() => setShowAddModal(false)}>
                    <ModalHeader toggle={() => setShowAddModal(false)}>
                        Add Refund
                    </ModalHeader>
                    <ModalBody>
                        <div className="alert alert-info">
                            <strong>Remaining Refund Balance:</strong> {remainingBalance.toFixed(3)}<br />
                            <strong>Maximum Refund:</strong> {maxRefundAmount.toFixed(3)}
                        </div>

                        <FormGroup>
                            <Label for="payment_method">Payment Method *</Label>
                            <Input
                                type="select"
                                id="payment_method"
                                value={newRefundData.payment_method}
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
                                max={maxRefundAmount}
                                value={newRefundData.amount}
                                onChange={(e) => handleAmountChange(e.target.value)}
                                required
                            />
                            <small className="text-muted">
                                Maximum allowed: {maxRefundAmount.toFixed(3)}
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
                                    value={newRefundData.commission}
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
                        <Button color="secondary" onClick={() => setShowAddModal(false)}>
                            Cancel
                        </Button>
                        <Button color="primary" onClick={handleAddRefund}>
                            Add Refund
                        </Button>
                    </ModalFooter>
                </Modal>

                {/* Edit Refund Modal */}
                <Modal isOpen={showEditModal} toggle={() => setShowEditModal(false)}>
                    <ModalHeader toggle={() => setShowEditModal(false)}>
                        Edit Refund
                    </ModalHeader>
                    <ModalBody>
                        {editingTransaction && (
                            <>
                                <div className="alert alert-info">
                                    <strong>Return Order Total:</strong> {returnOrderTotal}<br />
                                    <strong>Current Refunded Total:</strong> {existingRefundsTotal.toFixed(3)}<br />
                                    <strong>Remaining Refund Balance:</strong> {remainingBalance.toFixed(3)}<br />
                                    <strong>Original Refund Amount:</strong> {parseFloat(editingTransaction.amount).toFixed(3)}<br />
                                    <strong>Maximum Allowed for this Refund:</strong> {maxEditAmount}
                                </div>

                                <FormGroup>
                                    <Label for="edit_payment_method">Payment Method *</Label>
                                    <Input
                                        type="select"
                                        id="edit_payment_method"
                                        value={editRefundData.payment_method}
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
                                    <Label for="edit_amount">Refund Amount *</Label>
                                    <Input
                                        type="number"
                                        id="edit_amount"
                                        step="0.001"
                                        min="0"
                                        max={maxEditAmount}
                                        value={editRefundData.amount}
                                        onChange={(e) => handleEditAmountChange(e.target.value)}
                                        required
                                    />
                                    <small className="text-muted">
                                        Maximum allowed: {maxEditAmount} (Remaining balance + current refund amount)
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
                                            value={editRefundData.commission}
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
                                        {isEditCommissionManual ? "Commission is manually set. Click 'Auto' to recalculate." : "Commission is auto-calculated based on payment method and amount."}
                                    </small>
                                </FormGroup>
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={() => setShowEditModal(false)}>
                            Cancel
                        </Button>
                        <Button color="primary" onClick={handleUpdateRefund}>
                            Update Refund
                        </Button>
                    </ModalFooter>
                </Modal>
            </CardBody>
        </Card>
    )
}

export default ReturnOrderTransaction