// src/views/transfer-order/components/TransferHistory.js
import { useState, useEffect } from 'react'
import {
    Card, CardBody, CardHeader, Badge, Spinner,
    Alert, ListGroup, ListGroupItem, Collapse, Button,
    Row, Col
} from 'reactstrap'
import {
    Clock, User, Check, X, Edit, Plus, Trash,
    Package, ArrowRight, RefreshCw, ChevronDown, ChevronUp,
    TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle
} from 'react-feather'
import axios from '../../../utility/axiosIsntance'

const TransferHistory = ({ transferOrderId }) => {
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [expandedItems, setExpandedItems] = useState({})

    const fetchHistory = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`/transfer-orders/${transferOrderId}/histories`)
            setHistory(response.data.data || [])
        } catch (err) {
            console.error('Error fetching transfer history:', err)
            setError('Failed to load transfer history')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (transferOrderId) {
            fetchHistory()
        }
    }, [transferOrderId])

    const toggleExpand = (id) => {
        setExpandedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const getActionIcon = (action) => {
        switch (action) {
            case 'created': return <Plus size={12} />
            case 'updated': return <Edit size={12} />
            case 'status_changed': return <RefreshCw size={12} />
            case 'product_added': return <Plus size={12} />
            case 'product_removed': return <Trash size={12} />
            case 'product_updated': return <Edit size={12} />
            case 'completed': return <Check size={12} />
            case 'canceled': return <X size={12} />
            case 'deleted': return <Trash size={12} />
            default: return <Clock size={12} />
        }
    }

    const getActionColor = (action) => {
        switch (action) {
            case 'created': return 'success'
            case 'updated': return 'info'
            case 'status_changed': return 'warning'
            case 'product_added': return 'success'
            case 'product_removed': return 'danger'
            case 'product_updated': return 'info'
            case 'completed': return 'success'
            case 'canceled': return 'danger'
            case 'deleted': return 'danger'
            default: return 'secondary'
        }
    }

    const parseJsonValue = (value) => {
        try {
            if (!value) return null
            return JSON.parse(value)
        } catch (e) {
            return value
        }
    }

    const formatLocation = (location) => {
        switch (location) {
            case 'stock_available': return 'Stock Available'
            case 'store_available': return 'Store Available'
            default: return location
        }
    }

    const formatProductChanges = (oldValue, newValue) => {
        const oldData = parseJsonValue(oldValue) || {}
        const newData = parseJsonValue(newValue) || {}

        const changes = []

        // Quantity change
        if (oldData.quantity !== undefined && newData.quantity !== undefined && oldData.quantity !== newData.quantity) {
            changes.push({
                field: 'quantity',
                old: oldData.quantity,
                new: newData.quantity,
                icon: oldData.quantity < newData.quantity ? TrendingUp : TrendingDown,
                color: oldData.quantity < newData.quantity ? 'success' : 'danger'
            })
        }

        // From location change
        if (oldData.from_location && newData.from_location && oldData.from_location !== newData.from_location) {
            changes.push({
                field: 'from_location',
                old: formatLocation(oldData.from_location),
                new: formatLocation(newData.from_location),
                icon: ArrowRight,
                color: 'info'
            })
        }

        // To location change
        if (oldData.to_location && newData.to_location && oldData.to_location !== newData.to_location) {
            changes.push({
                field: 'to_location',
                old: formatLocation(oldData.to_location),
                new: formatLocation(newData.to_location),
                icon: ArrowRight,
                color: 'info'
            })
        }

        return changes
    }

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp)
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <div className="text-center py-3">
                <Spinner size="sm" />
                <span className="ml-2">Loading history...</span>
            </div>
        )
    }

    if (error) {
        return (
            <Alert color="danger">
                {error}
            </Alert>
        )
    }

    if (history.length === 0) {
        return (
            <div className="text-center py-3">
                <p className="text-muted">No history available</p>
            </div>
        )
    }

    return (
        <div className="transfer-history">
            <div className="timeline">
                {history.map((item, index) => {
                    const isExpanded = expandedItems[item.id]
                    const changes = item.action === 'product_updated' ? formatProductChanges(item.old_value, item.new_value) : []

                    const hasProductDetails = item.action.includes('product_')
                    const productData = hasProductDetails ? parseJsonValue(item.old_value || item.new_value) : null

                    return (
                        <div key={index} className="timeline-item">
                            <div className="timeline-point">
                                <Badge color={getActionColor(item.action)} className="d-flex align-items-center justify-content-center">
                                    {getActionIcon(item.action)}
                                </Badge>
                            </div>

                            <div className="timeline-content">
                                <div className="timeline-header">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h6 className="mb-0 text-capitalize">
                                                {item.action.replace(/_/g, ' ')}
                                            </h6>
                                            <div className="small text-muted mt-1">
                                                {item.notes}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <small className="text-muted d-block">
                                                {formatTimestamp(item.created_at)}
                                            </small>
                                            <small className="text-muted">
                                                by {item.user?.name || 'System'}
                                            </small>
                                        </div>
                                    </div>
                                </div>

                                {/* Product Details */}
                                {hasProductDetails && productData && (
                                    <div className="product-details mt-2 p-2 bg-light rounded">
                                        <div className="d-flex align-items-center mb-1">
                                            <Package size={12} className="mr-2 text-muted" />
                                            <strong>{productData.product_name || 'Product'}</strong>
                                        </div>

                                        <div className="small">
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">Product ID:</span>
                                                <code>{productData.product_id}</code>
                                            </div>
                                            {productData.quantity && (
                                                <div className="d-flex justify-content-between">
                                                    <span className="text-muted">Quantity:</span>
                                                    <strong>{productData.quantity}</strong>
                                                </div>
                                            )}
                                            {productData.from_location && (
                                                <div className="d-flex justify-content-between">
                                                    <span className="text-muted">From:</span>
                                                    <Badge color="info" pill>
                                                        {formatLocation(productData.from_location)}
                                                    </Badge>
                                                </div>
                                            )}
                                            {productData.to_location && (
                                                <div className="d-flex justify-content-between">
                                                    <span className="text-muted">To:</span>
                                                    <Badge color="warning" pill>
                                                        {formatLocation(productData.to_location)}
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Show Changes */}
                                {changes.length > 0 && (
                                    <div className="changes-container mt-2">
                                        <strong className="small d-block mb-2">Changes:</strong>
                                        <div className="changes-list">
                                            {changes.map((change, idx) => (
                                                <div key={idx} className="change-item mb-2">
                                                    <div className="d-flex align-items-center mb-1">
                                                        {change.field === 'quantity' ? (
                                                            <Package size={12} className="mr-2" />
                                                        ) : (
                                                            <ArrowRight size={12} className="mr-2" />
                                                        )}
                                                        <span className="text-capitalize font-weight-bold mr-2">
                                                            {change.field.replace('_', ' ')}:
                                                        </span>
                                                        <Badge color="light" className="text-dark mr-2">
                                                            {change.old}
                                                        </Badge>
                                                        <ArrowRight size={12} className="mr-2 text-muted" />
                                                        <Badge color={change.color} className="text-white">
                                                            {change.new}
                                                        </Badge>
                                                        {change.field === 'quantity' && (
                                                            <Badge
                                                                color={change.color === 'success' ? 'success' : 'danger'}
                                                                className="ml-2"
                                                                pill
                                                            >
                                                                {change.new > change.old ? '+' : ''}{change.new - change.old}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Detailed JSON View */}
                                {(item.old_value || item.new_value) && (
                                    <div className="mt-2">
                                        <Button
                                            size="sm"
                                            color="link"
                                            className="p-0 d-flex align-items-center"
                                            onClick={() => toggleExpand(item.id)}
                                        >
                                            {isExpanded ? (
                                                <>
                                                    <ChevronUp size={12} className="mr-1" />
                                                    Hide Details
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronDown size={12} className="mr-1" />
                                                    Show Raw Data
                                                </>
                                            )}
                                        </Button>

                                        <Collapse isOpen={isExpanded}>
                                            <div className="mt-2 p-2 bg-dark text-white rounded small">
                                                {item.field && (
                                                    <div className="mb-1">
                                                        <strong>Field:</strong> {item.field}
                                                    </div>
                                                )}
                                                {item.old_value && (
                                                    <div className="mb-1">
                                                        <strong>Old Value:</strong>
                                                        <pre className="mt-1 mb-0 p-1 bg-dark text-light border rounded">
                                                            {JSON.stringify(parseJsonValue(item.old_value), null, 2)}
                                                        </pre>
                                                    </div>
                                                )}
                                                {item.new_value && (
                                                    <div>
                                                        <strong>New Value:</strong>
                                                        <pre className="mt-1 mb-0 p-1 bg-dark text-light border rounded">
                                                            {JSON.stringify(parseJsonValue(item.new_value), null, 2)}
                                                        </pre>
                                                    </div>
                                                )}
                                            </div>
                                        </Collapse>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            <style jsx>{`
                .transfer-history {
                    position: relative;
                }
                .timeline {
                    position: relative;
                    padding-left: 40px;
                }
                .timeline::before {
                    content: '';
                    position: absolute;
                    left: 15px;
                    top: 0;
                    bottom: 0;
                    width: 2px;
                    background-color: #dee2e6;
                }
                .timeline-item {
                    position: relative;
                    margin-bottom: 30px;
                }
                .timeline-point {
                    position: absolute;
                    left: -40px;
                    top: 0;
                    width: 32px;
                    height: 32px;
                }
                .timeline-content {
                    background: #fff;
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                    padding: 15px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                .timeline-header {
                    margin-bottom: 10px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #f8f9fa;
                }
                .product-details {
                    border-left: 3px solid #7367f0;
                }
                .changes-container {
                    border-top: 1px dashed #dee2e6;
                    padding-top: 10px;
                }
                .change-item {
                    padding: 8px;
                    background: #f8f9fa;
                    border-radius: 6px;
                    border-left: 3px solid #7367f0;
                }
                pre {
                    font-size: 10px;
                    max-height: 200px;
                    overflow-y: auto;
                }
            `}</style>
        </div>
    )
}

export default TransferHistory