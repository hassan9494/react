import { Button, Card, CardBody, Col, Row } from 'reactstrap'
import Flatpickr from 'react-flatpickr'
import { useEffect, useState } from 'react'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import moment from 'moment'
import { pickBy, identity } from 'lodash'
import {Database} from "react-feather"
import { productsToExcel  } from '@helpers/Product'
import { api } from '@data/use-report'

const Tables = ({ onChange }) => {

    const [from, setFrom] = useState()
    const [to, setTo] = useState()

    useEffect(() => {
        onChange(pickBy({ from, to }, identity))
    }, [from, to])

    const handleExport = async () => {
        console.log(from)
        console.log(to)

        if (!from || !to) return
        setTo(moment(to).add(1, 'days').format('Y-MM-DD'))
        const params = new URLSearchParams(pickBy({ from, to }, identity)).toString()
        const data = await api.product(params)
        let fileName =  `${from}__${to}`

        if (status) fileName += `__${status}`

        productsToExcel(data, fileName)
    }
    return (
        <Card>
            <CardBody>
                <Row>
                    <Col md='5'>
                        <Flatpickr className='form-control' value={from} onChange={date => setFrom(moment(new Date(date)).format('Y-MM-DD'))} placeholder={'Start Date'} />
                    </Col>
                    <Col md='5'>
                        <Flatpickr className='form-control' value={to} onChange={date => setTo(moment(new Date(date)).format('Y-MM-DD'))} placeholder={'End Date'} />
                    </Col>
                    <Col md='2'>
                        <Button.Ripple size='block' color='secondary' onClick={e => handleExport()}>
                            <Database size={14} />
                            <span className='align-middle ml-25'>Excel</span>
                        </Button.Ripple>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    )
}

export default Tables
