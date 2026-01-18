// src/views/transfer-order/actions.js
import { Eye, Info, CheckCircle, RefreshCw, Trash, Printer } from 'react-feather'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import ability from '../../configs/acl/ability'
import axios from '../../utility/axiosIsntance'

const TransferOrderActions = ({ row, refetch }) => {
    const canEdit = ability.can('read', 'transfer_order_edit')
    const canDelete = ability.can('read', 'transfer_order_delete')
    const canComplete = ability.can('read', 'transfer_order_complete')
    const canPrint = ability.can('read', 'transfer_order_print')

    const handleToggleStatus = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        const actionType = row.status === 'PENDING' ? 'complete' : 'revert'
        const actionText = actionType === 'complete' ? 'complete' : 'revert'
        const confirmText = actionType === 'complete' ? 'Are you sure you want to complete this transfer order? This will update stock quantities.' : 'Are you sure you want to revert this transfer order to pending? This will reverse the stock transfer.'

        const result = await Swal.fire({
            title: actionType === 'complete' ? 'Complete Transfer Order' : 'Revert to Pending',
            text: confirmText,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: `Yes, ${actionText} it!`,
            cancelButtonText: 'Cancel',
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-secondary ml-1'
            },
            buttonsStyling: false
        })

        if (result.isConfirmed) {
            try {
                await axios.post(`/transfer-orders/${row.id}/toggle-status`)
                toast.success(`Transfer order ${actionText}d successfully`)
                if (refetch) refetch()
            } catch (error) {
                toast.error(error.response?.data?.message || `Failed to ${actionText} transfer order`)
            }
        }
    }

    const handleDelete = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            customClass: {
                confirmButton: 'btn btn-danger',
                cancelButton: 'btn btn-outline-secondary ml-1'
            },
            buttonsStyling: false
        })

        if (result.isConfirmed) {
            try {
                await axios.delete(`/transfer-orders/${row.id}`)
                toast.success('Transfer order deleted successfully')
                if (refetch) refetch()
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete transfer order')
            }
        }
    }
    const handlePrint = (e) => {
        e.preventDefault()
        e.stopPropagation()

        // Open print in new window/tab
        window.open(`/transfer-order/print/${row.id}`, '_blank')

        // Or if you want to print directly:
        // window.print()

        // If you have a specific print endpoint:
        // window.open(`/api/transfer-orders/${row.id}/print`, '_blank')
    }

    return (
        <div className="d-flex align-items-center gap-1">

            {/* Details button with Info icon */}
            <Link
                to={`/transfer-order/details/${row.id}`}
                className="btn btn-icon btn-sm text-dark"
                title="Details"
                onClick={(e) => e.stopPropagation()}
            >
                <Info size={16} />
            </Link>

            {/* Edit button with Eye icon */}
            {row.can_edit && canEdit && (
                <Link
                    to={`/transfer-order/edit/${row.id}`}
                    className="btn btn-icon btn-sm text-dark"
                    title="Edit"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Eye size={16} />
                </Link>
            )}

            {/* Print button */}
            {canPrint && (
                <button
                    className="btn btn-icon btn-sm text-dark"
                    onClick={handlePrint}
                    title="Print"
                >
                    <Printer size={16} />
                </button>
            )}

            {/* Complete/Revert button */}
            {canComplete && (row.can_complete || row.can_revert) && (
                <button
                    className="btn btn-icon btn-sm text-dark"
                    onClick={handleToggleStatus}
                    title={row.status === 'PENDING' ? 'Complete' : 'Revert to Pending'}
                >
                    {row.status === 'PENDING' ? <CheckCircle size={16} /> : <RefreshCw size={16} />}
                </button>
            )}

            {/* Delete button */}
            {row.can_edit && canDelete && (
                <button
                    className="btn btn-icon btn-sm text-dark"
                    onClick={handleDelete}
                    title="Delete"
                >
                    <Trash size={16} />
                </button>
            )}
        </div>
    )
}

export default TransferOrderActions