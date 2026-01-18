import React, { useState, useEffect } from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Badge,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Alert,
  Spinner,
  UncontrolledTooltip
} from 'reactstrap'
import {
  Check,
  X,
  Search,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronRight,
  Clock,
  User,
  ChevronsUp,
  ChevronsDown,
  ArrowRight,
  Package,
  Database,
  Home
} from 'react-feather'
import Datatable from '../../@core/components/datatable'
import { useStockAdjustmentDatatable } from '../../data/use-stock-adjustment-datatable'
import Select from 'react-select'
import { api as stockAdjustmentApi } from '../../data/use-stock-adjustment'
import { api as userApi } from '../../data/use-user'
import { isCurrentUserAdmin } from '../../data/use-auth'
import { showError, showSuccess, showInfo } from '../../utility/Utils'
import Avatar from '../../@core/components/avatar'

const StockAdjustmentApprove = () => {
  const [selectedItem, setSelectedItem] = useState(null)
  const [rejectModal, setRejectModal] = useState(false)
  const [approveModal, setApproveModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [approveNotes, setApproveNotes] = useState('')
  const [processingAction, setProcessingAction] = useState(false)
  const [processingId, setProcessingId] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [validationResult, setValidationResult] = useState({ canProceed: true, message: '' })

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [users, setUsers] = useState([])

  useEffect(() => {
    setIsAdmin(isCurrentUserAdmin())
  }, [])

  // Load users for filter
  const loadUsers = async () => {
    try {
      const result = await userApi.autocomplete('')
      const formattedUsers = result.map(user => ({
        value: user.id,
        label: `${user.name} (${user.email})`
      }))
      setUsers(formattedUsers)
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      loadUsers()
    }
  }, [isAdmin])

  // Helper function to calculate expected stock values
  const calculateExpectedStock = (item) => {
    if (!item) return { stockAvailAfter: 0, storeAvailAfter: 0, totalAfter: 0 }

    const currentStock = item.product?.current_stock || 0
    const currentStockAvail = item.product?.current_stock_available || 0
    const currentStoreAvail = item.product?.current_store_available || 0
    const quantity = item.quantity

    let stockAvailAfter = currentStockAvail
    let storeAvailAfter = currentStoreAvail
    let totalAfter = currentStock

    if (item.is_transfer) {
      if (item.transfer_from_location === 'stock_available') {
        stockAvailAfter = Math.max(0, currentStockAvail - quantity)
        storeAvailAfter = currentStoreAvail + quantity
      } else {
        stockAvailAfter = currentStockAvail + quantity
        storeAvailAfter = Math.max(0, currentStoreAvail - quantity)
      }
      totalAfter = currentStock // Total doesn't change for transfers
    } else if (item.adjustment_type === 'increase') {
      if (item.adjustment_location === 'total') {
        stockAvailAfter = currentStockAvail
        storeAvailAfter = currentStoreAvail + quantity
        totalAfter = currentStock + quantity
      } else if (item.adjustment_location === 'stock_available') {
        stockAvailAfter = currentStockAvail + quantity
        storeAvailAfter = currentStoreAvail
        totalAfter = currentStock + quantity
      } else { // store_available
        stockAvailAfter = currentStockAvail
        storeAvailAfter = currentStoreAvail + quantity
        totalAfter = currentStock + quantity
      }
    } else { // decrease
      if (item.adjustment_location === 'total') {
        // Take from store_available first
        if (currentStoreAvail >= quantity) {
          stockAvailAfter = currentStockAvail
          storeAvailAfter = currentStoreAvail - quantity
        } else {
          const remaining = quantity - currentStoreAvail
          stockAvailAfter = Math.max(0, currentStockAvail - remaining)
          storeAvailAfter = 0
        }
        totalAfter = Math.max(0, currentStock - quantity)
      } else if (item.adjustment_location === 'stock_available') {
        stockAvailAfter = Math.max(0, currentStockAvail - quantity)
        storeAvailAfter = currentStoreAvail
        totalAfter = Math.max(0, currentStock - quantity)
      } else { // store_available
        stockAvailAfter = currentStockAvail
        storeAvailAfter = Math.max(0, currentStoreAvail - quantity)
        totalAfter = Math.max(0, currentStock - quantity)
      }
    }

    return { stockAvailAfter, storeAvailAfter, totalAfter }
  }

  // Function to check if adjustment can be approved
  const canAdjustmentBeApproved = (item) => {
    if (!item || !item.product) return { canProceed: false, message: 'Product not found' }

    const currentStock = item.product.current_stock || 0
    const currentStockAvailable = item.product.current_stock_available || 0
    const currentStoreAvailable = item.product.current_store_available || 0
    const quantity = item.quantity

    if (item.adjustment_type === 'decrease') {
      let maxAllowed = 0
      let locationName = ''

      switch (item.adjustment_location) {
        case 'total':
          maxAllowed = currentStockAvailable + currentStoreAvailable
          locationName = 'total available stock'
          break
        case 'stock_available':
          maxAllowed = currentStockAvailable
          locationName = 'stock available'
          break
        case 'store_available':
          maxAllowed = currentStoreAvailable
          locationName = 'store available'
          break
        default:
          return { canProceed: false, message: 'Invalid adjustment location' }
      }

      if (quantity > maxAllowed) {
        return {
          canProceed: false,
          message: `Cannot decrease ${quantity} units from ${locationName}. Only ${maxAllowed} units available.`,
          maxAllowed
        }
      }

      // Check if this will leave stock at dangerously low levels
      if (item.adjustment_location === 'total') {
        const newTotal = currentStock - quantity
        if (newTotal <= 5) {
          return {
            canProceed: true,
            message: `Warning: This will reduce total stock to ${newTotal} units.`,
            warning: true
          }
        }
      }
    }

    if (item.adjustment_type === 'transfer') {
      let maxTransfer = 0
      let locationName = ''

      if (item.transfer_from_location === 'stock_available') {
        maxTransfer = currentStockAvailable
        locationName = 'stock available'
      } else if (item.transfer_from_location === 'store_available') {
        maxTransfer = currentStoreAvailable
        locationName = 'store available'
      } else {
        return { canProceed: false, message: 'Invalid transfer source location' }
      }

      if (quantity > maxTransfer) {
        return {
          canProceed: false,
          message: `Cannot transfer ${quantity} units from ${locationName}. Only ${maxTransfer} units available.`,
          maxAllowed: maxTransfer
        }
      }

      // Check if source will be critically low after transfer
      const sourceAfter = maxTransfer - quantity
      if (sourceAfter <= 2) {
        return {
          canProceed: true,
          message: `Warning: ${locationName} will have only ${sourceAfter} units remaining after transfer.`,
          warning: true
        }
      }
    }

    return { canProceed: true }
  }

  // Function to calculate safe quantity
  const calculateSafeQuantity = (item) => {
    if (!item || !item.product) return item?.quantity || 0

    const currentStockAvailable = item.product.current_stock_available || 0
    const currentStoreAvailable = item.product.current_store_available || 0
    const requestedQuantity = item.quantity

    if (item.adjustment_type === 'decrease') {
      let maxAllowed = 0

      switch (item.adjustment_location) {
        case 'total':
          maxAllowed = currentStockAvailable + currentStoreAvailable
          break
        case 'stock_available':
          maxAllowed = currentStockAvailable
          break
        case 'store_available':
          maxAllowed = currentStoreAvailable
          break
        default:
          return requestedQuantity
      }

      return Math.min(requestedQuantity, maxAllowed)
    }

    if (item.adjustment_type === 'transfer') {
      let maxTransfer = 0

      if (item.transfer_from_location === 'stock_available') {
        maxTransfer = currentStockAvailable
      } else if (item.transfer_from_location === 'store_available') {
        maxTransfer = currentStoreAvailable
      }

      return Math.min(requestedQuantity, maxTransfer)
    }

    return requestedQuantity
  }

  const handleApproveClick = (item) => {
    setSelectedItem(item)
    const validation = canAdjustmentBeApproved(item)
    setValidationResult(validation)
    setApproveModal(true)
  }

  const handleRejectClick = (item) => {
    setSelectedItem(item)
    setRejectModal(true)
  }

  const handleApprove = async () => {
    if (!selectedItem) return

    // Re-validate before approving
    const validation = canAdjustmentBeApproved(selectedItem)

    if (!validation.canProceed) {
      showError(validation.message)
      return
    }

    // Additional confirmation for risky operations
    if (validation.warning) {
      const confirmProceed = window.confirm(
          `${validation.message}\n\nDo you want to proceed with this adjustment?`
      )
      if (!confirmProceed) return
    }

    // For decrease operations that will leave low stock
    if (selectedItem.adjustment_type === 'decrease') {
      const currentStock = selectedItem.product.current_stock || 0
      const quantity = selectedItem.quantity
      const newStock = currentStock - quantity

      if (newStock <= 3) {
        const confirmProceed = window.confirm(
            `⚠️ WARNING: This adjustment will reduce total stock to ${newStock} units.\n\n` +
            `Are you sure you want to approve this?`
        )
        if (!confirmProceed) return
      }
    }

    try {
      setProcessingAction(true)
      setProcessingId(selectedItem.id)
      await stockAdjustmentApi.approve(selectedItem.id, approveNotes || '')
      showSuccess('Adjustment approved successfully!')
      setApproveModal(false)
      setApproveNotes('')
      setSelectedItem(null)
      setValidationResult({ canProceed: true, message: '' })
    } catch (error) {
      showError(`Failed to approve adjustment: ${error.response?.data?.message || error.message}`)
    } finally {
      setProcessingAction(false)
      setProcessingId(null)
    }
  }

  const handleReject = async () => {
    if (!selectedItem) return

    try {
      setProcessingAction(true)
      setProcessingId(selectedItem.id)
      await stockAdjustmentApi.reject(selectedItem.id, rejectReason)
      showSuccess('Adjustment rejected')
      setRejectModal(false)
      setRejectReason('')
      setSelectedItem(null)
    } catch (error) {
      showError(`Failed to reject adjustment: ${error.response?.data?.message || error.message}`)
    } finally {
      setProcessingAction(false)
      setProcessingId(null)
    }
  }

  const statusBadge = (status, itemId) => {
    const statusConfig = {
      pending: {
        color: 'warning',
        icon: <AlertCircle size={12} />,
        text: 'Pending',
        tooltip: 'Awaiting approval'
      },
      approved: {
        color: 'success',
        icon: <CheckCircle size={12} />,
        text: 'Approved',
        tooltip: 'Approved and processed'
      },
      rejected: {
        color: 'danger',
        icon: <XCircle size={12} />,
        text: 'Rejected',
        tooltip: 'Request was rejected'
      }
    }

    const config = statusConfig[status] || {
      color: 'secondary',
      icon: null,
      text: status,
      tooltip: status
    }

    const badgeId = `status-badge-${status}-${itemId}`

    return (
        <>
          <Badge
              id={badgeId}
              color={config.color}
              className="d-flex align-items-center gap-1"
              pill
          >
            {config.icon}
            <span>{config.text}</span>
          </Badge>
          <UncontrolledTooltip placement="top" target={badgeId}>
            {config.tooltip}
          </UncontrolledTooltip>
        </>
    )
  }

  const typeBadge = (type, itemId) => {
    const badgeId = `type-badge-${type}-${itemId}`

    return (
        <>
          <Badge
              id={badgeId}
              color={type === 'increase' ? 'success' : type === 'decrease' ? 'danger' : 'info'}
              className="text-uppercase"
              pill
          >
            {type === 'increase' ? <ChevronsUp size={10} /> : type === 'decrease' ? <ChevronsDown size={10} /> : <ArrowRight size={10} />}
            <span className="ms-1">{type}</span>
          </Badge>
          <UncontrolledTooltip placement="top" target={badgeId}>
            {type === 'increase' ? 'Increase stock' : type === 'decrease' ? 'Decrease stock' : 'Transfer stock'}
          </UncontrolledTooltip>
        </>
    )
  }

  const locationBadge = (location) => {
    const locationConfig = {
      total: { color: 'primary', text: 'Total' },
      stock_available: { color: 'info', text: 'Stock Available' },
      store_available: { color: 'warning', text: 'Store Available' },
      transfer: { color: 'secondary', text: 'Transfer' }
    }

    const config = locationConfig[location] || { color: 'secondary', text: location }

    return (
        <Badge color={config.color} className="text-capitalize">
          {config.text}
        </Badge>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }

  const columns = [
    {
      name: 'Name',
      selector: row => row.product?.name,
      sortable: true,
      minWidth: '400px',
      cell: row => {
        const productName = row.product?.name || 'N/A'
        const imageUrl = row.product?.image
        const productLink = row.product?.link

        return (
            <div className='d-flex align-items-center'>
              <Avatar
                  img={imageUrl}
                  className="mr-2"
                  imgHeight={32}
                  imgWidth={32}
                  onError={(e) => {
                    e.target.src = '/static/images/placeholder.png'
                  }}
              />
              <a
                  className='text-dark'
                  href={`${process.env.REACT_APP_WEBSITE}/product/${productName.replace(/\s+/g, '-').toLowerCase()}`}
                  target='_blank'
                  rel="noopener noreferrer"
              >
                {productName}
              </a>
            </div>
        )
      }
    },
    {
      name: 'Requested By',
      selector: row => row.user?.name,
      sortable: true,
      minWidth: '180px',
      cell: row => (
          <div>
            <div className="d-flex align-items-center">
              <User size={14} className="me-1 text-muted" />
              <span className="text-truncate d-inline-block" style={{ maxWidth: '140px' }}>
              {row.user?.name || 'N/A'}
            </span>
            </div>
            <small className="text-muted d-block text-truncate" style={{ maxWidth: '180px' }}>
              {row.user?.email || ''}
            </small>
          </div>
      )
    },
    {
      name: 'Type',
      selector: row => row.adjustment_type,
      sortable: true,
      width: '120px',
      cell: row => typeBadge(row.adjustment_type, row.id)
    },
    {
      name: 'Location',
      width: '140px',
      cell: row => {
        if (row.is_transfer) {
          return (
              <div className="small">
                <div>Transfer</div>
                <div className="text-muted">
                  {row.transfer_from_location === 'stock_available' ? 'Stock → Store' : 'Store → Stock'}
                </div>
              </div>
          )
        }
        return locationBadge(row.adjustment_location)
      }
    },
    {
      name: 'Quantity',
      selector: row => row.quantity,
      sortable: true,
      width: '100px',
      cell: row => (
          <div className="fw-bold text-center">
            {row.quantity}
          </div>
      )
    },
    {
      name: 'Stock Impact',
      minWidth: '200px',
      cell: (row) => {
        const isProcessed = row.status === 'approved' || row.status === 'rejected'

        if (isProcessed) {
          // Show historical data for approved/rejected
          return (
              <div className="small">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Stock Avail:</span>
                  <span>
                  {row.historical_stock_available_before !== 'N/A' ? `${row.historical_stock_available_before} → ${row.historical_stock_available_after}` : 'N/A → N/A'}
                </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Store Avail:</span>
                  <span>
                  {row.historical_store_available_before !== 'N/A' ? `${row.historical_store_available_before} → ${row.historical_store_available_after}` : 'N/A → N/A'}
                </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Total:</span>
                  <span className="fw-bold">
                  {row.historical_stock_before !== 'N/A' ? `${row.historical_stock_before} → ${row.historical_stock_after}` : 'N/A → N/A'}
                </span>
                </div>
              </div>
          )
        } else {
          // For pending items, calculate expected values
          const expected = calculateExpectedStock(row)
          const validation = canAdjustmentBeApproved(row)

          return (
              <div className="small">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Stock Avail:</span>
                  <span className={row.adjustment_type === 'decrease' && row.adjustment_location === 'stock_available' && row.quantity > (row.product?.current_stock_available || 0) ? 'text-danger fw-bold' : ''}>
                  {row.product?.current_stock_available || 0} → {expected.stockAvailAfter}
                    {row.adjustment_type === 'decrease' && row.adjustment_location === 'stock_available' && row.quantity > (row.product?.current_stock_available || 0) && (
                        <span className="ms-1">⚠️</span>
                    )}
                </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Store Avail:</span>
                  <span className={row.adjustment_type === 'decrease' && row.adjustment_location === 'store_available' && row.quantity > (row.product?.current_store_available || 0) ? 'text-danger fw-bold' : ''}>
                  {row.product?.current_store_available || 0} → {expected.storeAvailAfter}
                    {row.adjustment_type === 'decrease' && row.adjustment_location === 'store_available' && row.quantity > (row.product?.current_store_available || 0) && (
                        <span className="ms-1">⚠️</span>
                    )}
                </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Total:</span>
                  <span className={!validation.canProceed ? 'text-danger fw-bold' : 'fw-bold'}>
                  {row.product?.current_stock || 0} → {expected.totalAfter}
                    {!validation.canProceed && (
                        <span className="ms-1">⚠️</span>
                    )}
                </span>
                </div>

              </div>
          )
        }
      }
    },
    {
      name: 'Current Stock',
      minWidth: '150px',
      cell: (row) => {
        const validation = canAdjustmentBeApproved(row)

        return (
            <div className="small">
              <div className="d-flex justify-content-between">
                <span className="text-muted">Stock Avail:</span>
                <span className={`${row.adjustment_type === 'decrease' && row.adjustment_location === 'stock_available' && row.quantity > (row.product?.current_stock_available || 0) ? 'text-danger fw-bold' : 'text-info fw-medium'}`}>
                {row.product?.current_stock_available || 0}
              </span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Store Avail:</span>
                <span className={`${row.adjustment_type === 'decrease' && row.adjustment_location === 'store_available' && row.quantity > (row.product?.current_store_available || 0) ? 'text-danger fw-bold' : 'text-warning fw-medium'}`}>
                {row.product?.current_store_available || 0}
              </span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Total:</span>
                <span className={`${!validation.canProceed ? 'text-danger fw-bold' : 'fw-bold'}`}>
                {row.product?.current_stock || 0}
              </span>
              </div>
            </div>
        )
      }
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      width: '130px',
      cell: row => statusBadge(row.status, row.id)
    },
    {
      name: 'Date',
      selector: row => row.created_at,
      sortable: true,
      width: '150px',
      cell: row => (
          <div style={{ whiteSpace: 'nowrap' }}>
            <div className="small d-flex align-items-center">
              <Clock size={10} className="me-1 text-muted" />
              {formatDate(row.created_at)}
            </div>
          </div>
      )
    },
    {
      name: 'Actions',
      minWidth: 'fit-content',
      cell: (row) => {
        const validation = canAdjustmentBeApproved(row)

        return (
            <div className="d-flex gap-1">
              {row.status === 'pending' ? (
                  <>
                    <Button
                        id={`approve-btn-${row.id}`}
                        color={validation.canProceed ? "success" : "secondary"}
                        size="sm"
                        onClick={() => handleApproveClick(row)}
                        disabled={processingAction && processingId === row.id}
                        className="d-flex align-items-center justify-content-center"
                        style={{ width: '32px', height: '32px' }}
                    >
                      {processingAction && processingId === row.id ? (
                          <Spinner size="sm" />
                      ) : (
                          <>
                            {validation.canProceed ? <Check size={14} /> : <AlertCircle size={14} />}
                          </>
                      )}
                    </Button>
                    <UncontrolledTooltip placement="top" target={`approve-btn-${row.id}`}>
                      {validation.canProceed ? 'Approve this request' : 'Cannot approve - insufficient stock'}
                    </UncontrolledTooltip>

                    <Button
                        id={`reject-btn-${row.id}`}
                        color="danger"
                        size="sm"
                        onClick={() => handleRejectClick(row)}
                        disabled={processingAction && processingId === row.id}
                        className="d-flex align-items-center justify-content-center"
                        style={{ width: '32px', height: '32px' }}
                    >
                      {processingAction && processingId === row.id ? (
                          <Spinner size="sm" />
                      ) : (
                          <X size={14} />
                      )}
                    </Button>
                    <UncontrolledTooltip placement="top" target={`reject-btn-${row.id}`}>
                      Reject this request
                    </UncontrolledTooltip>
                  </>
              ) : (
                  <Button
                      color="light"
                      size="sm"
                      disabled
                      className="text-muted"
                  >
                    {row.status === 'approved' ? 'Approved' : 'Rejected'}
                  </Button>
              )}
            </div>
        )
      }
    }
  ]

  const handleFilterReset = () => {
    setSearchTerm('')
    setSelectedUser(null)
    setStartDate('')
    setEndDate('')
    setFilterStatus('all')
  }

  // Filter status options
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ]

  if (!isAdmin) {
    return (
        <Card>
          <CardBody className="text-center py-5">
            <Alert color="danger" className="mb-4">
              <AlertCircle size={24} className="me-2" />
              <h4>Access Denied</h4>
              <p>Only administrators, super users, and stock managers can access this page.</p>
            </Alert>
            <Button color="primary" href="/stock-adjustments/request">
              Go to Request Page
            </Button>
          </CardBody>
        </Card>
    )
  }

  // Filter bar component
  const FilterBar = () => (
      <div className="d-flex align-items-center gap-2 mb-3">
        {/* Status Filter */}
        <select
            className="form-select form-select-sm"
            style={{ width: '120px' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
        >
          {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
          ))}
        </select>

        {/* Date Filters */}
        <Input
            type="date"
            value={startDate || ''}
            onChange={(e) => setStartDate(e.target.value)}
            className="form-control-sm"
            style={{ width: '130px' }}
            placeholder="Start date"
        />
        <Input
            type="date"
            value={endDate || ''}
            onChange={(e) => setEndDate(e.target.value)}
            className="form-control-sm"
            style={{ width: '130px' }}
            placeholder="End date"
        />

        {/* Reset Button */}
        {(searchTerm || selectedUser || startDate || endDate || filterStatus !== 'all') && (
            <Button
                color="secondary"
                size="sm"
                onClick={handleFilterReset}
                className="d-flex align-items-center"
            >
              <RefreshCw size={14} />
            </Button>
        )}
      </div>
  )

  return (
      <>
        <Card>
          <CardHeader>
            <h4 className="mb-0">Stock Adjustment Approvals</h4>
          </CardHeader>
          <CardBody>
            <FilterBar />
            <Datatable
                useDatatable={useStockAdjustmentDatatable}
                columns={columns}
                title=""
                hasSearch={true}
                conditions={{
                  status: filterStatus,
                  user_id: selectedUser?.value || ''
                }}
                dateRange={{
                  startDate,
                  endDate
                }}
                isSticky={true}
                initialOrder={{ column: 'created_at', dir: 'desc' }}
            />
          </CardBody>
        </Card>

        {/* Approve Modal */}
        <Modal isOpen={approveModal} toggle={() => !processingAction && setApproveModal(false)}>
          <ModalHeader toggle={() => !processingAction && setApproveModal(false)}>
            <CheckCircle size={20} className="me-2 text-success" />
            Approve Stock Adjustment
          </ModalHeader>
          <ModalBody>
            {selectedItem && (
                <>
                  <div className="mb-3">
                    <h6>Adjustment Details</h6>

                    {/* Product Row with Image */}
                    <Row className="mb-2 align-items-center">
                      <Col sm="3" className="text-muted">Product:</Col>
                      <Col sm="9">
                        <div className="d-flex align-items-center">
                          {/* Product Image */}
                          {selectedItem.product?.image ? (
                              <img
                                  src={selectedItem.product.image}
                                  alt={selectedItem.product?.name || 'Product'}
                                  height="50"
                                  width="50"
                                  className="rounded me-3"
                                  style={{ objectFit: 'cover' }}
                                  onError={(e) => {
                                    e.target.src = '/static/images/placeholder.png'
                                    e.target.onerror = null
                                  }}
                              />
                          ) : (
                              <div
                                  className="rounded me-3 d-flex align-items-center justify-content-center"
                                  style={{
                                    height: '50px',
                                    width: '50px',
                                    backgroundColor: '#f8f9fa',
                                    color: '#6c757d'
                                  }}
                              >
                                <Package size={24} />
                              </div>
                          )}

                          {/* Product Details */}
                          <div>
                            <strong className="d-block">{selectedItem.product?.name || 'N/A'}</strong>
                            <div className="small text-muted">SKU: {selectedItem.product?.sku || 'N/A'}</div>
                            {selectedItem.product?.current_stock !== undefined && (
                                <div className="small text-muted">
                                  Current Total Stock: <span className="fw-bold">{selectedItem.product.current_stock}</span>
                                </div>
                            )}
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <Row className="mb-2">
                      <Col sm="4" className="text-muted">Requested By:</Col>
                      <Col sm="8">
                        <div>{selectedItem.user?.name || 'N/A'}</div>
                        <div className="small text-muted">{selectedItem.user?.email || ''}</div>
                      </Col>
                    </Row>

                    <Row className="mb-2">
                      <Col sm="4" className="text-muted">Adjustment:</Col>
                      <Col sm="8">
                        <Badge color={selectedItem.adjustment_type === 'increase' ? 'success' : selectedItem.adjustment_type === 'decrease' ? 'danger' : 'info'}>
                          {selectedItem.adjustment_type} {selectedItem.quantity} units
                        </Badge>
                        {selectedItem.is_transfer && (
                            <div className="small text-muted mt-1">
                              {selectedItem.transfer_from_location === 'stock_available' ? 'Stock → Store' : 'Store → Stock'}
                            </div>
                        )}
                      </Col>
                    </Row>

                    <hr className="my-2" />

                    <h6 className="mt-3">Stock Changes</h6>

                    {/* Current Stock Row with Visual Indicators */}
                    <Row className="mb-2">
                      <Col sm="4" className="text-muted">Current Stock:</Col>
                      <Col sm="8">
                        <div className="mb-1">
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-info" style={{ width: '8px', height: '8px', marginRight: '8px' }}></div>
                            <Database size={12} className="me-1 text-info" />
                            <span className="text-muted small">Stock Available:</span>
                            <span className="fw-medium ms-2 small text-info">{selectedItem.product?.current_stock_available || 0}</span>
                          </div>
                        </div>
                        <div className="mb-1">
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-warning" style={{ width: '8px', height: '8px', marginRight: '8px' }}></div>
                            <Home size={12} className="me-1 text-warning" />
                            <span className="text-muted small">Store Available:</span>
                            <span className="fw-medium ms-2 small text-warning">{selectedItem.product?.current_store_available || 0}</span>
                          </div>
                        </div>
                        <div>
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-primary" style={{ width: '8px', height: '8px', marginRight: '8px' }}></div>
                            <Package size={12} className="me-1 text-primary" />
                            <span className="text-muted small">Total:</span>
                            <span className="fw-bold ms-2 small">{selectedItem.product?.current_stock || 0}</span>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    {/* After Adjustment Row with Visual Indicators */}
                    <Row className="mb-2">
                      <Col sm="4" className="text-muted">After Adjustment:</Col>
                      <Col sm="8">
                        {(() => {
                          const expected = calculateExpectedStock(selectedItem)
                          const isIncrease = selectedItem.adjustment_type === 'increase'
                          const isDecrease = selectedItem.adjustment_type === 'decrease'
                          const isTransfer = selectedItem.adjustment_type === 'transfer'

                          // Calculate safe maximum
                          const safeQuantity = calculateSafeQuantity(selectedItem)
                          const isOverLimit = selectedItem.quantity > safeQuantity

                          return (
                              <>
                                <div className="mb-1">
                                  <div className="d-flex align-items-center">
                                    <div className="rounded-circle bg-info" style={{ width: '8px', height: '8px', marginRight: '8px' }}></div>
                                    <Database size={12} className="me-1 text-info" />
                                    <span className="text-muted small">Stock Available:</span>
                                    <span className={`fw-bold ms-2 small ${
                                        isOverLimit && selectedItem.adjustment_type === 'decrease' && selectedItem.adjustment_location === 'stock_available' ? 'text-danger' : isIncrease ? 'text-success' : isDecrease ? 'text-danger' : isTransfer ? 'text-info' : ''
                                    }`}>
                                {expected.stockAvailAfter}
                                      {expected.stockAvailAfter !== selectedItem.product?.current_stock_available && (
                                          <span className="ms-1">
                                    ({isIncrease ? '+' : isDecrease ? '-' : ''}{Math.abs(expected.stockAvailAfter - (selectedItem.product?.current_stock_available || 0))})
                                  </span>
                                      )}
                                      {isOverLimit && selectedItem.adjustment_type === 'decrease' && selectedItem.adjustment_location === 'stock_available' && (
                                          <span className="ms-1">⚠️</span>
                                      )}
                              </span>
                                  </div>
                                </div>
                                <div className="mb-1">
                                  <div className="d-flex align-items-center">
                                    <div className="rounded-circle bg-warning" style={{ width: '8px', height: '8px', marginRight: '8px' }}></div>
                                    <Home size={12} className="me-1 text-warning" />
                                    <span className="text-muted small">Store Available:</span>
                                    <span className={`fw-bold ms-2 small ${
                                        isOverLimit && selectedItem.adjustment_type === 'decrease' && selectedItem.adjustment_location === 'store_available' ? 'text-danger' : isIncrease ? 'text-success' : isDecrease ? 'text-danger' : isTransfer ? 'text-info' : ''
                                    }`}>
                                {expected.storeAvailAfter}
                                      {expected.storeAvailAfter !== selectedItem.product?.current_store_available && (
                                          <span className="ms-1">
                                    ({isIncrease ? '+' : isDecrease ? '-' : ''}{Math.abs(expected.storeAvailAfter - (selectedItem.product?.current_store_available || 0))})
                                  </span>
                                      )}
                                      {isOverLimit && selectedItem.adjustment_type === 'decrease' && selectedItem.adjustment_location === 'store_available' && (
                                          <span className="ms-1">⚠️</span>
                                      )}
                              </span>
                                  </div>
                                </div>
                                <div>
                                  <div className="d-flex align-items-center">
                                    <div className="rounded-circle bg-primary" style={{ width: '8px', height: '8px', marginRight: '8px' }}></div>
                                    <Package size={12} className="me-1 text-primary" />
                                    <span className="text-muted small">Total:</span>
                                    <span className={`fw-bold ms-2 small ${
                                        isOverLimit ? 'text-danger' : isIncrease ? 'text-success' : isDecrease ? 'text-danger' : isTransfer ? 'text-info' : ''
                                    }`}>
                                {expected.totalAfter}
                                      {expected.totalAfter !== selectedItem.product?.current_stock && (
                                          <span className="ms-1">
                                    ({isIncrease ? '+' : isDecrease ? '-' : ''}{Math.abs(expected.totalAfter - (selectedItem.product?.current_stock || 0))})
                                  </span>
                                      )}
                                      {isOverLimit && (
                                          <span className="ms-1">⚠️</span>
                                      )}
                              </span>
                                  </div>
                                </div>

                                {/* Stock Availability Validation */}
                                {validationResult.canProceed === false && (
                                    <Alert color="danger" className="mt-3">
                                      <div className="d-flex align-items-start">
                                        <AlertCircle size={16} className="me-2 mt-1" />
                                        <div>
                                          <strong>⚠️ Cannot Approve:</strong> {validationResult.message}
                                          <div className="mt-2">
                                            <small>
                                              <div>Maximum allowed: <strong>{validationResult.maxAllowed}</strong> units</div>
                                              <div>Requested: <strong>{selectedItem.quantity}</strong> units</div>
                                              <div className="mt-1 text-danger">
                                                <em>This adjustment cannot be approved with the current stock levels.</em>
                                              </div>
                                            </small>
                                          </div>
                                        </div>
                                      </div>
                                    </Alert>
                                )}

                                {validationResult.canProceed && validationResult.warning && (
                                    <Alert color="warning" className="mt-3">
                                      <div className="d-flex align-items-start">
                                        <AlertCircle size={16} className="me-2 mt-1" />
                                        <div>
                                          <strong>⚠️ Warning:</strong> {validationResult.message}
                                          <div className="mt-2">
                                            <small>
                                              <em>This adjustment may leave stock at critically low levels. Please verify before approving.</em>
                                            </small>
                                          </div>
                                        </div>
                                      </div>
                                    </Alert>
                                )}

                                {/* Low Stock Warning */}
                                {selectedItem.adjustment_type === 'decrease' && validationResult.canProceed && !validationResult.warning && (
                                    (() => {
                                      const currentStock = selectedItem.product?.current_stock || 0
                                      const newStock = currentStock - selectedItem.quantity
                                      if (newStock <= 5) {
                                        return (
                                            <Alert color="warning" className="mt-3">
                                              <div className="d-flex align-items-start">
                                                <AlertCircle size={16} className="me-2 mt-1" />
                                                <div>
                                                  <strong>⚠️ Low Stock Warning:</strong> After this adjustment, total stock will be reduced to <strong>{newStock}</strong> units.
                                                  <div className="mt-2">
                                                    <small>
                                                      <em>Consider if this is acceptable for your inventory levels.</em>
                                                    </small>
                                                  </div>
                                                </div>
                                              </div>
                                            </Alert>
                                        )
                                      }
                                      return null
                                    })()
                                )}

                                {/* Visual Summary */}
                                {isTransfer && (
                                    <div className="mt-2 p-2 bg-light rounded">
                                      <div className="small text-center">
                                        <ArrowRight size={12} className="me-1" />
                                        Transferring {selectedItem.quantity} units from{' '}
                                        {selectedItem.transfer_from_location === 'stock_available' ? 'Stock Available' : 'Store Available'} to{' '}
                                        {selectedItem.transfer_to_location === 'stock_available' ? 'Stock Available' : 'Store Available'}
                                      </div>
                                    </div>
                                )}

                                {/* Suggestion for safe quantity if over limit */}
                                {isOverLimit && validationResult.maxAllowed && validationResult.maxAllowed > 0 && (
                                    <div className="mt-2">
                                      <Button
                                          color="info"
                                          size="sm"
                                          className="d-flex align-items-center"
                                          onClick={() => {
                                            showInfo(`Maximum safe quantity: ${validationResult.maxAllowed} units\n\nPlease reject this request and ask the user to resubmit with a valid quantity.`, {
                                              position: 'top-center',
                                              autoClose: 5000
                                            })
                                          }}
                                      >
                                        <RefreshCw size={14} className="me-1" />
                                        Show Safe Quantity Limit
                                      </Button>
                                    </div>
                                )}
                              </>
                          )
                        })()}
                      </Col>
                    </Row>

                    {/* Reason for adjustment */}
                    {selectedItem.reason && (
                        <Row className="mt-3">
                          <Col sm="4" className="text-muted">Reason:</Col>
                          <Col sm="8">
                            <div className="bg-light p-2 rounded small">
                              {selectedItem.reason}
                            </div>
                          </Col>
                        </Row>
                    )}
                  </div>

                </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
                color={validationResult.canProceed ? "success" : "secondary"}
                onClick={handleApprove}
                disabled={processingAction || !validationResult.canProceed}
                className="d-flex align-items-center"
            >
              {processingAction ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Processing...
                  </>
              ) : (
                  <>
                    <Check size={14} className="me-1" />
                    {validationResult.canProceed ? 'Approve Adjustment' : 'Cannot Approve'}
                  </>
              )}
            </Button>
            <Button
                color="secondary"
                onClick={() => {
                  setApproveModal(false)
                  setValidationResult({ canProceed: true, message: '' })
                }}
                disabled={processingAction}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        {/* Reject Modal */}
        <Modal isOpen={rejectModal} toggle={() => !processingAction && setRejectModal(false)}>
          <ModalHeader toggle={() => !processingAction && setRejectModal(false)}>
            <XCircle size={20} className="me-2 text-danger" />
            Reject Stock Adjustment
          </ModalHeader>
          <ModalBody>
            {selectedItem && (
                <>
                  <div className="mb-3">
                    <h6>Adjustment Details</h6>
                    <Row className="mb-2">
                      <Col sm="4" className="text-muted">Product:</Col>
                      <Col sm="8">
                        <strong>{selectedItem.product?.name || 'N/A'}</strong>
                        <div className="small text-muted">SKU: {selectedItem.product?.sku || 'N/A'}</div>
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col sm="4" className="text-muted">Requested By:</Col>
                      <Col sm="8">
                        <div>{selectedItem.user?.name || 'N/A'}</div>
                        <div className="small text-muted">{selectedItem.user?.email || ''}</div>
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col sm="4" className="text-muted">Adjustment:</Col>
                      <Col sm="8">
                        <Badge color={selectedItem.adjustment_type === 'increase' ? 'success' : selectedItem.adjustment_type === 'decrease' ? 'danger' : 'info'}>
                          {selectedItem.adjustment_type} {selectedItem.quantity} units
                        </Badge>
                        {selectedItem.is_transfer && (
                            <div className="small text-muted mt-1">
                              {selectedItem.transfer_from_location === 'stock_available' ? 'Stock → Store' : 'Store → Stock'}
                            </div>
                        )}
                      </Col>
                    </Row>

                    {/* Stock validation info for rejection */}
                    {(() => {
                      const validation = canAdjustmentBeApproved(selectedItem)
                      if (!validation.canProceed) {
                        return (
                            <Alert color="info" className="mt-3">
                              <div className="d-flex align-items-start">
                                <AlertCircle size={16} className="me-2 mt-1" />
                                <div>
                                  <strong>Stock Issue Detected:</strong> This request cannot be approved due to insufficient stock.
                                  <div className="mt-1">
                                    <small>
                                      Consider rejecting with reason: "Insufficient stock - only {validation.maxAllowed} units available"
                                    </small>
                                  </div>
                                </div>
                              </div>
                            </Alert>
                        )
                      }
                      return null
                    })()}
                  </div>

                </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
                color="danger"
                onClick={handleReject}
                disabled={processingAction}
                className="d-flex align-items-center"
            >
              {processingAction ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Processing...
                  </>
              ) : (
                  <>
                    <X size={14} className="me-1" />
                    Reject Adjustment
                  </>
              )}
            </Button>
            <Button
                color="secondary"
                onClick={() => setRejectModal(false)}
                disabled={processingAction}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
  )
}

export default StockAdjustmentApprove