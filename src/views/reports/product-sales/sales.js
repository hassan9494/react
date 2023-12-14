import {Fragment, React, useState} from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useSales } from '@data/use-report'
import Filters from './sales-filter'
import moment from 'moment'
import {useParams} from "react-router-dom"
import {Badge, Col} from "reactstrap"
import Repeater from "../../../@core/components/repeater"

const Tables = () => {


    const { id } = useParams()

    const fixedConditions = [
        {
            product: 'products.id', id: {id}.id
        },
        {
            col: 'status', val: 'COMPLETED'
        }

    ]


    const [conditions, setConditions] = useState([...fixedConditions])

    const status = [
        'light-warning',
        'light-success'
    ]

    const onFiltersChange = (filters) => {
        const updated = [...fixedConditions]
        if (filters.from) updated.push({col: 'taxed_at',  op: '>=', val: filters.from})
        if (filters.oldTo) updated.push({col: 'taxed_at',  op: '<=', val: moment(filters.oldTo).add(1, 'days').format('Y-MM-DD')})
        if (filters.status) updated.push({col: 'status', val: filters.status})
        if (filters.exempt) updated.push({col: 'options->tax_exempt', val: filters.exempt})
        setConditions(updated)
    }
    const conditionalRowStyles = [
        {
            when: row => row?.products?.length > 1,
            style: {
                minHeight: '100px'
            }
        }
    ]

    return (
        <Fragment>

            <Breadcrumbs breadCrumbTitle='Reports' breadCrumbActive='Product Sales' />

            <Filters onChange={onFiltersChange} />

            <Datatable
                useDatatable={useSales}
                conditions={conditions}
                header={false}
                conditionalRowStyles={conditionalRowStyles}
                columns={[
                    {
                        name: 'Number',
                        selector: 'number',
                        sortable: true,
                        sortField: 'id',
                        minWidth: '100px'
                    },
                    {
                        name: 'date',
                        selector: 'taxed_at',
                        sortable: true,
                        minWidth: '100px',
                        cell: row => moment(row.taxed_at).format('Y-MM-DD')
                    },
                    {
                        name: 'customer',
                        selector: 'customer.name',
                        sortable: true,
                        sortField: 'customer->name',
                        minWidth: '100px'
                    },
                    {
                        name: 'customer',
                        selector: 'customer.phone',
                        sortField: 'customer->phone',
                        sortable: true,
                        minWidth: '100px'
                    },
                    {
                        name: 'Quantity',
                        selector: 'products',
                        sortField: 'customer->phone',
                        sortable: true,
                        minWidth: '100px',
                        allowOverflow: true,
                        wrap : true,
                        cell:  (row, index, column) => (
                            <>
                                {
                                    row?.products?.length > 1 &&
                                    <Repeater count={row?.products?.length}>
                                        {i => <Badge key={i}  className='badge-light-secondary d-block badge-pill '>{row?.products[i]?.name} : {row?.products[i]?.quantity}</Badge>}
                                    </Repeater>
                                },
                                {
                                row?.products?.length === 1 &&
                                    <div className='d-flex justify-content-between'>{row?.products[0]?.quantity}</div>

                            }
                            </>
                        )
                        
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
