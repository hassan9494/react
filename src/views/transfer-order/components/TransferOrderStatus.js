import { Card, CardBody, Button, FormGroup, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, Alert, Badge } from 'reactstrap'
import Select from 'react-select'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { confirm } from '@components/sweetalert'
import { Controller } from "react-hook-form"
import { CheckCircle, AlertTriangle, RefreshCw, Info } from 'react-feather'
import axios from '../../../utility/axiosIsntance'

const TransferOrderStatus = ({ form, transferOrder, isEditMode, onStatusToggle, refetch }) => {
    const [status, setStatus] = useState(null)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [actionType, setActionType] = useState('') // 'complete' or 'revert'
    const [isProcessing, setIsProcessing] = useState(false)
    const [completionNotes, setCompletionNotes] = useState('')

    useEffect(() => {
        if (transferOrder) {
            setStatus(transferOrder.status || 'PENDING')
            if (form) {
                form.setValue('status', transferOrder.status || 'PENDING')
            }
        }
    }, [transferOrder, form])

    const statusOptions = [
        {
            label: (
                <div className="d-flex align-items-center">
                    <AlertTriangle size={16} className="mr-2 text-warning" />
                    <span>Pending</span>
                </div>
            ),
            value: 'PENDING'
        },
        {
            label: (
                <div className="d-flex align-items-center">
                    <CheckCircle size={16} className="mr-2 text-success" />
                    <span>Completed</span>
                </div>
            ),
            value: 'COMPLETED'
        }
    ]

    const getStatusBadge = (status) => {
        if (!status) return null

        switch (status) {
            case 'PENDING':
                return (
                    <Badge color="warning" className="py-1 px-3 d-flex align-items-center">
                        <AlertTriangle size={14} className="mr-1" />
                        Pending
                    </Badge>
                )
            case 'COMPLETED':
                return (
                    <Badge color="success" className="py-1 px-3 d-flex align-items-center">
                        <CheckCircle size={14} className="mr-1" />
                        Completed
                    </Badge>
                )
            default:
                return null
        }
    }

    const handleStatusChange = (selectedStatus) => {
        if (!selectedStatus) return

        const newStatus = selectedStatus.value
        const currentStatus = transferOrder?.status || 'PENDING'

        // If status hasn't changed, do nothing
        if (newStatus === currentStatus) return

        // Set the status in the form
        if (form) {
            form.setValue('status', newStatus)
        }
        setStatus(newStatus)

        // Determine action type
        if (currentStatus === 'PENDING' && newStatus === 'COMPLETED') {
            setActionType('complete')
            setShowConfirmModal(true)
        } else if (currentStatus === 'COMPLETED' && newStatus === 'PENDING') {
            setActionType('revert')
            setShowConfirmModal(true)
        }
    }

    const handleSubmitStatus = async () => {
        if (!status) {
            toast.error('Please select a status')
            return
        }

        const currentStatus = transferOrder?.status || 'PENDING'

        // If status hasn't changed, do nothing
        if (status === currentStatus) {
            toast.info(`Status is already set to ${  status}`)
            return
        }

        // For direct status update (without stock changes)
        if (form && isEditMode) {
            confirm({
                title: 'Update Status',
                text: `Are you sure you want to change status to ${status}?`,
                icon: 'warning',
                confirmButtonText: 'Yes, update it!',
                cancelButtonText: 'Cancel'
            }, async () => {
                try {
                    if (onStatusToggle) {
                        await onStatusToggle(status)
                    }
                } catch (e) {
                    toast.error(e.response?.data?.message || 'An error occurred')
                }
            })
        } else {
            // For status toggle with stock changes
            if (currentStatus === 'PENDING' && status === 'COMPLETED') {
                setActionType('complete')
                setShowConfirmModal(true)
            } else if (currentStatus === 'COMPLETED' && status === 'PENDING') {
                setActionType('revert')
                setShowConfirmModal(true)
            }
        }
    }

    const handleToggleStatus = async () => {
        setIsProcessing(true)
        try {
            await axios.post(`/transfer-orders/${transferOrder.id}/toggle-status`, {
                notes: completionNotes || undefined
            })

            toast.success(
                actionType === 'complete' ? 'Transfer order completed successfully' : 'Transfer order reverted to pending successfully'
            )

            setShowConfirmModal(false)
            setCompletionNotes('')

            if (onStatusToggle) {
                await onStatusToggle()
            }

            if (refetch) {
                await refetch()
            }
        } catch (error) {
            console.error('Toggle status error:', error)
            toast.error(error.response?.data?.message || 'Failed to update transfer order status')
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <Card className='invoice-action-wrapper'>
            <CardBody>

                {/* Status Selection */}
                {isEditMode && (
                    <>
                        <FormGroup>
                            {form ? (
                                <Controller
                                    control={form.control}
                                    defaultValue={status}
                                    name="status"
                                    render={({ field: { onChange, value, name, ref } }) => (
                                        <Select
                                            className='react-select'
                                            classNamePrefix='select'
                                            value={statusOptions.find(opt => opt.value === (value || status))}
                                            options={statusOptions}
                                            onChange={(val) => {
                                                onChange(val?.value || null)
                                                handleStatusChange(val)
                                            }}
                                            ref={ref}
                                        />
                                    )}
                                />
                            ) : (
                                <Select
                                    className='react-select'
                                    classNamePrefix='select'
                                    value={statusOptions.find(opt => opt.value === status)}
                                    options={statusOptions}
                                    onChange={handleStatusChange}
                                />
                            )}
                        </FormGroup>

                        <Button.Ripple
                            color='primary'
                            block
                            onClick={handleSubmitStatus}
                            disabled={!status || status === transferOrder?.status}
                        >
                            Update Status
                        </Button.Ripple>
                    </>
                )}

                {/* Quick Action Buttons */}
                {!isEditMode && (
                    <div className="mt-3">
                        {transferOrder?.can_complete && (
                            <Button.Ripple
                                color='success'
                                className='mt-2'
                                block
                                onClick={() => {
                                    setActionType('complete')
                                    setShowConfirmModal(true)
                                }}
                            >
                                <CheckCircle size={14} className="mr-1" />
                                Complete Transfer
                            </Button.Ripple>
                        )}

                        {transferOrder?.can_revert && (
                            <Button.Ripple
                                color='warning'
                                className='mt-2'
                                block
                                onClick={() => {
                                    setActionType('revert')
                                    setShowConfirmModal(true)
                                }}
                            >
                                <RefreshCw size={14} className="mr-1" />
                                Revert to Pending
                            </Button.Ripple>
                        )}
                    </div>
                )}
            </CardBody>

            {/* Confirmation Modal */}
            <Modal isOpen={showConfirmModal} toggle={() => setShowConfirmModal(false)}>
                <ModalHeader toggle={() => setShowConfirmModal(false)}>
                    {actionType === 'complete' ? 'Complete Transfer Order' : 'Revert to Pending'}
                </ModalHeader>
                <ModalBody>
                    {actionType === 'complete' ? (
                        <>
                            <p>Are you sure you want to complete this transfer order?</p>
                        </>
                    ) : (
                        <>
                            <p>Are you sure you want to revert this transfer order to pending?</p>
                        </>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => setShowConfirmModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        color={actionType === 'complete' ? 'success' : 'warning'}
                        onClick={handleToggleStatus}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <>
                                <span className="spinner-border spinner-border-sm mr-2"></span>
                                Processing...
                            </>
                        ) : (
                            actionType === 'complete' ? 'Complete Transfer' : 'Revert to Pending'
                        )}
                    </Button>
                </ModalFooter>
            </Modal>
        </Card>
    )
}

export default TransferOrderStatus