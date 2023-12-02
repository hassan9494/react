import {Fragment, useState} from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-order'
import actions from '../actions'

const Tables = () => (

    <Fragment>
        <Breadcrumbs breadCrumbTitle='Orders' breadCrumbActive='Orders' />
        <Datatable
            useDatatable={useDatatable}
            actions={actions}
            initialOrder={{column: 'id', dir: 'desc'}}
            defaultSortField={'number'}
            defaultSortAsc={false}
            conditions={[
                {
                    col: 'status', op: '=', val: 'PENDING'
                },
                    {
                        col: 'options->price_offer', op: '=', val: true
                    }
                ]}
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
