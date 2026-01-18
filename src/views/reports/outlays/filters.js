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
import { outlaysToExcel  } from '@helpers/Outlay'
import {outlayApi} from "../../../data/use-report"

const statusOptions = [{ value: 'ADMINISTRATIVE', label: 'ادارية' }]

const TaxedOptions = [
    { value: 'ADMINISTRATIVE', label: 'ادارية' },
    { value: 'GENERAL', label: 'عمومية' },
    { value: 'OTHER', label: 'اخرى' }

]


const Tables = ({ onChange }) => {

    const [from, setFrom] = useState()
    const [to, setTo] = useState()
    const [sub_type, setSubType] = useState(null)

    const onPrint = () => {
        if (!from || !to) return
        const params = new URLSearchParams(pickBy({ from, to, sub_type }, identity)).toString()
        window.open(`/reports/outlays/print?${params}`)
    }

    const handleExport = async () => {
        if (!from || !to) return
        const params = new URLSearchParams(pickBy({ from, to, sub_type }, identity)).toString()
        const data = await outlayApi.order(params)
        let fileName =  `${from}__${to}`

        if (sub_type === 'ADMINISTRATIVE' || sub_type === 'GENERAL' || sub_type === 'OTHER') fileName += `__${sub_type}`
        outlaysToExcel(data, fileName)
    }

    useEffect(() => {
        onChange(pickBy({ from, to, sub_type }, identity))
    }, [from, to, sub_type])

    return (
        <Card>
            <CardBody>
                <Row>
                    <Col md='3'>
                        <Flatpickr className='form-control' value={from} onChange={date => setFrom(moment(new Date(date)).format('Y-MM-DD'))} placeholder={'Start Date'} />
                    </Col>
                    <Col md='3'>
                        <Flatpickr className='form-control' value={to} onChange={date => setTo(moment(new Date(date)).format('Y-MM-DD'))} placeholder={'End Date'} />
                    </Col>
                    <Col md='2'>
                        <Select
                            isClearable={true}
                            theme={selectThemeColors}
                            className='react-select'
                            classNamePrefix='select'
                            placeholder='النوع'
                            options={TaxedOptions}
                            onChange={item => setSubType(item?.value)}
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
