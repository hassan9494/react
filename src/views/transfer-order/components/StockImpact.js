// src/views/transfer-order/components/StockImpact.js
import { useState } from 'react'
import {
    Badge,
    Tooltip,
    Row,
    Col
} from 'reactstrap'
import {
    TrendingUp,
    TrendingDown,
    Minus,
    Package,
    Info,
    CheckCircle,
    AlertTriangle,
    ArrowRight
} from 'react-feather'

const StockImpact = ({
                         product,
                         transferOrderStatus = 'PENDING',
                         showLabels = true,
                         compact = false,
                         showTooltip = true,
                         className = '',
                         style = {}
                     }) => {
    const [tooltipOpen, setTooltipOpen] = useState(false)

    // Check if we have historical data
    const hasHistory = product?.has_stock_history ||
        (product?.stock_before !== null && product?.stock_before !== undefined)

    // Get stock data directly from API response
    const getStockData = () => {
        if (hasHistory) {
            // For completed transfers, use historical data
            return {
                type: 'historical',
                stockAvailBefore: product.stock_available_before || 0,
                stockAvailAfter: product.stock_available_after || 0,
                storeAvailBefore: product.store_available_before || 0,
                storeAvailAfter: product.store_available_after || 0,
                totalBefore: product.stock_before || 0,
                totalAfter: product.stock_after || 0,
                stockDiff: product.stock_available_difference || 0,
                storeDiff: product.store_available_difference || 0,
                totalDiff: product.stock_difference || 0
            }
        } else {
            // For pending transfers, use current values (no change yet)
            return {
                type: 'pending',
                stockAvailBefore: product.current_stock_available || 0,
                stockAvailAfter: product.current_stock_available || 0,
                storeAvailBefore: product.current_store_available || 0,
                storeAvailAfter: product.current_store_available || 0,
                totalBefore: (product.current_stock_available || 0) + (product.current_store_available || 0),
                totalAfter: (product.current_stock_available || 0) + (product.current_store_available || 0),
                stockDiff: 0,
                storeDiff: 0,
                totalDiff: 0
            }
        }
    }

    const stockData = getStockData()
    const isHistorical = stockData.type === 'historical'

    // Helper functions
    const getBadgeColor = (value) => {
        if (value > 0) return 'success'
        if (value < 0) return 'danger'
        return 'secondary'
    }

    const getDiffIcon = (value) => {
        if (value > 0) return <TrendingUp size={10} className="mr-1" />
        if (value < 0) return <TrendingDown size={10} className="mr-1" />
        return <Minus size={10} className="mr-1" />
    }

    const getDiffLabel = (value) => {
        if (value > 0) return `+${value}`
        if (value < 0) return `${value}`
        return 'No change'
    }

    const getStatusBadge = () => {
        if (isHistorical) {
            return (
                <Badge color="success" className="ml-2" pill>
                    <CheckCircle size={10} className="mr-1" />
                    Completed
                </Badge>
            )
        }
        return (
            <Badge color="warning" className="ml-2" pill>
                <AlertTriangle size={10} className="mr-1" />
                Pending
            </Badge>
        )
    }

    // Render compact version (for tables)
    if (compact) {
        return (
            <div
                className={`stock-impact-compact ${className}`}
                style={style}
                id={`stock-impact-${product?.id || 'unknown'}`}
            >
                <div className="d-flex flex-column">
                    {/* Stock Available */}
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <small className="text-muted">Stock:</small>
                        <div className="d-flex align-items-center">
                            <span className="font-weight-bold">{stockData.stockAvailBefore}</span>
                            {isHistorical && (
                                <>
                                    <ArrowRight size={8} className="mx-1 text-muted" />
                                    <span className={`font-weight-bold ${
                                        stockData.stockDiff > 0 ? 'text-success' : stockData.stockDiff < 0 ? 'text-danger' : ''
                                    }`}>
                                        {stockData.stockAvailAfter}
                                    </span>
                                    {stockData.stockDiff !== 0 && (
                                        <Badge
                                            color={getBadgeColor(stockData.stockDiff)}
                                            className="ml-1"
                                            pill
                                            style={{ fontSize: '9px', padding: '2px 4px' }}
                                        >
                                            {getDiffLabel(stockData.stockDiff)}
                                        </Badge>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Store Available */}
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <small className="text-muted">Store:</small>
                        <div className="d-flex align-items-center">
                            <span className="font-weight-bold">{stockData.storeAvailBefore}</span>
                            {isHistorical && (
                                <>
                                    <ArrowRight size={8} className="mx-1 text-muted" />
                                    <span className={`font-weight-bold ${
                                        stockData.storeDiff > 0 ? 'text-success' : stockData.storeDiff < 0 ? 'text-danger' : ''
                                    }`}>
                                        {stockData.storeAvailAfter}
                                    </span>
                                    {stockData.storeDiff !== 0 && (
                                        <Badge
                                            color={getBadgeColor(stockData.storeDiff)}
                                            className="ml-1"
                                            pill
                                            style={{ fontSize: '9px', padding: '2px 4px' }}
                                        >
                                            {getDiffLabel(stockData.storeDiff)}
                                        </Badge>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">Σ:</small>
                        <div className="d-flex align-items-center">
                            <span className="font-weight-bold">{stockData.totalBefore}</span>
                            {isHistorical && (
                                <>
                                    <ArrowRight size={8} className="mx-1 text-muted" />
                                    <span className={`font-weight-bold ${
                                        stockData.totalDiff > 0 ? 'text-success' : stockData.totalDiff < 0 ? 'text-danger' : ''
                                    }`}>
                                        {stockData.totalAfter}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {showTooltip && (
                    <Tooltip
                        placement="top"
                        isOpen={tooltipOpen}
                        target={`stock-impact-${product?.id || 'unknown'}`}
                        toggle={() => setTooltipOpen(!tooltipOpen)}
                    >
                        {isHistorical ? 'Actual stock changes after transfer completion' : 'Pending - No stock changes yet'}
                    </Tooltip>
                )}
            </div>
        )
    }

    // Render detailed version
    return (
        <div
            className={`stock-impact-detailed p-3 ${className}`}
            style={{
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e9ecef',
                ...style
            }}
        >
            {showLabels && (
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                        <Package size={16} className="mr-2 text-primary" />
                        <h6 className="mb-0">
                            {isHistorical ? 'Actual Stock Impact' : 'Current Stock Status'}
                        </h6>
                        {getStatusBadge()}
                    </div>
                    {showTooltip && (
                        <Info
                            size={14}
                            className="text-muted cursor-pointer"
                            id={`stock-impact-info-${product?.id || 'unknown'}`}
                        />
                    )}
                </div>
            )}

            {/* Stock Available Row */}
            <div className="stock-impact-row mb-2">
                <Row className="align-items-center">
                    <Col xs={4}>
                        <div className="d-flex align-items-center">
                            <Package size={12} className="mr-2 text-info" />
                            <span className="font-weight-bold">Stock</span>
                        </div>
                    </Col>
                    <Col xs={8}>
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <span className="text-muted mr-2">Before:</span>
                                <span className="font-weight-bold">{stockData.stockAvailBefore}</span>
                            </div>
                            {isHistorical && (
                                <>
                                    <ArrowRight size={12} className="mx-2 text-muted" />
                                    <div className="d-flex align-items-center">
                                        <span className={`font-weight-bold ${
                                            stockData.stockDiff > 0 ? 'text-success' : stockData.stockDiff < 0 ? 'text-danger' : ''
                                        }`}>
                                            {stockData.stockAvailAfter}
                                        </span>
                                        {stockData.stockDiff !== 0 && (
                                            <Badge
                                                color={getBadgeColor(stockData.stockDiff)}
                                                className="ml-2 d-flex align-items-center"
                                                pill
                                            >
                                                {getDiffIcon(stockData.stockDiff)}
                                                {getDiffLabel(stockData.stockDiff)}
                                            </Badge>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Store Available Row */}
            <div className="stock-impact-row mb-2">
                <Row className="align-items-center">
                    <Col xs={4}>
                        <div className="d-flex align-items-center">
                            <Package size={12} className="mr-2 text-warning" />
                            <span className="font-weight-bold">Store</span>
                        </div>
                    </Col>
                    <Col xs={8}>
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <span className="text-muted mr-2">Before:</span>
                                <span className="font-weight-bold">{stockData.storeAvailBefore}</span>
                            </div>
                            {isHistorical && (
                                <>
                                    <ArrowRight size={12} className="mx-2 text-muted" />
                                    <div className="d-flex align-items-center">
                                        <span className={`font-weight-bold ${
                                            stockData.storeDiff > 0 ? 'text-success' : stockData.storeDiff < 0 ? 'text-danger' : ''
                                        }`}>
                                            {stockData.storeAvailAfter}
                                        </span>
                                        {stockData.storeDiff !== 0 && (
                                            <Badge
                                                color={getBadgeColor(stockData.storeDiff)}
                                                className="ml-2 d-flex align-items-center"
                                                pill
                                            >
                                                {getDiffIcon(stockData.storeDiff)}
                                                {getDiffLabel(stockData.storeDiff)}
                                            </Badge>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Total Row */}
            <div className="stock-impact-row pt-2 border-top">
                <Row className="align-items-center">
                    <Col xs={4}>
                        <div className="d-flex align-items-center">
                            <Package size={12} className="mr-2 text-primary" />
                            <span className="font-weight-bold">Total</span>
                        </div>
                    </Col>
                    <Col xs={8}>
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <span className="text-muted mr-2">Before:</span>
                                <span className="font-weight-bold">{stockData.totalBefore}</span>
                            </div>
                            {isHistorical && (
                                <>
                                    <ArrowRight size={12} className="mx-2 text-muted" />
                                    <div className="d-flex align-items-center">
                                        <span className={`font-weight-bold ${
                                            stockData.totalDiff > 0 ? 'text-success' : stockData.totalDiff < 0 ? 'text-danger' : ''
                                        }`}>
                                            {stockData.totalAfter}
                                        </span>
                                        {stockData.totalDiff !== 0 && (
                                            <Badge
                                                color={getBadgeColor(stockData.totalDiff)}
                                                className="ml-2 d-flex align-items-center"
                                                pill
                                            >
                                                {getDiffIcon(stockData.totalDiff)}
                                                {getDiffLabel(stockData.totalDiff)}
                                            </Badge>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Transfer Details */}
            <div className="mt-3 pt-3 border-top">
                <div className="small text-muted">
                    <div className="d-flex justify-content-between mb-1">
                        <span>Quantity:</span>
                        <strong>{product?.quantity || 0}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                        <span>From:</span>
                        <span className="text-capitalize">
                            {product?.from_location_label || product?.from_location || 'stock_available'}
                        </span>
                    </div>
                    <div className="d-flex justify-content-between">
                        <span>To:</span>
                        <span className="text-capitalize">
                            {product?.to_location_label || product?.to_location || 'store_available'}
                        </span>
                    </div>
                </div>
            </div>

            {showTooltip && (
                <Tooltip
                    placement="top"
                    target={`stock-impact-info-${product?.id || 'unknown'}`}
                >
                    {isHistorical ? 'Shows actual stock changes after transfer completion' : 'Shows current stock status (no changes yet)'}
                </Tooltip>
            )}
        </div>
    )
}

export default StockImpact