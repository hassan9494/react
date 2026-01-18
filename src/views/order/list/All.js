import { Fragment, useState, useMemo } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-order'
import actions from '../actions'
import ability from "../../../configs/acl/ability"
import { Badge, Row, Col, Label, Button, Card, CardBody } from "reactstrap"
import Select from 'react-select'

const customSelectStyles = {
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#133695' : state.isFocused ? '#e9ecef' : provided.backgroundColor,
        color: state.isSelected ? '#fff' : state.isFocused ? '#333' : provided.color,
        '&:hover': {
            backgroundColor: state.isSelected ? '#133695' : '#e9ecef',
            color: state.isSelected ? '#fff' : '#333'
        }
    }),
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: '#133695'
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: '#fff'
    }),
    multiValueRemove: (provided) => ({
        ...provided,
        color: '#fff',
        ':hover': {
            backgroundColor: '#0d2a7a',
            color: '#fff'
        }
    })
}
const Tables = () => {
    const [infoFilters, setInfoFilters] = useState([])
    const [statusFilters, setStatusFilters] = useState([])
    const [debugInfo, setDebugInfo] = useState('')

    // Prepare filter conditions based on selected options
    const filterConditions = useMemo(() => {
        const conditions = []

        // Info filters
        infoFilters.forEach(filter => {
            switch (filter.value) {
                case 'dept':
                    conditions.push({col: 'options->dept', op: '=', val: true})
                    break
                case 'taxed':
                    conditions.push({col: 'options->taxed', op: '=', val: true})
                    break
                case 'normal':
                    conditions.push({col: 'options->taxed', op: '=', val: false})
                    break
                case 'tax_exempt':
                    conditions.push({col: 'options->tax_exempt', op: '=', val: true})
                    break
                case 'price_offer':
                    conditions.push({col: 'options->price_offer', op: '=', val: true})
                    break
                default: break
            }
        })

        // Status filters
        if (statusFilters.length > 0) {
            conditions.push({col: 'status', op: 'IN', val: statusFilters.map(f => f.value)})
        }

        return conditions
    }, [infoFilters, statusFilters])

    const infoOptions = [
        { value: 'dept', label: 'Zemam' },
        { value: 'taxed', label: 'Taxed' },
        { value: 'normal', label: 'Normal' },
        { value: 'tax_exempt', label: 'M3fe' },
        { value: 'price_offer', label: 'Offer/ Price Offer' }
    ]

    const statusOptions = [
        { value: 'PENDING', label: 'New Order' },
        { value: 'PROCESSING', label: 'Processing' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'CANCELED', label: 'Deleted' }
    ]

    // Clear all filters
    const clearFilters = () => {
        setInfoFilters([])
        setStatusFilters([])
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Orders' breadCrumbActive='Orders' />

            {/* Filters Section */}
            <Row className="mb-2">
                <Col md="5">
                    <Label for="info-filter">Info Filter</Label>
                    <Select
                        id="info-filter"
                        isMulti
                        options={infoOptions}
                        className="react-select"
                        classNamePrefix="select"
                        value={infoFilters}
                        onChange={setInfoFilters}
                        placeholder="Filter by info..."
                        styles={customSelectStyles}  // Add this line
                    />
                </Col>
                <Col md="5">
                    <Label for="status-filter">Status Filter</Label>
                    <Select
                        id="status-filter"
                        isMulti
                        options={statusOptions}
                        className="react-select"
                        classNamePrefix="select"
                        value={statusFilters}
                        onChange={setStatusFilters}
                        placeholder="Filter by status..."
                        styles={customSelectStyles}  // Add this line
                    />
                </Col>
                <Col md="2" className="d-flex align-items-end">
                    <Button color="primary" onClick={clearFilters} className="w-100">
                        Clear Filters
                    </Button>
                </Col>
            </Row>

            {/* Debug Info */}
            {/* <Card className="mb-2">
                <CardBody>
                    <h6>Debug Info (Filter Conditions):</h6>
                    <pre>{debugInfo}</pre>
                </CardBody>
            </Card> */}

            <Datatable
                useDatatable={useDatatable}
                initialOrder={{column: 'id', dir: 'desc'}}
                defaultSortField={'number'}
                defaultSortAsc={false}
                conditions={filterConditions}
                actions={actions}
                columns={[
                    {
                        name: 'Number',
                        selector: 'number',
                        sortable: true,
                        sortField: 'id',
                        minWidth: '100px'
                    },
                    {
                        name: 'Taxed Number',
                        selector: 'tax_number',
                        sortable: true,
                        sortField: 'tax_number',
                        minWidth: '100px',
                        cell: row => row?.tax_number ?? '-----'
                    },
                    {
                        name: 'customer',
                        selector: 'customer.name',
                        sortable: true,
                        sortField: 'customer->name',
                        minWidth: '100px'
                    },
                    {
                        name: 'notes',
                        selector: 'notes',
                        sortable: true,
                        sortField: 'notes',
                        minWidth: '100px'
                    },
                    {
                        name: 'Info',
                        sortable: false,
                        minWidth: '100px',
                        cell: row => (
                            <>
                                {
                                    row.options?.dept &&
                                    <Badge className='text-capitalize' color={'light-secondary'} pill>Zemam</Badge>
                                }
                                {
                                    row.options?.taxed &&
                                    <Badge className='text-capitalize' color={'light-secondary'} pill>Taxed</Badge>
                                }
                                {
                                    !row.options?.taxed &&
                                    <Badge className='text-capitalize' color={'light-secondary'} pill>Normal</Badge>
                                }
                                {
                                    row.options?.tax_exempt &&
                                    <Badge className='text-capitalize' color={'light-secondary'} pill>M3fe</Badge>
                                }
                                {
                                    row.options?.price_offer &&
                                    <Badge className='text-capitalize' color={'light-secondary'} pill>Offer</Badge>
                                }
                            </>
                        )
                    },
                    {
                        name: 'Status',
                        sortable: false,
                        minWidth: '100px',
                        cell: row => (
                            <>
                                {
                                    (row.options?.price_offer && row.status === 'PENDING') &&
                                    <Badge className='text-capitalize' color={'light-secondary'} pill>Price Offer</Badge>
                                }
                                {
                                    (!row.options?.taxed && row.status === 'CANCELED') &&
                                    <Badge className='text-capitalize' color={'light-secondary'} pill>DELETED</Badge>
                                }
                                {
                                    (row.options?.taxed && row.status === 'CANCELED') &&
                                    <Badge className='text-capitalize' color={'light-secondary'} pill>RETURNED</Badge>
                                }
                                {
                                    ((row.options?.taxed && !row.options?.price_offer  && row.status === 'PENDING') || (!row.options?.price_offer  && row.status === 'PENDING')) &&
                                    <Badge className='text-capitalize' color={'light-secondary'} pill>New Order</Badge>
                                }
                                {
                                    (!row.options?.dept && row.shipping?.status !== 'SHIPPED' && row.shipping?.status !== 'DELIVERED'  && row.status === 'PROCESSING') &&
                                    <Badge className='text-capitalize' color={'light-secondary'} pill>Processing</Badge>
                                }
                                {
                                    (row.shipping?.status !== 'WAITING' && row.shipping?.status !== null  && row.status === 'PROCESSING') &&
                                    <Badge className='text-capitalize' color={'light-secondary'} pill>Delivery</Badge>
                                }
                                {
                                    (row.status === 'COMPLETED') &&
                                    <Badge className='text-capitalize' color={'light-secondary'} pill>COMPLETED</Badge>
                                }
                            </>
                        )
                    },
                    {
                        name: 'customer',
                        selector: 'customer.phone',
                        sortField: 'customer->phone',
                        sortable: true,
                        minWidth: '100px'
                    },
                    {
                        name: 'Total',
                        selector: 'total',
                        sortable: true,
                        minWidth: '100px',
                        cell: row => Number.parseFloat(row?.total).toFixed(2)
                    }
                ]}
            />
        </Fragment>
    )
}

export default Tables
