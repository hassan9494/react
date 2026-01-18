import React, { useState, useEffect, useRef } from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Badge,
  Spinner,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  UncontrolledTooltip
} from 'reactstrap'
import {
  Plus,
  Minus,
  Search,
  AlertCircle,
  CheckCircle,
  XCircle,
  Package,
  Users,
  ChevronsUp,
  ChevronsDown,
  Clock,
  User,
  RefreshCw,
  ArrowRight,
  ArrowLeft
} from 'react-feather'
import Select from 'react-select'
import Datatable from '../../@core/components/datatable'
import { api as productApi } from '../../data/use-product'
import { api as userApi } from '../../data/use-user'
import { useStockAdjustmentDatatable } from '../../data/use-stock-adjustment-datatable'
import { api as stockAdjustmentApi } from '../../data/use-stock-adjustment'
import { getCurrentUser, isCurrentUserAdmin } from '../../data/use-auth'
import { showError, showSuccess } from '../../utility/Utils'
import Avatar from '../../@core/components/avatar'
import AsyncSelect from 'react-select/async/dist/react-select.esm'

const StockAdjustmentRequest = () => {
  const [activeTab, setActiveTab] = useState('1')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Adjustment settings
  const [adjustmentType, setAdjustmentType] = useState('increase') // 'increase', 'decrease', 'transfer'
  const [adjustmentLocation, setAdjustmentLocation] = useState('total') // 'total', 'stock_available', 'store_available'
  const [transferFromLocation, setTransferFromLocation] = useState('stock_available')
  const [transferToLocation, setTransferToLocation] = useState('store_available')

  const [quantity, setQuantity] = useState('')
  const [reason, setReason] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)
  const [users, setUsers] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [defaultOptions, setDefaultOptions] = useState([])
  const optionsCache = useRef(new Map())

  // For product search
  const [productSearchInput, setProductSearchInput] = useState('')
  // const debounceTimeout = useRef(null)

  // Location mapping for integer values
  const locationMap = {
    stock_available: 1,
    store_available: 2
  }

  // Reverse mapping for display
  const reverseLocationMap = {
    1: 'stock_available',
    2: 'store_available'
  }

  useEffect(() => {
    const checkAdmin = async () => {
      setIsAdmin(isCurrentUserAdmin())
      const user = getCurrentUser()
      setCurrentUser(user)
    }
    checkAdmin()
  }, [])

  // Load users for filter (admin only)
  const loadUsers = async () => {
    try {
      const results = await userApi.autocomplete('')
      const formattedUsers = results.map(user => ({
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

  const resetForm = () => {
    setSelectedProduct(null)
    setAdjustmentType('increase')
    setAdjustmentLocation('total')
    setTransferFromLocation('stock_available')
    setTransferToLocation('store_available')
    setQuantity('')
    setReason('')
    setProductSearchInput('')
    setProducts([])
  }


  const loadInitialOptions = async () => {
    const cacheKey = 'initial'
    if (optionsCache.current.has(cacheKey)) {
      setDefaultOptions(optionsCache.current.get(cacheKey))
      return
    }

    try {
      const data = await productApi.autocomplete('')
      const options = data.map((product) => {
        const stockValue = product.stock || product.current_stock || product.quantity || 0
        const stockAvailable = product.stock_available || product.current_stock_available || 0
        const storeAvailable = product.store_available || product.current_store_available || 0
        const skuValue = product.sku || 'N/A'
        const productName = product.name || 'Unknown Product'
        const imageUrl = product.image || '/static/images/placeholder.png'

        return {
          label: (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                    src={imageUrl}
                    alt={productName}
                    height="32"
                    width="32"
                    style={{ marginRight: '10px', borderRadius: '4px' }}
                />
                <div>
                  <div style={{ fontWeight: 'bold' }}>{productName}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    SKU: {skuValue} | Stock: {stockValue} | Stock Avail: {stockAvailable}
                  </div>
                </div>
              </div>
          ),
          value: product.id,
          item: {
            ...product,
            id: product.id,
            stock: stockValue,
            stock_available: stockAvailable,
            store_available: storeAvailable,
            name: productName,
            sku: skuValue,
            image: imageUrl
          }
        }
      })

      optionsCache.current.set(cacheKey, options)
      setDefaultOptions(options)
    } catch (error) {
      console.error('Failed to load initial options:', error)
      setDefaultOptions([])
    }
  }

  const promiseOptions = async (inputValue) => {
    // Return cached results if available
    const cacheKey = inputValue || 'empty'
    if (optionsCache.current.has(cacheKey)) {
      return optionsCache.current.get(cacheKey)
    }

    try {
      setLoading(true)
      const data = await productApi.autocomplete(inputValue)
      const options = data.map((product) => {
        const stockValue = product.stock || product.current_stock || product.quantity || 0
        const stockAvailable = product.stock_available || product.current_stock_available || 0
        const storeAvailable = product.store_available || product.current_store_available || 0
        const skuValue = product.sku || 'N/A'
        const productName = product.name || 'Unknown Product'
        const imageUrl = product.image || '/static/images/placeholder.png'

        return {
          label: (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                    src={imageUrl}
                    alt={productName}
                    height="32"
                    width="32"
                    style={{ marginRight: '10px', borderRadius: '4px' }}
                />
                <div>
                  <div style={{ fontWeight: 'bold' }}>{productName}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    SKU: {skuValue} | Stock: {stockValue} | Stock Avail: {stockAvailable}
                  </div>
                </div>
              </div>
          ),
          value: product.id,
          item: {
            ...product,
            id: product.id,
            stock: stockValue,
            stock_available: stockAvailable,
            store_available: storeAvailable,
            name: productName,
            sku: skuValue,
            image: imageUrl
          }
        }
      })

      // Cache the results
      optionsCache.current.set(cacheKey, options)
      return options
    } catch (error) {
      console.error('Failed to load options:', error)
      return []
    } finally {
      setLoading(false)
    }
  }
  const handleProductSearchInput = (inputValue) => {
    setProductSearchInput(inputValue)
  }

  const handleProductSelect = async (selectedOption) => {
    console.log('Selected product option:', selectedOption)

    if (selectedOption) {
      try {
        // First set the product from autocomplete
        const tempProduct = {
          ...selectedOption.item,
          isFullProduct: false
        }
        setSelectedProduct(tempProduct)

        // Then fetch full product details
        console.log('Fetching full product details for ID:', selectedOption.value)

        let fullProduct
        try {
          fullProduct = await productApi.show(selectedOption.value)
          console.log('Full product API response:', fullProduct)
        } catch (apiError) {
          console.error('productApi.show failed:', apiError)
          // If API doesn't exist, use the autocomplete data
          fullProduct = selectedOption.item
        }

        if (fullProduct) {
          console.log('Stock fields in full product:', {
            stock: fullProduct.stock,
            stock_available: fullProduct.stock_available,
            store_available: fullProduct.store_available,
            hasStockAvailable: 'stock_available' in fullProduct,
            hasStoreAvailable: 'store_available' in fullProduct
          })

          const formattedProduct = {
            ...fullProduct,
            id: fullProduct.id,
            stock: fullProduct.stock || 0,
            stock_available: fullProduct.stock_available || 0,
            store_available: fullProduct.store_available || 0,
            name: fullProduct.name || 'Unknown Product',
            sku: fullProduct.sku || 'N/A',
            image: fullProduct.image || '/static/images/placeholder.png',
            isFullProduct: true
          }

          console.log('Setting formatted product:', formattedProduct)
          setSelectedProduct(formattedProduct)
        }
      } catch (error) {
        console.error('Error in handleProductSelect:', error)
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        })
        // Keep the autocomplete product as fallback
      }
    } else {
      setSelectedProduct(null)
      setProductSearchInput('')
    }
  }

// Add this useEffect after the other useEffects
  useEffect(() => {
    loadInitialOptions()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedProduct || !quantity || quantity <= 0) {
      showError('Please select a product and enter valid quantity')
      return
    }
    const quantityNum = parseInt(quantity)
    const currentStock = selectedProduct.stock || 0
    const currentStockAvailable = selectedProduct.stock_available || 0
    const currentStoreAvailable = selectedProduct.store_available || 0

    // Validate decrease operations
    if (adjustmentType === 'decrease') {
      let maxAllowed = 0

      if (adjustmentLocation === 'total') {
        maxAllowed = currentStockAvailable + currentStoreAvailable
      } else if (adjustmentLocation === 'stock_available') {
        maxAllowed = currentStockAvailable
      } else if (adjustmentLocation === 'store_available') {
        maxAllowed = currentStoreAvailable
      }

      if (quantityNum > maxAllowed) {
        showError(`Cannot decrease more than available stock. Maximum allowed: ${maxAllowed}`)
        setQuantity(maxAllowed.toString())
        return
      }
      if (quantityNum > maxAllowed) {
        showError(`Cannot decrease more than available stock. Maximum allowed: ${maxAllowed}`)
        setQuantity(maxAllowed.toString())
        return
      }
    }


    try {
      setFormLoading(true)

      const requestData = {
        product_id: selectedProduct.id, // Changed from selectedProduct.value to selectedProduct.id
        adjustment_type: adjustmentType,
        quantity: parseInt(quantity),
        reason: reason || null
      }

      // Add location-specific data with integer mapping for transfers
      if (adjustmentType === 'transfer') {
        // Map string locations to integers
        requestData.transfer_from_location = locationMap[transferFromLocation]
        requestData.transfer_to_location = locationMap[transferToLocation]
      } else {
        requestData.adjustment_location = adjustmentLocation
      }

      console.log('Submitting request data:', requestData)

      await stockAdjustmentApi.create(requestData)

      showSuccess('Stock adjustment request submitted successfully! Waiting for approval.')
      resetForm()
    } catch (error) {
      console.error('Submit error:', error)
      showError(`Failed to submit request: ${error.response?.data?.message || error.message}`)
    } finally {
      setFormLoading(false)
    }
  }
// Add a function to calculate maximum allowed quantity
  const getMaxAllowedQuantity = () => {
    if (!selectedProduct) return 0

    const currentStock = selectedProduct.stock || 0
    const currentStockAvailable = selectedProduct.stock_available || 0
    const currentStoreAvailable = selectedProduct.store_available || 0

    if (adjustmentType === 'increase') {
      return Infinity // No limit for increase
    } else if (adjustmentType === 'decrease') {
      switch (adjustmentLocation) {
        case 'total':
          return currentStockAvailable + currentStoreAvailable
        case 'stock_available':
          return currentStockAvailable
        case 'store_available':
          return currentStoreAvailable
        default:
          return 0
      }
    } else if (adjustmentType === 'transfer') {
      if (transferFromLocation === 'stock_available') {
        return currentStockAvailable
      } else {
        return currentStoreAvailable
      }
    }

    return 0
  }

// Add a useEffect to automatically correct quantity when inputs change
  useEffect(() => {
    if (!selectedProduct || !quantity || quantity <= 0) return

    const quantityNum = parseInt(quantity)
    const maxAllowed = getMaxAllowedQuantity()

    // Only auto-correct for decrease and transfer operations
    if ((adjustmentType === 'decrease' || adjustmentType === 'transfer') &&
        quantityNum > maxAllowed &&
        maxAllowed > 0) {
      setQuantity(maxAllowed.toString())

      // Show a notification that quantity was adjusted
      if (adjustmentType === 'decrease') {
        showError(`Quantity adjusted to maximum available: ${maxAllowed}`, {
          autoClose: 3000,
          type: 'warning'
        })
      } else {
        showError(`Transfer quantity adjusted to maximum available in source: ${maxAllowed}`, {
          autoClose: 3000,
          type: 'warning'
        })
      }
    }
  }, [quantity, selectedProduct, adjustmentType, adjustmentLocation, transferFromLocation])


  const calculateNewStock = () => {
    if (!selectedProduct || !quantity) return null

    const currentStock = selectedProduct.stock || 0
    const currentStockAvailable = selectedProduct.stock_available || 0
    const currentStoreAvailable = selectedProduct.store_available || 0
    const quantityNum = parseInt(quantity)

    if (isNaN(quantityNum)) return {
      total: currentStock,
      stock_available: currentStockAvailable,
      store_available: currentStoreAvailable
    }

    // Get actual quantity (respecting max limits)
    const actualQuantity = Math.min(quantityNum, getMaxAllowedQuantity())

    if (adjustmentType === 'transfer') {
      if (transferFromLocation === 'stock_available') {
        const transferQty = Math.min(actualQuantity, currentStockAvailable)
        return {
          total: currentStock,
          stock_available: Math.max(0, currentStockAvailable - transferQty),
          store_available: currentStoreAvailable + transferQty
        }
      } else {
        const transferQty = Math.min(actualQuantity, currentStoreAvailable)
        return {
          total: currentStock,
          stock_available: currentStockAvailable + transferQty,
          store_available: Math.max(0, currentStoreAvailable - transferQty)
        }
      }
    } else if (adjustmentType === 'increase') {
      if (adjustmentLocation === 'total') {
        return {
          total: currentStock + actualQuantity,
          stock_available: currentStockAvailable,
          store_available: currentStoreAvailable + actualQuantity
        }
      } else if (adjustmentLocation === 'stock_available') {
        return {
          total: currentStock + actualQuantity,
          stock_available: currentStockAvailable + actualQuantity,
          store_available: currentStoreAvailable
        }
      } else { // store_available
        return {
          total: currentStock + actualQuantity,
          stock_available: currentStockAvailable,
          store_available: currentStoreAvailable + actualQuantity
        }
      }
    } else { // decrease
      let decreaseQty = actualQuantity

      if (adjustmentLocation === 'total') {
        // Ensure we don't try to decrease more than total available
        decreaseQty = Math.min(actualQuantity, currentStockAvailable + currentStoreAvailable)

        // Default: take from store_available first
        let newStockAvailable = currentStockAvailable
        let newStoreAvailable = currentStoreAvailable

        if (currentStoreAvailable >= decreaseQty) {
          newStoreAvailable = currentStoreAvailable - decreaseQty
        } else {
          const remaining = decreaseQty - currentStoreAvailable
          newStoreAvailable = 0
          newStockAvailable = Math.max(0, currentStockAvailable - remaining)
        }

        return {
          total: Math.max(0, currentStock - decreaseQty),
          stock_available: newStockAvailable,
          store_available: newStoreAvailable
        }
      } else if (adjustmentLocation === 'stock_available') {
        decreaseQty = Math.min(actualQuantity, currentStockAvailable)
        return {
          total: Math.max(0, currentStock - decreaseQty),
          stock_available: Math.max(0, currentStockAvailable - decreaseQty),
          store_available: currentStoreAvailable
        }
      } else { // store_available
        decreaseQty = Math.min(actualQuantity, currentStoreAvailable)
        return {
          total: Math.max(0, currentStock - decreaseQty),
          stock_available: currentStockAvailable,
          store_available: Math.max(0, currentStoreAvailable - decreaseQty)
        }
      }
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

  // Define columns
  const columns = [
    {
      name: 'Name',
      selector: row => row.product?.name,
      sortable: true,
      minWidth: '400px',
      cell: row => {
        const productName = row.product?.name || row.name || 'N/A'
        const imageUrl = row.product?.image || row.image

        return (
            <div className='d-flex align-items-center'>
              <Avatar
                  img={imageUrl}
                  className="mr-2"
                  imgHeight={32}
                  imgWidth={32}

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
    ...(isAdmin ? [
      {
        name: 'Requested By',
        selector: row => row.user?.name,
        sortable: true,
        minWidth: '150px',
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
      }
    ] : []),
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
          // Convert integer locations back to string for display
          const fromLocation = reverseLocationMap[row.transfer_from_location] || row.transfer_from_location
          const toLocation = reverseLocationMap[row.transfer_to_location] || row.transfer_to_location

          return (
              <div className="small">
                <div>Transfer</div>
                <div className="text-muted">
                  {fromLocation === 'stock_available' ? 'Stock → Store' : 'Store → Stock'}
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
                  <span className="text-muted">Stock:</span>
                  <span className="fw-bold">
                  {row.historical_stock_before !== 'N/A' ? `${row.historical_stock_before} → ${row.historical_stock_after}` : 'N/A → N/A'}
                </span>
                </div>
              </div>
          )
        } else {
          // For pending items, calculate expected values
          // Need to calculate expected stock_available_after and store_available_after
          const calculateExpectedValues = () => {
            if (!row.expected_stock_before) return { stockAvailAfter: '?', storeAvailAfter: '?' }

            const stockBefore = row.expected_stock_before
            const stockAvailBefore = row.expected_stock_available_before
            const storeAvailBefore = row.expected_store_available_before
            const quantity = row.quantity

            if (row.adjustment_type === 'transfer') {
              // Convert integer locations back to string for calculation
              const fromLocation = reverseLocationMap[row.transfer_from_location] || row.transfer_from_location
              const toLocation = reverseLocationMap[row.transfer_to_location] || row.transfer_to_location

              if (fromLocation === 'stock_available') {
                return {
                  stockAvailAfter: stockAvailBefore - quantity,
                  storeAvailAfter: storeAvailBefore + quantity
                }
              } else {
                return {
                  stockAvailAfter: stockAvailBefore + quantity,
                  storeAvailAfter: storeAvailBefore - quantity
                }
              }
            } else if (row.adjustment_type === 'increase') {
              if (row.adjustment_location === 'total') {
                return {
                  stockAvailAfter: stockAvailBefore,
                  storeAvailAfter: storeAvailBefore + quantity
                }
              } else if (row.adjustment_location === 'stock_available') {
                return {
                  stockAvailAfter: stockAvailBefore + quantity,
                  storeAvailAfter: storeAvailBefore
                }
              } else { // store_available
                return {
                  stockAvailAfter: stockAvailBefore,
                  storeAvailAfter: storeAvailBefore + quantity
                }
              }
            } else { // decrease
              if (row.adjustment_location === 'total') {
                // Take from store_available first
                if (storeAvailBefore >= quantity) {
                  return {
                    stockAvailAfter: stockAvailBefore,
                    storeAvailAfter: storeAvailBefore - quantity
                  }
                } else {
                  const remaining = quantity - storeAvailBefore
                  return {
                    stockAvailAfter: Math.max(0, stockAvailBefore - remaining),
                    storeAvailAfter: 0
                  }
                }
              } else if (row.adjustment_location === 'stock_available') {
                return {
                  stockAvailAfter: Math.max(0, stockAvailBefore - quantity),
                  storeAvailAfter: storeAvailBefore
                }
              } else { // store_available
                return {
                  stockAvailAfter: stockAvailBefore,
                  storeAvailAfter: Math.max(0, storeAvailBefore - quantity)
                }
              }
            }
          }

          const expected = calculateExpectedValues()

          return (
              <div className="small">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Stock Avail:</span>
                  <span>{row.expected_stock_available_before || 0} → {expected.stockAvailAfter}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Store Avail:</span>
                  <span>{row.expected_store_available_before || 0} → {expected.storeAvailAfter}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Total:</span>
                  <span className="fw-bold">{row.expected_stock_before || 0} → {row.expected_stock_after || 0}</span>
                </div>
              </div>
          )
        }
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
    }
  ]

  const handleFilterReset = () => {
    setSearchTerm('')
    setSelectedUser(null)
    setStartDate('')
    setEndDate('')
    setFilterStatus('all')
  }

  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ]

  const newStock = calculateNewStock()
  const currentStock = selectedProduct ? (selectedProduct.stock || 0) : 0
  const currentStockAvailable = selectedProduct ? (selectedProduct.stock_available || 0) : 0
  const currentStoreAvailable = selectedProduct ? (selectedProduct.store_available || 0) : 0

  // // Clean up timeout on unmount
  // useEffect(() => {
  //   return () => {
  //     if (debounceTimeout.current) {
  //       clearTimeout(debounceTimeout.current)
  //     }
  //   }
  // }, [])

  return (
      <div>
        <Card>
          <CardHeader>
            <Row className="align-items-center">
              <Col>
                <h4 className="mb-0">
                  {isAdmin ? 'All Stock Adjustment Requests' : 'My Stock Adjustment Requests'}
                </h4>
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <Nav tabs className="mb-1">
              <NavItem>
                <NavLink
                    className={activeTab === '1' ? 'active' : ''}
                    onClick={() => setActiveTab('1')}
                >
                  <Package size={16} className="me-1" />
                  {isAdmin ? 'All Requests' : 'My Requests'}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                    className={activeTab === '2' ? 'active' : ''}
                    onClick={() => setActiveTab('2')}
                >
                  <Plus size={16} className="me-1" />
                  New Request
                </NavLink>
              </NavItem>
            </Nav>

            <TabContent activeTab={activeTab}>
              {/* Tab 1: Requests List */}
              <TabPane tabId="1">
                {/* Filter Bar */}
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

                {/* Use the same Datatable component */}
                <Datatable
                    useDatatable={useStockAdjustmentDatatable}
                    columns={columns}
                    title={isAdmin ? "All Stock Adjustment Requests" : "My Stock Adjustment Requests"}
                    hasSearch={true}
                    conditions={{
                      status: filterStatus !== 'all' ? filterStatus : '',
                      user_id: selectedUser?.value || ''
                    }}
                    dateRange={{
                      startDate,
                      endDate
                    }}
                    isSticky={true}
                    initialOrder={{ column: 'created_at', dir: 'desc' }}
                />
              </TabPane>

              {/* Tab 2: New Request Form */}
              <TabPane tabId="2">
                <Card>
                  <CardBody>
                    <Form onSubmit={handleSubmit}>
                      <Row>

                        <Col md="6">
                          <FormGroup>
                            <Label for="product-search">Search Product *</Label>
                            <AsyncSelect
                                id="product-search"
                                isClearable={true}
                                className='react-select'
                                classNamePrefix='select'
                                value={selectedProduct ? {
                                  value: selectedProduct.id,
                                  label: selectedProduct.name,
                                  item: selectedProduct
                                } : null}
                                loadOptions={promiseOptions}
                                defaultOptions={defaultOptions}
                                cacheOptions
                                onChange={handleProductSelect}
                                onInputChange={handleProductSearchInput}
                                placeholder="Search for products..."
                                isLoading={loading}
                                noOptionsMessage={({ inputValue }) => {
                                  if (!inputValue || inputValue.trim() === '') {
                                    return "Start typing to search products"
                                  }
                                  if (loading) {
                                    return "Searching..."
                                  }
                                  return "No products found"
                                }}
                                filterOption={null}
                                formatOptionLabel={(option, { context }) => {
                                  // When in the menu (dropdown), show the full JSX label
                                  if (context === 'menu') {
                                    return option.label
                                  }
                                  // When selected (in the input), just show the name
                                  return option.item ? option.item.name : option.label
                                }}
                                styles={{
                                  control: (base) => ({
                                    ...base,
                                    minHeight: '42px'
                                  }),
                                  menu: (base) => ({
                                    ...base,
                                    zIndex: 9999
                                  })
                                }}
                            />
                          </FormGroup>
                        </Col>

                        <Col md="6">
                          <FormGroup>
                            <Label>Current Stock Distribution</Label>
                            <div className="bg-light p-2 rounded">
                              {selectedProduct && selectedProduct.image && (
                                  <div className="d-flex align-items-center mb-2">
                                    <img
                                        src={selectedProduct.image}
                                        alt={selectedProduct.name}
                                        height="40"
                                        width="40"
                                        className="mr-2 rounded"
                                        onError={(e) => {
                                          e.target.src = '/static/images/placeholder.png'
                                        }}
                                    />
                                    <a
                                        className='text-dark font-weight-bold'
                                        href={`${process.env.REACT_APP_WEBSITE}/product/${selectedProduct.name.replace(/\s+/g, '-').toLowerCase()}`}
                                        target='_blank'
                                        rel="noopener noreferrer"
                                    >
                                      {selectedProduct.name}
                                    </a>        </div>
                              )}
                              <div className="d-flex justify-content-between">
                                <span>Total Stock:</span>
                                <strong>{currentStock}</strong>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span>Stock Available:</span>
                                <strong className="text-info">{currentStockAvailable}</strong>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span>Store Available:</span>
                                <strong className="text-warning">{currentStoreAvailable}</strong>
                              </div>
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>

                      {selectedProduct && (
                          <>
                            <Row className="mt-0">
                              <Col md="4">
                                <FormGroup>
                                  <Label>Adjustment Type *</Label>
                                  <div className="d-flex flex-column gap-2">
                                    <div className="d-flex gap-2">
                                      <Button
                                          color={adjustmentType === 'increase' ? 'success' : 'outline-success'}
                                          onClick={() => {
                                            setAdjustmentType('increase')
                                            setAdjustmentLocation('total')
                                          }}
                                          className="flex-fill"
                                          outline={adjustmentType !== 'increase'}
                                      >
                                        <Plus size={16} className="me-1" />
                                        Increase
                                      </Button>
                                      <Button
                                          color={adjustmentType === 'decrease' ? 'danger' : 'outline-danger'}
                                          onClick={() => {
                                            setAdjustmentType('decrease')
                                            setAdjustmentLocation('total')
                                          }}
                                          className="flex-fill"
                                          outline={adjustmentType !== 'decrease'}
                                      >
                                        <Minus size={16} className="me-1" />
                                        Decrease
                                      </Button>
                                    </div>
                                    <Button
                                        color={adjustmentType === 'transfer' ? 'info' : 'outline-info'}
                                        onClick={() => setAdjustmentType('transfer')}
                                        outline={adjustmentType !== 'transfer'}
                                    >
                                      <ArrowRight size={16} className="me-1" />
                                      Transfer Between Locations
                                    </Button>
                                  </div>
                                </FormGroup>
                              </Col>

                              <Col md="4">
                                <FormGroup>
                                  <Label for="quantity">Quantity *</Label>
                                  <Input
                                      id="quantity"
                                      type="number"
                                      value={quantity}
                                      onChange={e => {
                                        const value = e.target.value
                                        const maxAllowed = getMaxAllowedQuantity()

                                        // Prevent entering values greater than max allowed
                                        if (value && parseInt(value) > maxAllowed) {
                                          setQuantity(maxAllowed.toString())
                                        } else {
                                          setQuantity(value)
                                        }
                                      }}
                                      onBlur={() => {
                                        // Auto-correct on blur
                                        const quantityNum = parseInt(quantity)
                                        const maxAllowed = getMaxAllowedQuantity()

                                        if ((adjustmentType === 'decrease' || adjustmentType === 'transfer') &&
                                            quantityNum > maxAllowed &&
                                            maxAllowed > 0) {
                                          setQuantity(maxAllowed.toString())
                                        }
                                      }}
                                      min="1"
                                      max={adjustmentType === 'increase' ? undefined : getMaxAllowedQuantity()}
                                      required
                                      placeholder="Enter quantity"
                                      disabled={formLoading}
                                  />
                                  {(adjustmentType === 'decrease' || adjustmentType === 'transfer') && (
                                      <small className="text-muted d-block mt-1">
                                        Maximum allowed: {getMaxAllowedQuantity()}
                                      </small>
                                  )}
                                </FormGroup>
                              </Col>

                              <Col md="4">
                                <FormGroup>
                                  <Label>New Stock After Adjustment</Label>
                                  {newStock && (
                                      <div className="bg-light p-2 rounded">
                                        <div className="d-flex justify-content-between">
                                          <span>Total Stock:</span>
                                          <strong className={newStock.total < 0 ? 'text-danger' : ''}>
                                            {newStock.total}
                                          </strong>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                          <span>Stock Available:</span>
                                          <strong className={newStock.stock_available < 0 ? 'text-danger' : 'text-info'}>
                                            {newStock.stock_available}
                                          </strong>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                          <span>Store Available:</span>
                                          <strong className={newStock.store_available < 0 ? 'text-danger' : 'text-warning'}>
                                            {newStock.store_available}
                                          </strong>
                                        </div>
                                      </div>
                                  )}
                                </FormGroup>
                              </Col>
                            </Row>

                            {/* Adjustment Location/Transfer Settings */}
                            <Row className="mt-3">
                              <Col md="12">
                                {adjustmentType === 'transfer' ? (
                                    <FormGroup>
                                      <Label>Transfer Details</Label>
                                      <div className="d-flex align-items-center gap-3">
                                        <div className="d-flex align-items-center">
                                          <select
                                              className="form-select"
                                              value={transferFromLocation}
                                              onChange={(e) => setTransferFromLocation(e.target.value)}
                                          >
                                            <option value="stock_available">Stock Available</option>
                                            <option value="store_available">Store Available</option>
                                          </select>
                                          <ArrowRight size={20} className="mx-3" />
                                          <select
                                              className="form-select"
                                              value={transferToLocation}
                                              onChange={(e) => setTransferToLocation(e.target.value)}
                                          >
                                            <option value="store_available">Store Available</option>
                                            <option value="stock_available">Stock Available</option>
                                          </select>
                                        </div>
                                        <div className="text-muted">
                                          Transfer {quantity || 0} units from {transferFromLocation === 'stock_available' ? 'Stock Available' : 'Store Available'} to {transferToLocation === 'stock_available' ? 'Stock Available' : 'Store Available'}
                                        </div>
                                      </div>
                                    </FormGroup>
                                ) : (
                                    <FormGroup>
                                      <Label>Adjustment Location</Label>
                                      <div className="d-flex gap-2">
                                        <Button
                                            color={adjustmentLocation === 'total' ? 'primary' : 'outline-primary'}
                                            onClick={() => setAdjustmentLocation('total')}
                                            outline={adjustmentLocation !== 'total'}
                                        >
                                          Total Stock
                                        </Button>
                                        <Button
                                            color={adjustmentLocation === 'stock_available' ? 'info' : 'outline-info'}
                                            onClick={() => setAdjustmentLocation('stock_available')}
                                            outline={adjustmentLocation !== 'stock_available'}
                                        >
                                          Stock Available Only
                                        </Button>
                                        <Button
                                            color={adjustmentLocation === 'store_available' ? 'warning' : 'outline-warning'}
                                            onClick={() => setAdjustmentLocation('store_available')}
                                            outline={adjustmentLocation !== 'store_available'}
                                        >
                                          Store Available Only
                                        </Button>
                                      </div>
                                      <small className="text-muted">
                                        {adjustmentType === 'increase' ? 'Increase' : 'Decrease'} {adjustmentLocation === 'total' ? 'total stock' : adjustmentLocation === 'stock_available' ? 'stock available only' : 'store available only'}
                                      </small>
                                    </FormGroup>
                                )}
                              </Col>
                            </Row>
                            <div className="d-flex gap-2 mt-3">
                              <Button
                                  type="submit"
                                  color="primary"
                                  disabled={!selectedProduct || !quantity || quantity <= 0 || formLoading}
                              >
                                {formLoading ? (
                                    <>
                                      <Spinner size="sm" className="me-2" />
                                      Submitting...
                                    </>
                                ) : (
                                    'Submit Request'
                                )}
                              </Button>
                              <Button type="button" color="secondary" onClick={resetForm} disabled={formLoading}>
                                Clear Form
                              </Button>
                            </div>
                          </>
                      )}
                    </Form>
                  </CardBody>
                </Card>
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </div>
  )
}

export default StockAdjustmentRequest