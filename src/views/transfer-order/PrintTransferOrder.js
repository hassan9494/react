// src/views/transfer-order/PrintTransferOrder.js
import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useTransferOrder } from '@data/use-transfer-order'
import {
    Row, Col, Spinner, Alert
} from 'reactstrap'
import {
    Printer, Download, ArrowLeft, FileText, Package,
    CheckCircle, AlertTriangle, Calendar, User, Hash,
    ArrowRight, Database, Truck
} from 'react-feather'
import { toast } from 'react-toastify'
import moment from 'moment'
import logo from '../../@core/assets/images/logo.png'
import QRCode from 'qrcode'
import { usePrintStyles } from '../../utility/hooks/usePrintStyles'
import '@styles/base/pages/invoice.scss'

const PrintTransferOrder = () => {
    const { id } = useParams()
    const history = useHistory()
    const { data: transferOrderData, isLoading } = useTransferOrder(id)
    const [transferOrder, setTransferOrder] = useState(null)
    const [qrUrl, setQrUrl] = useState('')
    const [printTriggered, setPrintTriggered] = useState(false)

    // Apply print styles
    usePrintStyles(`TRANSFER-${id}`)

    useEffect(() => {
        if (transferOrderData && !printTriggered) {
            setPrintTriggered(true)
            setTransferOrder(transferOrderData.data || transferOrderData)

            // Generate QR code
            const qrData = `Transfer Order #${transferOrderData.data?.number || id}\nDate: ${moment(transferOrderData.data?.created_at).format('DD/MM/YYYY')}\nStatus: ${transferOrderData.data?.status}\nTotal Products: ${transferOrderData.data?.summary?.total_products || 0}\nTotal Quantity: ${transferOrderData.data?.summary?.total_quantity || 0}`

            QRCode.toDataURL(qrData)
                .then(url => setQrUrl(url))
                .catch(console.error)

            // Auto-print after a short delay
            setTimeout(() => {
                window.print()
            }, 500)
        }
    }, [transferOrderData, id, printTriggered])

    // Helper function to get stock data (same logic as StockImpact component)
    const getStockData = (product) => {
        const hasHistory = product?.has_stock_history ||
            (product?.stock_before !== null && product?.stock_before !== undefined)

        if (hasHistory) {
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

    const getLocationName = (product, locationType) => {
        if (!product) return 'N/A'

        if (locationType === 'stock_available') {
            return product.product_stock_location || 'Stock Location'
        } else if (locationType === 'store_available') {
            return product.product_location || 'Store Location'
        }
        return 'N/A'
    }

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        return moment(dateString).format('DD/MM/Y')
    }

    // Get status badge
    const getStatusBadge = (status) => {
        if (!status) return null

        switch (status.toUpperCase()) {
            case 'PENDING':
                return <span className="status-badge pending">قيد الانتظار</span>
            case 'COMPLETED':
                return <span className="status-badge completed">مكتمل</span>
            default:
                return <span className="status-badge">{status}</span>
        }
    }

    // Get location label in English
    const getLocationLabelEnglish = (location) => {
        switch (location) {
            case 'stock_available':
                return 'Stock'
            case 'store_available':
                return 'Store'
            default:
                return location
        }
    }

    // Calculate totals
    const calculateTotals = () => {
        if (!transferOrder?.products) return { totalProducts: 0, totalQuantity: 0 }

        const totalProducts = transferOrder.products.length
        const totalQuantity = transferOrder.products.reduce((sum, product) => sum + (parseInt(product.quantity) || 0), 0)

        return { totalProducts, totalQuantity }
    }

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <Spinner color="primary" />
            </div>
        )
    }

    if (!transferOrder) {
        return (
            <Alert color="danger">
                <AlertTriangle size={20} className="mr-2" />
                Transfer order not found
            </Alert>
        )
    }

    const totals = calculateTotals()
    const user = JSON.parse(localStorage.getItem('user'))

    return (
        <div className="invoice">
            <InvoiceHeader transferOrder={transferOrder} qrUrl={qrUrl}/>

            <div>
                <h3 className='text-center mt-1 mb-2 invoice-title'>
                    <strong>أمر نقل البضاعة - Transfer Order</strong>
                </h3>

                <Row>
                    <Col>
                        <h4>
                            <div className='d-flex m-0'>
                                <span className='field-label '>التاريخ </span>
                                <span className="underline-dotted flex-grow-1 dotdate">
                  <strong className='ml-1'>:</strong>
                  <strong>{formatDate(transferOrder.created_at)}</strong>
                </span>
                            </div>
                        </h4>
                    </Col>
                    <Col>
                        <h4>
                            <div className='d-flex m-0'>
                                <span className='font-20'>رقم الأمر </span>
                                <span className="underline-dotted flex-grow-1 dotinvoice">
                  <strong className='ml-1'>:</strong>
                  <strong>{transferOrder.number}</strong>
                </span>
                            </div>
                        </h4>
                    </Col>
                </Row>

                <Row className='mt-0'>
                    <Col>
                        <h4>
                            <div className='d-flex m-0'>
                                <span className='font-20'>تم الإنشاء بواسطة </span>
                                <span className="underline-dotted flex-grow-1 dotinvoice">
                  <strong className='ml-1'>:</strong>
                  <strong>{transferOrder.created_by?.name || 'N/A'}</strong>
                </span>
                            </div>
                        </h4>
                    </Col>
                    <Col>
                        <h4>
                            <div className='d-flex m-0'>
                                <span className='font-20'>الحالة </span>
                                <span className="underline-dotted flex-grow-1 dotphone">
                  <strong className='ml-1'>:</strong>
                  <strong>{getStatusBadge(transferOrder.status)}</strong>
                </span>
                            </div>
                        </h4>
                    </Col>
                </Row>

                {transferOrder.approved_by && (
                    <Row className='mt-0'>
                        <Col>
                            <h4>
                                <div className='d-flex m-0'>
                                    <span className='font-20'>تمت الموافقة بواسطة </span>
                                    <span className="underline-dotted flex-grow-1 dotinvoice">
                    <strong className='ml-1'>:</strong>
                    <strong>{transferOrder.approved_by?.name || 'N/A'}</strong>
                  </span>
                                </div>
                            </h4>
                        </Col>
                        <Col>
                            {transferOrder.completed_at && (
                                <h4>
                                    <div className='d-flex m-0'>
                                        <span className='font-20'>تاريخ الإكمال </span>
                                        <span className="underline-dotted flex-grow-1 dotphone">
                      <strong className='ml-1'>:</strong>
                      <strong>{formatDate(transferOrder.completed_at)}</strong>
                    </span>
                                    </div>
                                </h4>
                            )}
                        </Col>
                    </Row>
                )}

                <Row className='mt-1'>
                    <Col>
                        <div className="table-responsive">
                            <table className="table1" style={{ width: '100%', tableLayout: 'auto' }}>
                                <colgroup>
                                    <col style={{ width: '1%' }} />    {/* الرقم */}
                                    <col />   {/* البيان */}
                                    <col style={{ width: '1%' }} />   {/* من المخزن */}
                                    <col style={{ width: '1%' }} />   {/* إلى المخزن */}
                                    <col style={{ width: '1%' }} />    {/* الكمية */}
                                    <col style={{ width: '1%' }} />   {/* القيم الحالية */}
                                    <col style={{ width: '1%' }} />   {/* القيم قبل النقل */}
                                    <col style={{ width: '1%' }} />   {/* القيم بعد النقل */}
                                </colgroup>
                                <thead>
                                <tr>
                                    <th style={{ whiteSpace: 'nowrap' }}>الرقم</th>
                                    <th style={{ whiteSpace: 'nowrap' }}>البيان</th>
                                    <th style={{ whiteSpace: 'nowrap' }}>من </th>
                                    <th style={{ whiteSpace: 'nowrap' }}>إلى</th>
                                    <th style={{ whiteSpace: 'nowrap' }}>الكمية</th>
                                    <th style={{ whiteSpace: 'nowrap' }}>القيم الحالية</th>
                                    <th style={{ whiteSpace: 'nowrap' }}> القيم قبل النقل</th>
                                    <th style={{ whiteSpace: 'nowrap' }}>القيم بعد النقل</th>
                                </tr>
                                </thead>
                                <tbody>
                                {transferOrder.products?.map((product, i) => {
                                    // Get stock data using the same logic as StockImpact component
                                    const stockData = getStockData(product)
                                    const isHistorical = stockData.type === 'historical'
                                    // Get location names
                                    const fromLocationName = getLocationName(product, product.from_location)
                                    const toLocationName = getLocationName(product, product.to_location)

                                    return (
                                        <tr key={i}>
                                            <td style={{ whiteSpace: 'nowrap' }}>{i + 1}</td>
                                            <td>
                                                <div className="font-weight-bold">{product.product_name}</div>
                                                <small className="text-muted">SKU: {product.product_sku}</small>
                                            </td>
                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                <div className='text-muted'>{getLocationLabelEnglish(product.from_location)}</div>
                                                <small>{fromLocationName}</small>
                                            </td>
                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                <div className='text-muted'>{getLocationLabelEnglish(product.to_location)}</div>
                                                <small>{toLocationName}</small>
                                            </td>
                                            <td style={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>{product.quantity}</td>


                                            {/* Current Values Column */}
                                            <td>
                                                <div className="current-values">
                                                    <div className="d-flex justify-content-between mb-1">
                                                        <small className="text-muted">stock:</small>
                                                        <strong>{product.current_stock_available}</strong>
                                                    </div>
                                                    <div className="d-flex justify-content-between mb-0">
                                                        <small className="text-muted">store:</small>
                                                        <strong>{product.current_store_available}</strong>
                                                    </div>

                                                </div>
                                            </td>


                                            {/* Values before Transfer Column */}
                                            <td>
                                                <div className="current-values">
                                                    <div className="d-flex justify-content-between mb-1">
                                                        <small className="text-muted">stock:</small>
                                                        <strong>{stockData.stockAvailBefore}</strong>
                                                    </div>
                                                    <div className="d-flex justify-content-between mb-0">
                                                        <small className="text-muted">store:</small>
                                                        <strong>{stockData.storeAvailBefore}</strong>
                                                    </div>

                                                </div>
                                            </td>


                                            {/* Values After Transfer Column */}
                                            <td>
                                                <div className="after-values">
                                                    <div className="d-flex justify-content-between mb-1">
                                                        <small className="text-muted">stock:</small>
                                                        <strong className={
                                                            isHistorical ? (stockData.stockDiff > 0 ? 'text-success' : stockData.stockDiff < 0 ? 'text-danger' : '') : ''
                                                        }>
                                                            {stockData.stockAvailAfter}
                                                            {isHistorical && stockData.stockDiff !== 0 && (
                                                                <span className={`ml-1 small ${stockData.stockDiff > 0 ? 'text-success' : 'text-danger'}`}>
                          </span>
                                                            )}
                                                        </strong>
                                                    </div>
                                                    <div className="d-flex justify-content-between mb-0">
                                                        <small className="text-muted">store:</small>
                                                        <strong className={
                                                            isHistorical ? (stockData.storeDiff > 0 ? 'text-success' : stockData.storeDiff < 0 ? 'text-danger' : '') : ''
                                                        }>
                                                            {stockData.storeAvailAfter}
                                                            {isHistorical && stockData.storeDiff !== 0 && (
                                                                <span className={`ml-1 small ${stockData.storeDiff > 0 ? 'text-success' : 'text-danger'}`}>
                          </span>
                                                            )}
                                                        </strong>
                                                    </div>

                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}

                                <tr>
                                    <td colSpan={8} style={{ padding: 0 }}>
                                        <table className="table mb-0 w-100 totals-table">
                                            <colgroup>
                                                <col style={{ width: 'auto' }} /> {/* Note column - takes remaining space */}
                                                <col style={{ width: '1%' }} />   {/* Labels column - minimal width */}
                                                <col style={{ width: '1%' }} />   {/* Amounts column - minimal width */}
                                            </colgroup>
                                            <tbody>
                                            <tr>
                                                <td rowSpan="4">
                                                    <div className='d-block'>تنقل البضاعة بين المخازن</div>
                                                    <div>يتم النقل بحسب طلب المسؤول المختص</div>
                                                    <div className="mt-2">
                                                        <small className="text-muted">حالة النقل:</small>
                                                        <div>
                                                            {transferOrder.status === 'COMPLETED' ? (
                                                                <span className="text-success">✓ تم تنفيذ النقل</span>
                                                            ) : (
                                                                <span className="text-warning">⏱ بانتظار التنفيذ</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-nowrap">
                                                    <div className='d-block' style={{ whiteSpace: 'nowrap' }}>عدد المنتجات - Total Products</div>
                                                </td>
                                                <td className="text-nowrap text-left">
                                                    <div>{totals.totalProducts}</div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td className="text-nowrap">
                                                    <div className='d-block' style={{ whiteSpace: 'nowrap' }}>إجمالي الكمية - Total Quantity</div>
                                                </td>
                                                <td className="text-nowrap text-left">
                                                    <div>{totals.totalQuantity}</div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td className="text-nowrap">
                                                    <div className='d-block' style={{ whiteSpace: 'nowrap' }}>تم الإنشاء بواسطة - Created By</div>
                                                </td>
                                                <td className="text-nowrap text-left">
                                                    <div>{transferOrder.created_by?.name || 'N/A'}</div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td className="text-nowrap">
                                                    <strong>تاريخ الإنشاء - Created Date</strong>
                                                </td>
                                                <td className="text-nowrap text-left">
                                                    <strong>
                                                        <div className="small">{formatDate(transferOrder.created_at)}</div>
                                                    </strong>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </Col>
                </Row>

                {transferOrder.notes && (
                    <Row className='mt-2'>
                        <Col>
                            <h4 className="invoice-field">
                                <div className='d-flex mb-0'>
                                    <h4 className='field-label dotnotes'>ملاحظات </h4>
                                    <h4>:</h4>
                                    <span className="flex-grow-1 ml-1">
                    <strong >
                      {transferOrder.notes?.split('\n').map((line, index) => (
                          <div className="underline-dotted pr-1" style={{display: "block"}} key={index}>
                              {line}
                          </div>
                      ))}
                    </strong>
                  </span>
                                </div>
                            </h4>
                        </Col>
                    </Row>
                )}

            </div>
        </div>
    )
}

function InvoiceHeader({ transferOrder, qrUrl }) {
    return (
        <>
            <Row className="small text-muted justify-content-between invoice-header no-gutters fixed-hight">

                <Col
                    xl={4} lg={4} md={4} sm={4} xs={4}
                    className="logo-col p-0 d-flex align-items-center justify-content-start text-end"
                >
                    <div className="content-wrapper w-100">
                        <p className="company-name mb-0">مؤسســة منتصر ومحمود للالكترونيات</p>
                        <p className="website mb-0">WWW.MIKROELECTRON.COM</p>
                    </div>
                </Col>

                <Col
                    xl={4} lg={4} md={4} sm={4} xs={4}
                    className="p-1 d-flex align-items-center justify-content-center"
                >
                    <img src={logo} className="logo img-fluid" alt="Logo" />
                </Col>
            </Row>
            <hr/>
        </>
    )
}

export default PrintTransferOrder