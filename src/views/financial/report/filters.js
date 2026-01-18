import { Button, Card, CardBody, Col, Row } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import Flatpickr from 'react-flatpickr'
import { useEffect, useState } from 'react'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { Database, File } from 'react-feather'
import moment from 'moment'
import { pickBy, identity } from 'lodash'
import { transactionApi } from '@data/use-report'
import { transactionsToExcel  } from '@helpers/Transaction'
import { api as paymentMethodApi } from '@data/use-payment-method' // Import payment method API

const TypeOptions = [
    { value: 'deposit', label: 'Deposit' },
    { value: 'withdraw', label: 'Withdraw' },
    { value: 'refund', label: 'Refund' } // Added refund type
]

const Tables = ({ onChange }) => {

    const [from, setFrom] = useState()
    const [to, setTo] = useState()
    const [type, setType] = useState()
    const [payment_method_id, setPaymentMethodId] = useState()
    const [paymentMethodOptions, setPaymentMethodOptions] = useState([]) // State for dynamic payment methods

    // Fetch payment methods on component mount
    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                const response = await paymentMethodApi.index()
                console.log('Payment methods:', response)

                // Transform the API response to options format
                const options = (response || []).map(method => ({
                    value: method.id,
                    label: method.name
                }))

                setPaymentMethodOptions(options)
            } catch (error) {
                console.error('Failed to fetch payment methods:', error)
                toast.error('Failed to load payment methods')
            }
        }

        fetchPaymentMethods()
    }, [])

    const onPrint = () => {
        // if (!from || !to) return
        const newTo = moment(to).add(1, 'days').format('Y-MM-DD')
        const params = new URLSearchParams(pickBy({ from, newTo, type, payment_method_id }, identity)).toString()
        window.open(`/reports/zemam/print?${params}`, '_blank')
    }

    const handleExport = async () => {
        // if (!from || !to) return
        const newTo = moment(to).add(1, 'days').format('Y-MM-DD')

        const params = new URLSearchParams(pickBy({ from, newTo, type, payment_method_id }, identity)).toString()
        const data = await transactionApi.order(params)
        let fileName = ''
        if (!from || !to) {
            fileName =  `transactions`
        } else {
            fileName =  `${from}__${to}`
        }

        if (type) fileName += `__${type}`

        transactionsToExcel(data, fileName)
    }

    useEffect(() => {
        onChange(pickBy({ from, to, type, payment_method_id }, identity))
    }, [from, to, type, payment_method_id])

    return (
        <Card>
            <CardBody>
                <Row>
                    <Col md='3'>
                        <Flatpickr className='form-control' value={from} onChange={date => setFrom(moment(new Date(date)).format('Y-MM-DD'))} placeholder={'Start Date'} />
                    </Col>
                    <Col md='2'>
                        <Flatpickr className='form-control' value={to} onChange={date => setTo(moment(new Date(date)).format('Y-MM-DD'))} placeholder={'End Date'} />
                    </Col>
                    <Col md='3'>
                        <Select
                            isClearable={true}
                            theme={selectThemeColors}
                            className='react-select'
                            classNamePrefix='select'
                            placeholder='Payment Method'
                            options={paymentMethodOptions} // Use dynamic payment methods
                            onChange={item => setPaymentMethodId(item?.value)}
                        />
                    </Col>
                    <Col md='2'>
                        <Select
                            isClearable={true}
                            theme={selectThemeColors}
                            className='react-select'
                            classNamePrefix='select'
                            placeholder='Type'
                            options={TypeOptions} // Now includes refund
                            onChange={item => setType(item?.value)}
                        />
                    </Col>
                    <Col md='2'>
                        <Button.Ripple size='block' color='secondary' onClick={e => handleExport()}>
                            <Database size={14} />
                            <span className='align-middle ml-25'>Excel</span>
                        </Button.Ripple>
                    </Col>
                    {/*<Col md='2'>*/}
                    {/*    <Button.Ripple size='block' color='danger' onClick={e => onPrint()}>*/}
                    {/*        <File size={14} />*/}
                    {/*        <span className='align-middle ml-25'>Print & PDF</span>*/}
                    {/*    </Button.Ripple>*/}
                    {/*</Col>*/}
                </Row>
            </CardBody>
        </Card>
    )
}

export default Tables