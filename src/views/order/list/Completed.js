import { Fragment } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-order'
import actions from '../actions'
import ability from "../../../configs/acl/ability"

const Tables = () => {
    return <Fragment>
        <Breadcrumbs breadCrumbTitle='Orders' breadCrumbActive='Orders' />
        <Datatable
            useDatatable={useDatatable}
            initialOrder={{column: 'id', dir: 'desc'}}
            defaultSortField={'number'}
            defaultSortAsc={false}
            conditions= {!ability.can('read', 'untaxed_list_view') ?  {'options->taxed': true, status: 'COMPLETED' } : { status: 'COMPLETED'}}
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
}


export default Tables
