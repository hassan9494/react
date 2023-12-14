import { Fragment } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-order'
import actions from '../actions'
import ability from "../../../configs/acl/ability"

const Tables = () => (
    <Fragment>
        <Breadcrumbs breadCrumbTitle='Orders' breadCrumbActive='Orders' />
        <Datatable
            useDatatable={useDatatable}
            actions={actions}
            initialOrder={{column: 'id', dir: 'desc'}}
            defaultSortField={'number'}
            defaultSortAsc={false}
            conditions={(!ability.can('read', 'untaxed_list_view') && !ability.can('read', 'befor_completed_untaxed_list_view')) ?  {'options->taxed': true, status: 'PENDING', 'options->price_offer': false } : { status: 'PENDING', 'options->price_offer': false}}
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

export default Tables
