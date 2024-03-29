import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-order'
import Filters from './filters'
import moment from 'moment'
import {Badge} from "reactstrap"
import {forEach} from "lodash"

const Tables = () => {

    const fixedConditions = [
        {
            col: 'status', op: '=', val: 'PROCESSING'
        },
        {
            col: 'shipping->status', op: '!=', val: null
        },
        {
            col: 'shipping->status', op: '!=', val: 'WAITING'
        }
    ]

    const shippingStatusClasses = {
        WAITING: 'light-warning',
        SHIPPED: 'light-info',
        DELIVERED: 'light-success'
    }


    const [conditions, setConditions] = useState([...fixedConditions])
    let shippingCostSum = 0


    const onFiltersChange = (filters) => {
        const updated = [...fixedConditions]
        if (filters.from) updated.push({col: 'created_at',  op: '>=', val: filters.from})
        if (filters.to) updated.push({col: 'created_at',  op: '<=', val: moment(filters.to).add(1, 'days').format('Y-MM-DD')})
        if (filters.provider) updated.push({col: 'shipping_provider_id', val: filters.provider})
        setConditions(updated)
    }

    const { data: orders } = useDatatable({ page : 0, limit : 10, search : '', order : {}, conditions })
    const ordersList = orders.map(e => ({ shipping: e.shipping, id: e.id }))

    ordersList.forEach((index) => {
        if (index.shipping.cost > 0) shippingCostSum += Number.parseFloat(index.shipping.cost)
    })

    return (
        <Fragment>

            <Breadcrumbs breadCrumbTitle='Reports' breadCrumbActive='Order Shipping Provider' />

            <Filters onChange={onFiltersChange} />

            <Datatable
                useDatatable={useDatatable}
                conditions={conditions}
                header={true}
                footer={true}
                title={`Total Cost is : ${ shippingCostSum}`}
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
                        name: 'Shipping Cost',
                        selector: 'shipping.cost',
                        sortable: true,
                        minWidth: '100px',
                        cell: row => (
                            <>
                                {
                                    row.shipping?.cost  &&
                                    Number.parseFloat(row?.shipping?.cost).toFixed(2)
                                }
                                {/*{*/}
                                {/*    row.shipping?.cost  &&*/}
                                {/*    setX(x + row.shipping?.cost)*/}
                                {/*}*/}
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
