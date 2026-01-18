// src/views/transfer-order/components/StockImpactSummary.js
import { useState } from 'react'
import {
    Card,
    CardBody,
    Badge,
    Row,
    Col,
    Button,
    Collapse
} from 'reactstrap'
import {
    TrendingUp,
    TrendingDown,
    Minus,
    Package,
    ChevronDown,
    ChevronUp,
    BarChart2,
    AlertTriangle,
    CheckCircle
} from 'react-feather'

const StockImpactSummary = ({
                                transferOrder,
                                products = [],
                                className = '',
                                title = "Stock Transfer Summary"
                            }) => {
    const [isOpen, setIsOpen] = useState(true)

    if (!products || products.length === 0) {
        return null
    }

    const calculateTotalImpact = () => {
        let totalStockDiff = 0
        let totalStoreDiff = 0
        let totalQuantity = 0
        let stockToStoreCount = 0
        let storeToStockCount = 0

        products.forEach(product => {
            const quantity = parseInt(product.quantity || 0)

            // Count transfer types
            if (product.from_location === 'stock_available' && product.to_location === 'store_available') {
                stockToStoreCount++
                totalStockDiff -= quantity
                totalStoreDiff += quantity
            } else if (product.from_location === 'store_available' && product.to_location === 'stock_available') {
                storeToStockCount++
                totalStoreDiff -= quantity
                totalStockDiff += quantity
            }

            totalQuantity += quantity
        })

        // Calculate totalDiff before using it
        const totalDiff = totalStockDiff + totalStoreDiff

        return {
            totalStockDiff,
            totalStoreDiff,
            totalQuantity,
            stockToStoreCount,
            storeToStockCount,
            totalDiff,
            isBalanced: totalDiff === 0
        }
    }

    const totalImpact = calculateTotalImpact()
    const isCompleted = transferOrder?.status === 'COMPLETED'

    const getImpactBadge = (value, label) => {
        return (
            <Badge
                color={value > 0 ? 'success' : value < 0 ? 'danger' : 'secondary'}
                className="d-flex align-items-center py-1 px-2"
                pill
            >
                {value > 0 ? <TrendingUp size={12} className="mr-1" /> : value < 0 ? <TrendingDown size={12} className="mr-1" /> : <Minus size={12} className="mr-1" />}
                <span className="ml-1">{label}: {value > 0 ? '+' : ''}{value}</span>
            </Badge>
        )
    }

    return (
        <Card className={`mb-4 ${className}`}>
            <CardBody>
                <div
                    className="d-flex justify-content-between align-items-center mb-3 cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="d-flex align-items-center">
                        <BarChart2 size={20} className="mr-2 text-primary" />
                        <h5 className="mb-0">{title}</h5>
                        <Badge color={isCompleted ? 'success' : 'warning'} className="ml-2">
                            {isCompleted ? 'Completed' : 'Pending'}
                        </Badge>
                    </div>
                    <Button color="link" className="p-0">
                        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </Button>
                </div>

                <Collapse isOpen={isOpen}>
                    <Row>
                        {/* Overall Impact */}
                        <Col lg={6} className="mb-3">
                            <div className="p-3 border rounded h-100">
                                <h6 className="mb-3 d-flex align-items-center">
                                    <Package size={16} className="mr-2" />
                                    Overall Impact
                                </h6>

                                <div className="mb-3">
                                    {getImpactBadge(totalImpact.totalStockDiff, 'Stock Available')}
                                </div>

                                <div className="mb-3">
                                    {getImpactBadge(totalImpact.totalStoreDiff, 'Store Available')}
                                </div>

                                <div>
                                    <Badge
                                        color={totalImpact.isBalanced ? 'success' : 'info'}
                                        className="d-flex align-items-center py-1 px-2"
                                        pill
                                    >
                                        <Package size={12} className="mr-1" />
                                        <span className="ml-1">
                                            Net Change: {totalImpact.totalDiff > 0 ? '+' : ''}{totalImpact.totalDiff}
                                        </span>
                                    </Badge>
                                </div>
                            </div>
                        </Col>

                        {/* Transfer Details */}
                        <Col lg={6} className="mb-3">
                            <div className="p-3 border rounded h-100">
                                <h6 className="mb-3">Transfer Details</h6>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Total Products:</span>
                                    <strong>{products.length}</strong>
                                </div>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Total Quantity:</span>
                                    <strong>{totalImpact.totalQuantity}</strong>
                                </div>

                                {totalImpact.stockToStoreCount > 0 && (
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Stock → Store:</span>
                                        <Badge color="info">
                                            {totalImpact.stockToStoreCount} product(s)
                                        </Badge>
                                    </div>
                                )}

                                {totalImpact.storeToStockCount > 0 && (
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Store → Stock:</span>
                                        <Badge color="warning">
                                            {totalImpact.storeToStockCount} product(s)
                                        </Badge>
                                    </div>
                                )}

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Status:</span>
                                    <Badge color={isCompleted ? 'success' : 'warning'}>
                                        {transferOrder?.status?.toLowerCase() || 'pending'}
                                    </Badge>
                                </div>

                                {transferOrder?.number && (
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">Transfer #:</span>
                                        <strong>{transferOrder.number}</strong>
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>

                    {/* Individual Product Summary */}
                    {products.length > 0 && (
                        <div className="mt-4 pt-3 border-top">
                            <h6 className="mb-3">Product-by-Product Impact</h6>
                            <Row>
                                {products.map((product, index) => (
                                    <Col key={index} xs={12} sm={6} lg={4} className="mb-3">
                                        <div className="border rounded p-3 h-100">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <div className="text-truncate" style={{ maxWidth: '70%' }}>
                                                    <small className="text-muted d-block mb-1">
                                                        {product.product?.name || product.product_name || `Product ${index + 1}`}
                                                    </small>
                                                    <small className="text-muted">
                                                        Qty: {product.quantity}
                                                    </small>
                                                </div>
                                                <Badge
                                                    color={product.from_location === 'stock_available' ? 'info' : 'warning'}
                                                    pill
                                                >
                                                    {product.from_location === 'stock_available' ? 'S→T' : 'T→S'}
                                                </Badge>
                                            </div>

                                            <div className="small">
                                                <div className="d-flex justify-content-between">
                                                    <span>Stock:</span>
                                                    <span>
                                                        {product.stock_available_before || product.current_stock_available || 0} → {product.stock_available_after || '?'}
                                                    </span>
                                                </div>
                                                <div className="d-flex justify-content-between">
                                                    <span>Store:</span>
                                                    <span>
                                                        {product.store_available_before || product.current_store_available || 0} → {product.store_available_after || '?'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    )}

                    {/* Notes */}
                    {transferOrder?.notes && (
                        <div className="mt-3 pt-3 border-top">
                            <h6 className="mb-2">
                                <AlertTriangle size={16} className="mr-2" />
                                Notes
                            </h6>
                            <p className="text-muted mb-0">{transferOrder.notes}</p>
                        </div>
                    )}
                </Collapse>
            </CardBody>
        </Card>
    )
}

export default StockImpactSummary