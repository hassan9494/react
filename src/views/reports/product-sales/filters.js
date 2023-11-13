import { Button, Card, CardBody, Col, Row } from 'reactstrap'
import Flatpickr from 'react-flatpickr'
import { useEffect, useState } from 'react'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import moment from 'moment'
import { pickBy, identity } from 'lodash'

const Tables = ({ onChange }) => {

    const [from, setFrom] = useState()
    const [to, setTo] = useState()

    useEffect(() => {
        onChange(pickBy({ from, to }, identity))
    }, [from, to])

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
                        <Button.Ripple size='block' color='primary' onClick={e => onPrint()}>
                            <span className='align-middle ml-25'>Search</span>
                        </Button.Ripple>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    )
}

export default Tables
