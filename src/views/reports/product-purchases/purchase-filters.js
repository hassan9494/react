// src/views/reports/product-purchases/purchase-filters.js
import { Button, Card, CardBody, Col, Row } from 'reactstrap'
import Flatpickr from 'react-flatpickr'
import { useState } from 'react'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { Database, RefreshCw } from 'react-feather'
import moment from 'moment'
import { pickBy, identity } from 'lodash'
import { api } from '@data/use-purchases-report'
import { useParams } from "react-router-dom"

const PurchaseFilters = ({ onChange }) => {

    const [from, setFrom] = useState()
    const [to, setTo] = useState()
    const { id } = useParams()

    const handleSearch = () => {
        onChange(pickBy({ from, to }, identity))
    }

    const handleReset = () => {
        setFrom(undefined)
        setTo(undefined)
        onChange({}) // Reset the filters
    }

    const handleExport = async () => {
        if (!from || !to) {
            alert('Please select both start and end dates for export')
            return
        }
        const params = new URLSearchParams(pickBy({ from, to, product_id: id }, identity)).toString()
        const data = await api.productPurchases(params)
        // Implement Excel export here
        console.log('Export data:', data)
        alert('Excel export functionality would be implemented here')
    }

    return (
        <Card>
            <CardBody>
                <Row>
                    <Col md='3'>
                        <Flatpickr
                            className='form-control'
                            value={from}
                            onChange={date => setFrom(moment(new Date(date)).format('Y-MM-DD'))}
                            placeholder={'Start Date'}
                        />
                    </Col>
                    <Col md='3'>
                        <Flatpickr
                            className='form-control'
                            value={to}
                            onChange={date => setTo(moment(new Date(date)).format('Y-MM-DD'))}
                            placeholder={'End Date'}
                        />
                    </Col>
                    <Col md='6' className="d-flex justify-content-end">
                        <Button.Ripple
                            color='primary'
                            onClick={handleSearch}
                            className="mr-1"
                        >
                            <span className='align-middle'>Search</span>
                        </Button.Ripple>

                        <Button.Ripple
                            color='secondary'
                            onClick={handleReset}
                            className="mr-1"
                        >
                            <RefreshCw size={14} />
                            <span className='align-middle ml-25'>Reset</span>
                        </Button.Ripple>

                        {/* <Button.Ripple 
                            color='success' 
                            onClick={handleExport}
                        >
                            <Database size={14} />
                            <span className='align-middle ml-25'>Excel</span>
                        </Button.Ripple> */}
                    </Col>
                </Row>

                {/* Show active filters */}
                {/* {(from || to) && (
                    <Row className="mt-2">
                        <Col>
                            <small className="text-muted">
                                Active filters: 
                                {from && ` From: ${from}`}
                                {to && ` To: ${to}`}
                            </small>
                        </Col>
                    </Row>
                )} */}
            </CardBody>
        </Card>
    )
}

export default PurchaseFilters
