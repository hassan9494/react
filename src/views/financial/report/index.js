import { Fragment, useState, useEffect } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable, api as transactionApi } from '@data/use-transaction'
import Filters from './filters'
import moment from 'moment'
import { Badge, Card, CardBody, Row, Col } from "reactstrap"
import { pickBy, identity } from 'lodash'

const Tables = () => {
    const [conditions, setConditions] = useState([])
    const [filters, setFilters] = useState({})
    const [filteredTotals, setFilteredTotals] = useState({
        overall: {
            total_deposits: 0,
            total_withdrawals: 0,
            total_refunds: 0,
            net_amount: 0,
            deposit_amount_raw: 0,
            withdraw_amount_raw: 0,
            refund_amount_raw: 0,
            total_amount_raw: 0,
            total_commission: 0,
            total_shipping: 0
        },
        grouped_by_payment_method: []
    })

    const onFiltersChange = (filters) => {
        let updated = []
        setFilters(filters)

        if (filters.dept !== "false" || filters.dept === null) {
            updated = []
        }

        if (filters.from) updated.push({col: 'created_at',  op: '>=', val: filters.from})
        if (filters.to) updated.push({col: 'created_at',  op: '<=', val: moment(filters.to).add(1, 'days').format('Y-MM-DD')})
        if (filters.type) updated.push({col: 'type', val: filters.type})
        if (filters.payment_method_id) updated.push({col: 'payment_method_id', val: filters.payment_method_id})
        setConditions(updated)
    }

    // Fetch filtered totals whenever filters change
    useEffect(() => {
        const fetchFilteredTotals = async () => {
            try {
                // Convert filters to params
                const params = new URLSearchParams(
                    pickBy({
                        from: filters.from,
                        to: filters.to,
                        type: filters.type,
                        payment_method_id: filters.payment_method_id
                    }, identity)
                ).toString()

                const response = await transactionApi.filteredTotals(params)
                console.log('Filtered totals response:', response)
                setFilteredTotals(response)
            } catch (error) {
                console.error('Failed to fetch filtered totals:', error)
            }
        }

        fetchFilteredTotals()
    }, [filters])

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Transaction' breadCrumbActive='Report' />

            <Filters onChange={onFiltersChange} />

            {/* Totals Display Card */}
            <Card className='mb-3'>
                <CardBody>
                    {/* Overall Statistics - First Row */}
                    <div className="d-flex justify-content-around align-items-center p-2 bg-light rounded">
                        <div className="text-center">
                            <h6 className="mb-1">Total Deposits</h6>
                            <h5 className="text-success mb-0">
                                ${(filteredTotals.overall?.total_deposits || 0)?.toFixed(2)}
                            </h5>
                            <small className="text-muted d-block">Amount: ${(filteredTotals.overall?.deposit_amount_raw || 0)?.toFixed(2)}</small>
                        </div>
                        <div className="text-center">
                            <h6 className="mb-1">Total Withdrawals</h6>
                            <h5 className="text-danger mb-0">
                                ${(filteredTotals.overall?.total_withdrawals || 0)?.toFixed(2)}
                            </h5>
                            <small className="text-muted d-block">Amount: ${(filteredTotals.overall?.withdraw_amount_raw || 0)?.toFixed(2)}</small>
                        </div>
                        <div className="text-center">
                            <h6 className="mb-1">Total Refunds</h6>
                            <h5 className="text-warning mb-0">
                                ${(filteredTotals.overall?.total_refunds || 0)?.toFixed(2)}
                            </h5>
                            <small className="text-muted d-block">Amount: ${(filteredTotals.overall?.refund_amount_raw || 0)?.toFixed(2)}</small>
                        </div>
                        <div className="text-center">
                            <h6 className="mb-1">Net Amount</h6>
                            <h5 className={`mb-0 ${(filteredTotals.overall?.net_amount || 0) >= 0 ? 'text-success' : 'text-danger'}`}>
                                ${(filteredTotals.overall?.net_amount || 0)?.toFixed(2)}
                            </h5>
                        </div>
                    </div>
                   

                    {/* Additional Statistics - Second Row */}
                    <div className="d-flex justify-content-around align-items-center mt-3 p-2 bg-light rounded">
                        <div className="text-center">
                            <h6 className="mb-1">Total Deposit Amount</h6>
                            <h5 className="text-primary mb-0">
                                ${(filteredTotals.overall?.total_deposit_amount || 0)?.toFixed(2)}
                            </h5>
                        </div>
                        <div className="text-center">
                            <h6 className="mb-1">Total Commission</h6>
                            <h5 className="text-info mb-0">
                                ${(filteredTotals.overall?.total_commission || 0)?.toFixed(2)}
                            </h5>
                        </div>
                        <div className="text-center">
                            <h6 className="mb-1">Total Shipping</h6>
                            <h5 className="text-warning mb-0">
                                ${(filteredTotals.overall?.total_shipping || 0)?.toFixed(2)}
                            </h5>
                        </div>
                    </div>

                    {/*// Also update the payment method breakdown:*/}
                    {filteredTotals.grouped_by_payment_method && filteredTotals.grouped_by_payment_method.length > 0 && (
                        <Row className="mt-3">
                            <Col md={12}>
                                <h6>Breakdown by Payment Method:</h6>
                                <div className="d-flex flex-wrap gap-2">
                                    {filteredTotals.grouped_by_payment_method.map(item => (
                                        <div key={item.payment_method_id} className="bg-white p-2 rounded border" style={{minWidth: '200px'}}>
                                            <h6 className="mb-1">{item.payment_method?.name || 'Unknown'}</h6>

                                            {/* Amounts by type */}
                                            <div className="mb-2">
                                                <small className="text-muted d-block">
                                                    Deposits: <span className="text-success">${(item.total_deposits || 0)?.toFixed(2)}</span>
                                                </small>
                                                <small className="text-muted d-block">
                                                    Amount: ${(item.deposit_amount_raw || 0)?.toFixed(2)}
                                                </small>

                                                <small className="text-muted d-block mt-1">
                                                    Withdrawals: <span className="text-danger">${(item.total_withdrawals || 0)?.toFixed(2)}</span>
                                                </small>
                                                <small className="text-muted d-block">
                                                    Amount: ${(item.withdraw_amount_raw || 0)?.toFixed(2)}
                                                </small>

                                                <small className="text-muted d-block mt-1">
                                                    Refunds: <span className="text-warning">${(item.total_refunds || 0)?.toFixed(2)}</span>
                                                </small>
                                                <small className="text-muted d-block">
                                                    Amount: ${(item.refund_amount_raw || 0)?.toFixed(2)}
                                                </small>
                                            </div>

                                            {/* Additional statistics */}
                                            <div className="border-top pt-1">
                                                <small className="text-muted d-block">
                                                    Deposit Amount: ${(item.total_deposit_amount || 0)?.toFixed(2)}
                                                </small>
                                                <small className="text-muted d-block">
                                                    Commission: ${(item.total_commission || 0)?.toFixed(2)}
                                                </small>
                                                <small className="text-muted d-block">
                                                    Shipping: ${(item.total_shipping || 0)?.toFixed(2)}
                                                </small>
                                            </div>

                                            {/* Net amount */}
                                            <div className={`mt-1 fw-bold ${(item.net_amount || 0) >= 0 ? 'text-success' : 'text-danger'}`}>
                                                Net: ${(item.net_amount || 0)?.toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Col>
                        </Row>
                    )}
                </CardBody>
            </Card>

            <Datatable
                useDatatable={useDatatable}
                conditions={conditions}
                initialOrder={{column: 'id', dir: 'desc'}}
                defaultSortField={'id'}
                defaultSortAsc={false}
                header={false}
                columns={[
                    {
                        name: 'ID',
                        selector: 'id',
                        sortable: true
                    },
                    {
                        name: 'Order Id / Return Order Id',
                        selector: 'order_id',
                        sortable: true,
                        cell: row => (
                            <div>
                                {row.order_id ? (
                                    <a className='text-dark' href={`/order/edit/${row.order_id}`} target='_blank'>{ row.order_id }</a>
                                ) : (row.return_order_id ? (
                                    <a className='text-dark' href={`/return-order/edit/${row.return_order_id}`} target='_blank'>R_{ row.return_order_id }</a>
                                ) : (
                                    <span className='text-muted'>-</span>
                                ))}
                            </div>
                        )
                    },
                    {
                        name: 'Type',
                        selector: 'type',
                        sortable: true,
                        cell: row => (
                            <span className={`badge badge-${
                                row.type === 'deposit' ? 'success' : row.type === 'withdraw' ? 'danger' : 'warning'
                            }`}>
                                {row.type}
                            </span>
                        )
                    },
                    {
                        name: 'Amount',
                        selector: 'amount',
                        sortable: true,
                        cell: row => `$${parseFloat(row.amount).toFixed(2)}`
                    },
                    {
                        name: 'Total Amount',
                        selector: 'total_amount',
                        sortable: true,
                        cell: row => `$${parseFloat(row.total_amount).toFixed(2)}`
                    },
                    {
                        name: 'Commission',
                        selector: 'commission',
                        sortable: true,
                        cell: row => `$${parseFloat(row.commission || 0).toFixed(2)}`
                    },
                    {
                        name: 'Shipping',
                        selector: 'shipping',
                        sortable: true,
                        cell: row => `$${parseFloat(row.shipping || 0).toFixed(2)}`
                    },
                    {
                        name: 'Payment Method',
                        selector: 'payment_method_id',
                        sortable: true,
                        cell: row => row.paymentMethod || '-'
                    },
                    {
                        name: 'Created By',
                        selector: 'created_user',
                        sortable: true,
                        cell: row => row.created_user || '-'
                    },
                    {
                        name: 'Date',
                        selector: 'created_at',
                        sortable: true,
                        cell: row => moment(row.created_at).format('YYYY-MM-DD HH:mm')
                    }
                ]}
            />
        </Fragment>
    )
}

export default Tables