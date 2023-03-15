import { Fragment } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-order'
import actions from '../actions'

const Tables = () => (
    <Fragment>
        <Breadcrumbs breadCrumbTitle='Orders' breadCrumbActive='Orders' />
        <Datatable
            useDatatable={useDatatable}
            initialOrder={{column: 'id', dir: 'desc'}}
            defaultSortField={'number'}
            defaultSortAsc={false}
            conditions={{ status: 'CANCELED', 'options->taxed': true }}
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
                    name: 'email',
                    selector: 'customer.email',
                    sortable: true,
                    sortField: 'customer->email',
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
                    minWidth: '100px'
                }
            ]}
        />
    </Fragment>
)

export default Tables
