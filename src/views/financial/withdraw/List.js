import {Fragment, useEffect, useState} from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-transaction'
import moment from 'moment'
import actions from './actions'
import Select from "react-select"
import { selectThemeColors } from '@utils'
import ability from "../../../configs/acl/ability"
import {
    Card,
    CardBody,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    Row,
    Col
} from 'reactstrap'
import { toast } from 'react-toastify'
import { api as paymentMethodApi } from '@data/use-payment-method'
// eslint-disable-next-line no-duplicate-imports
import { api as transactionApi } from '@data/use-transaction'

const Tables = () => {
    const [conditions, setConditions] = useState([
        {
            col: 'type', op: '=', val: 'withdraw'
        }
    ])

    const [showWithdrawForm, setShowWithdrawForm] = useState(true)
    const [withdrawForm, setWithdrawForm] = useState({
        payment_method: '',
        amount: ''
    })
    const [paymentMethods, setPaymentMethods] = useState([])
    const [todayTotals, setTodayTotals] = useState({
        grouped_by_payment_method: [],
        overall: {
            total_deposits: 0,
            total_withdrawals: 0,
            total_refunds: 0,
            net_amount: 0,
            deposit_amount: 0,
            withdraw_amount: 0,
            refund_amount: 0,
            remaining_deposit_amount: 0, // NEW: The value you want
            total_commission: 0,
            total_shipping: 0
        }
    })
    const [yearTotals, setYearTotals] = useState({
        grouped_by_payment_method: [],
        overall: {
            total_deposits: 0,
            total_withdrawals: 0,
            total_refunds: 0,
            net_amount: 0,
            deposit_amount: 0,
            withdraw_amount: 0,
            refund_amount: 0,
            remaining_deposit_amount: 0, // NEW: The value you want
            total_commission: 0,
            total_shipping: 0
        }
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)

    // Fetch payment methods and totals
    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                const response = await paymentMethodApi.index()
                setPaymentMethods(response || [])
            } catch (error) {
                console.error('Failed to fetch payment methods:', error)
                toast.error('Failed to load payment methods')
            }
        }

        const fetchTotal = async () => {
            try {
                const response = await transactionApi.totals()
                console.log('Totals response for withdraw:', response)

                // Set today totals
                const todayData = response.today || {
                    grouped_by_payment_method: [],
                    overall: {
                        total_deposits: 0,
                        total_withdrawals: 0,
                        total_refunds: 0,
                        net_amount: 0,
                        deposit_amount: 0,
                        withdraw_amount: 0,
                        refund_amount: 0,
                        remaining_deposit_amount: 0,
                        total_commission: 0,
                        total_shipping: 0
                    }
                }

                // Set year totals
                const yearData = response.this_year || {
                    grouped_by_payment_method: [],
                    overall: {
                        total_deposits: 0,
                        total_withdrawals: 0,
                        total_refunds: 0,
                        net_amount: 0,
                        deposit_amount: 0,
                        withdraw_amount: 0,
                        refund_amount: 0,
                        remaining_deposit_amount: 0,
                        total_commission: 0,
                        total_shipping: 0
                    }
                }

                setTodayTotals(todayData)
                setYearTotals(yearData)

            } catch (error) {
                console.error('Failed to fetch totals:', error)
                toast.error('Failed to load totals')
            }
        }

        fetchPaymentMethods()
        fetchTotal()
    }, [refreshKey])

    const onFilterChange = (val, col) => {
        setConditions(val ? [{ val, col }] : [])
    }

    const handleWithdrawInputChange = (field, value) => {
        setWithdrawForm(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleWithdrawSubmit = async (e) => {
        e.preventDefault()

        if (!withdrawForm.payment_method) {
            toast.error('Please select a payment method')
            return
        }

        if (!withdrawForm.amount || parseFloat(withdrawForm.amount) <= 0) {
            toast.error('Please enter a valid amount')
            return
        }

        setIsSubmitting(true)

        try {
            const withdrawData = {
                type: 'withdraw',
                payment_method_id: parseInt(withdrawForm.payment_method),
                amount: parseFloat(withdrawForm.amount)
            }

            await transactionApi.create(withdrawData)

            toast.success('Withdraw added successfully!')

            setWithdrawForm({
                payment_method: '',
                amount: ''
            })

            // Refresh the data
            setRefreshKey(prevKey => prevKey + 1)

        } catch (error) {
            console.error('Failed to create withdraw:', error)
            toast.error(error.response?.data?.message || 'Failed to create withdraw')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Get net amount for specific payment method and period
    const getNetAmount = (period, paymentMethodId) => {
        if (!paymentMethodId) return 0

        const totals = period === 'today' ? todayTotals : yearTotals
        const paymentMethodTotals = totals.grouped_by_payment_method.find(
            item => item.payment_method_id === parseInt(paymentMethodId)
        )

        return paymentMethodTotals ? paymentMethodTotals.net_amount : 0
    }

    // Get statistics for specific payment method and period
    const getStatistics = (period, paymentMethodId) => {
        const totals = period === 'today' ? todayTotals : yearTotals

        if (paymentMethodId) {
            const paymentMethodTotals = totals.grouped_by_payment_method.find(
                item => item.payment_method_id === parseInt(paymentMethodId)
            )

            return paymentMethodTotals ? {
                total_deposits: paymentMethodTotals.total_deposits || 0,
                total_withdrawals: paymentMethodTotals.total_withdrawals || 0,
                total_refunds: paymentMethodTotals.total_refunds || 0,
                net_amount: paymentMethodTotals.net_amount || 0,
                deposit_amount: paymentMethodTotals.deposit_amount || 0,
                withdraw_amount: paymentMethodTotals.withdraw_amount || 0,
                refund_amount: paymentMethodTotals.refund_amount || 0,
                remaining_deposit_amount: paymentMethodTotals.remaining_deposit_amount || 0, // The value you want
                total_commission: paymentMethodTotals.total_commission || 0,
                total_shipping: paymentMethodTotals.total_shipping || 0
            } : {
                total_deposits: 0,
                total_withdrawals: 0,
                total_refunds: 0,
                net_amount: 0,
                deposit_amount: 0,
                withdraw_amount: 0,
                refund_amount: 0,
                remaining_deposit_amount: 0,
                total_commission: 0,
                total_shipping: 0
            }
        }

        // Return overall statistics
        return totals.overall ? {
            total_deposits: totals.overall.total_deposits || 0,
            total_withdrawals: totals.overall.total_withdrawals || 0,
            total_refunds: totals.overall.total_refunds || 0,
            net_amount: totals.overall.net_amount || 0,
            deposit_amount: totals.overall.deposit_amount || 0,
            withdraw_amount: totals.overall.withdraw_amount || 0,
            refund_amount: totals.overall.refund_amount || 0,
            remaining_deposit_amount: totals.overall.remaining_deposit_amount || 0, // The value you want
            total_commission: totals.overall.total_commission || 0,
            total_shipping: totals.overall.total_shipping || 0
        } : {
            total_deposits: 0,
            total_withdrawals: 0,
            total_refunds: 0,
            net_amount: 0,
            deposit_amount: 0,
            withdraw_amount: 0,
            refund_amount: 0,
            remaining_deposit_amount: 0,
            total_commission: 0,
            total_shipping: 0
        }
    }

    // Get display amount - shows selected payment method's net amount, or overall if no payment method selected
    const getDisplayAmount = (period) => {
        if (withdrawForm.payment_method) {
            return getNetAmount(period, withdrawForm.payment_method)
        }

        // If no payment method selected, show overall net amount
        const totals = period === 'today' ? todayTotals : yearTotals
        return totals.overall ? totals.overall.net_amount : 0
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Financial' breadCrumbActive='Transaction' />

            {/* Withdraw Form Card */}
            <Card className='mb-3'>
                <CardBody>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="mb-0">Add Withdraw</h5>
                        <Button
                            color="primary"
                            size="sm"
                            onClick={() => setShowWithdrawForm(!showWithdrawForm)}
                        >
                            {showWithdrawForm ? 'Cancel' : 'Add Withdraw'}
                        </Button>
                    </div>

                    {showWithdrawForm && (
                        <Form onSubmit={handleWithdrawSubmit}>
                            <Row>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="withdraw_payment_method">Payment Method *</Label>
                                        <Input
                                            type="select"
                                            id="withdraw_payment_method"
                                            value={withdrawForm.payment_method}
                                            onChange={(e) => handleWithdrawInputChange('payment_method', e.target.value)}
                                            required
                                        >
                                            <option value="">Select Payment Method</option>
                                            {paymentMethods.map(method => (
                                                <option key={method.id} value={method.id}>
                                                    {method.name}
                                                </option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label for="withdraw_amount">Amount *</Label>
                                        <Input
                                            type="number"
                                            id="withdraw_amount"
                                            step="0.001"
                                            min="0.001"
                                            value={withdrawForm.amount}
                                            onChange={(e) => handleWithdrawInputChange('amount', e.target.value)}
                                            placeholder="0.00"
                                            required
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={2} className="d-flex align-items-end">
                                    <Button
                                        color="success"
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-100"
                                    >
                                        {isSubmitting ? 'Saving...' : 'Save'}
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    )}

                    {/* Overall totals display - shows selected payment method's net amount */}
                    <div className="d-flex justify-content-around align-items-center mt-3 p-2 bg-light rounded">
                        <div className="text-center">
                            <h6 className="mb-1">Today {withdrawForm.payment_method ? 'Selected Method' : 'Overall'}</h6>
                            <h5 className={`mb-0 ${getDisplayAmount('today') >= 0 ? 'text-success' : 'text-danger'}`}>
                                ${getDisplayAmount('today')?.toFixed(2)}
                            </h5>
                            {/* Added new sums for today - ONLY what you asked for */}
                            <div className="mt-1">
                                <small className="text-muted d-block">Remaining Deposit: ${getStatistics('today', withdrawForm.payment_method).remaining_deposit_amount?.toFixed(2)}</small>
                                <small className="text-muted d-block">Commission: ${getStatistics('today', withdrawForm.payment_method).total_commission?.toFixed(2)}</small>
                                <small className="text-muted d-block">Shipping: ${getStatistics('today', withdrawForm.payment_method).total_shipping?.toFixed(2)}</small>
                            </div>
                        </div>
                        <div className="text-center">
                            <h6 className="mb-1">Year {withdrawForm.payment_method ? 'Selected Method' : 'Overall'}</h6>
                            <h5 className={`mb-0 ${getDisplayAmount('year') >= 0 ? 'text-success' : 'text-danger'}`}>
                                ${getDisplayAmount('year')?.toFixed(2)}
                            </h5>
                            {/* Added new sums for year - ONLY what you asked for */}
                            <div className="mt-1">
                                <small className="text-muted d-block">Remaining Deposit: ${getStatistics('year', withdrawForm.payment_method).remaining_deposit_amount?.toFixed(2)}</small>
                                <small className="text-muted d-block">Commission: ${getStatistics('year', withdrawForm.payment_method).total_commission?.toFixed(2)}</small>
                                <small className="text-muted d-block">Shipping: ${getStatistics('year', withdrawForm.payment_method).total_shipping?.toFixed(2)}</small>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Transactions Datatable */}
            <Datatable
                key={refreshKey}
                useDatatable={useDatatable}
                initialOrder={{column: 'id', dir: 'desc'}}
                defaultSortField={'id'}
                defaultSortAsc={false}
                conditions={conditions}
                actions={actions}
                columns={[
                    {
                        name: 'ID',
                        selector: 'id',
                        sortable: true
                    },
                    {
                        name: 'Transaction Id',
                        selector: 'transaction_id',
                        sortable: true,
                        minWidth: '350px'
                    },
                    {
                        name: 'Type',
                        selector: 'type',
                        sortable: true,
                        cell: row => (
                            <span className={`badge badge-${row.type === 'deposit' ? 'success' : 'danger'}`}>
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
                        name: 'Payment Method',
                        selector: 'payment_method_id',
                        sortable: true,
                        cell: row => row.paymentMethod || '-'
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