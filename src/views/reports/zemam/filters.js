import { Button, Card, CardBody, Col, Row } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import Flatpickr from 'react-flatpickr'
import { useEffect, useState } from 'react'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { Database, File } from 'react-feather'
import moment from 'moment'
import { pickBy, identity } from 'lodash'
import { zemamApi } from '@data/use-report'
import { ordersToExcel  } from '@helpers/Order'

const statusOptions = [
    { value: 'CANCELED', label: 'مرتجعة فقط' },
    { value: 'PROCESSING', label: 'PROCESSING' },
    { value: 'COMPLETED', label: 'COMPLETED' },
    { value: 'PENDING', label: 'PENDING' }
    ]

const DeptOptions = [
    { value: 'true', label: 'zemam' },
    { value: 'false', label: 'paid' }
]


const Tables = ({ onChange }) => {

    const [from, setFrom] = useState()
    const [to, setTo] = useState()
    const [status, setStatus] = useState()
    const [dept, setDept] = useState()

    const onPrint = () => {
        // if (!from || !to) return
        const newTo = moment(to).add(1, 'days').format('Y-MM-DD')
        const params = new URLSearchParams(pickBy({ from, newTo, status, dept }, identity)).toString()
        window.open(`/reports/zemam/print?${params}`, '_blank')
    }

    const handleExport = async () => {
        // if (!from || !to) return
        const newTo = moment(to).add(1, 'days').format('Y-MM-DD')

        const params = new URLSearchParams(pickBy({ from, newTo, status, dept }, identity)).toString()
        const data = await zemamApi.order(params)
        let fileName =  `${from}__${to}`

        if (status) fileName += `__${status}`

        ordersToExcel(data, fileName)
    }

    useEffect(() => {
        onChange(pickBy({ from, to, status, dept }, identity))
    }, [from, to, status, dept])

    return (
        <Card>
            <CardBody>
                <Row>
                    <Col md='2'>
                        <Flatpickr className='form-control' value={from} onChange={date => setFrom(moment(new Date(date)).format('Y-MM-DD'))} placeholder={'Start Date'} />
                    </Col>
                    <Col md='2'>
                        <Flatpickr className='form-control' value={to} onChange={date => setTo(moment(new Date(date)).format('Y-MM-DD'))} placeholder={'End Date'} />
                    </Col>
                    <Col md='2'>
                        <Select
                            isClearable={true}
                            theme={selectThemeColors}
                            className='react-select'
                            classNamePrefix='select'
                            placeholder='الحالة'
                            options={statusOptions}
                            onChange={item => setStatus(item?.value)}
                        />
                    </Col>
                    <Col md='2'>
                        <Select
                            isClearable={true}
                            theme={selectThemeColors}
                            className='react-select'
                            classNamePrefix='select'
                            placeholder='النوع'
                            options={DeptOptions}
                            onChange={item => setDept(item?.value)}
                        />
                    </Col>
                    <Col md='2'>
                        <Button.Ripple size='block' color='secondary' onClick={e => handleExport()}>
                            <Database size={14} />
                            <span className='align-middle ml-25'>Excel</span>
                        </Button.Ripple>
                    </Col>
                    <Col md='2'>
                        <Button.Ripple size='block' color='danger' onClick={e => onPrint()}>
                            <File size={14} />
                            <span className='align-middle ml-25'>Print & PDF</span>
                        </Button.Ripple>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    )
}

export default Tables
