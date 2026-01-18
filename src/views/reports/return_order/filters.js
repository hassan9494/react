import { Button, Card, CardBody, Col, Row } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import Flatpickr from 'react-flatpickr'
import { useEffect, useState } from 'react'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { Database, File } from 'react-feather'
import moment from 'moment'
import { pickBy, identity } from 'lodash'
import { api } from '@data/use-report'
import { ordersToExcel  } from '@helpers/ReturnOrder'


const statusOptions = [
    { value: '0', label: 'غير مرحلة الى الضريبة' },
    { value: '1', label: 'مرحلة الى الضريبة' }
]


const Tables = ({ onChange }) => {

    const [from, setFrom] = useState()
    const [to, setTo] = useState()
    const [status, setStatus] = useState()

    const onPrint = () => {
        if (!from || !to) return
        const newTo = moment(to).add(1, 'days').format('Y-MM-DD')
        const params = new URLSearchParams(pickBy({ from, newTo, status }, identity)).toString()
        window.open(`/reports/order/print?${params}`, '_blank')
    }

    const handleExport = async () => {
        if (!from || !to) return
        const newTo = moment(to).add(1, 'days').format('Y-MM-DD')
        const params = new URLSearchParams(pickBy({ from, newTo, status }, identity)).toString()
        const data = await api.return_order(params)
        let fileName =  `${from}__${to}`

        if (status) fileName += `__${status}`

        ordersToExcel(data, fileName)
    }

    useEffect(() => {
        onChange(pickBy({ from, to, status }, identity))
    }, [from, to, status])

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
