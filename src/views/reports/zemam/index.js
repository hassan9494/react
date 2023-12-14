import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-order'
import Filters from './filters'
import moment from 'moment'
import {Badge} from "reactstrap"

const Tables = () => {

    const fixedConditions = [
        {
            col: 'options->dept', val: true
        }
    ]

    const shippingStatusClasses = {
        WAITING: 'light-warning',
        SHIPPED: 'light-info',
        DELIVERED: 'light-success'
    }

    const [conditions, setConditions] = useState([...fixedConditions])

    const onFiltersChange = (filters) => {
        let updated = []

        if (filters.dept !== "false" || filters.dept === null) {
             updated = [...fixedConditions]
        }

        if (filters.from) updated.push({col: 'taxed_at|updated_at',  op: '>=', val: filters.from})
        if (filters.to) updated.push({col: 'taxed_at|updated_at',  op: '<=', val: moment(filters.to).add(1, 'days').format('Y-MM-DD')})
        if (filters.status) updated.push({col: 'status', val: filters.status})
        if (filters.dept) updated.push({col: 'options->dept', val: filters.dept})
        setConditions(updated)
    }

    return (
        <Fragment>

            <Breadcrumbs breadCrumbTitle='Reports' breadCrumbActive='Orders' />

            <Filters onChange={onFiltersChange} />

            <Datatable
                useDatatable={useDatatable}
                conditions={conditions}
                header={false}
                columns={[
                    {
                        name: 'Number',
                        selector: 'number',
                        sortable: true,
                        defaultSortAsc: false,
                        sortField: 'id',
                        minWidth: '100px'
                    },
                    {
                        name: 'date',
                        selector: 'created_at',
                        sortable: true,
                        minWidth: '100px',
                        cell: row => (row.taxed_at ? moment(row.taxed_at).format('Y-MM-DD') : moment(row.updated_at).format('Y-MM-DD'))
                    },
                    {
                        name: 'customer',
                        selector: 'customer.name',
                        sortable: true,
                        sortField: 'customer->name',
                        minWidth: '100px'
                    },
                    {
                        name: 'phone',
                        selector: 'customer.phone',
                        sortable: true,
                        sortField: 'customer->phone',
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
                        name: 'shipping',
                        selector: 'shipping.status',
                        sortable: true,
                        sortField: 'shipping->status',
                        minWidth: '100px',
                        cell: row => (
                            <Badge className='text-capitalize' color={shippingStatusClasses[row?.shipping?.status] || ''} pill>
                                {row?.shipping?.status}
                            </Badge>
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
