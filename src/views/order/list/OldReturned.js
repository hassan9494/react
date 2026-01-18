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
            initialOrder={{column: 'id', dir: 'desc'}}
            defaultSortField={'number'}
            defaultSortAsc={false}
            conditions={[
                {
                    col: 'status', op: '=', val: 'CANCELED'
                },
                    {
                        col: 'options->taxed', op: '=', val: true
                    },
                !ability.can('read', 'untaxed_list_view') ? {
                    col: 'options->taxed',  val: true
                } : {

                }
                ]}
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
