import { Fragment } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-order'
import actions from '../actions'
import ability from "../../../configs/acl/ability"
import {Badge} from "reactstrap"
import { useModels as useCities } from '@data/use-city'

const shippingStatusClasses = {
    WAITING: 'light-warning',
    SHIPPED: 'light-info',
    DELIVERED: 'light-success'
}

const Tables = () => {
    const { data: cities } = useCities()
    console.log(cities)
    return (
        <Fragment>
        <Breadcrumbs breadCrumbTitle='Orders' breadCrumbActive='Orders' />
        <Datatable
            useDatatable={useDatatable}
            actions={actions}
            initialOrder={{column: 'id', dir: 'desc'}}
            defaultSortField={'number'}
            defaultSortAsc={false}
            conditions={(!ability.can('read', 'show_all_orders')) ?  {not_admin: true, pending: true } : {  pending: true}}
            // conditions={{ pending: true}}
            columns={[
                {
                    name: 'Number',
                    selector: 'number',
                    sortable: true,
                    sortField: 'id'
                },
                {
                    name: 'customer',
                    selector: 'customer.name',
                    sortable: true,
                    sortField: 'customer->name'
                },
                {
                    name: 'phone',
                    selector: 'customer.phone',
                    sortField: 'customer->phone',
                    sortable: true
                },
                {
                    name: 'notes',
                    selector: 'notes',
                    sortable: true,
                    width: '300px'
                },
                {
                    name: 'shipping',
                    selector: 'shipping.city',
                    sortable: true,
                    sortField: 'shipping->city',
                    minWidth: '100px',
                    cell: row => cities.find(city => city.id === row.city_id)?.name ?? row.shipping.city
                },
                {
                    name: 'shipping Status',
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
