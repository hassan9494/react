import { Fragment } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-invoice'
import actions from './actions'
import ability from "./../../configs/acl/ability"
import {Badge} from "reactstrap"


const shippingStatusClasses = {
    DRAFT: 'light-warning',
    CANCELED: 'light-info',
    COMPLETED: 'light-success'
}
const Tables = () => {
    console.log(ability.can('read', 'invoice_list_view'))
    const canAddInvoice = ability.can('read', 'invoice_add')
    return <Fragment>
        <Breadcrumbs breadCrumbTitle='Invoices' breadCrumbActive='Invoices' />
        <Datatable
            useDatatable={useDatatable}
            initialOrder={{column: 'id', dir: 'desc'}}
            defaultSortField={'number'}
            defaultSortAsc={false}
            // conditions= {!ability.can('read', 'untaxed_list_view') ?  {'options->taxed': true, status: 'COMPLETED' } : { status: 'COMPLETED'}}
            actions={actions}
            add={canAddInvoice ? '/invoice/create' : null}
            columns={[
                {
                    name: 'Number',
                    selector: 'number',
                    sortable: true,
                    sortField: 'id',
                    minWidth: '100px'
                },
                {
                    name: 'Note',
                    selector: 'note',
                    sortable: true,
                    sortField: 'id',
                    minWidth: '100px'
                },
                {
                    name: 'Status',
                    selector: 'status',
                    sortable: true,
                    sortField: 'status',
                    minWidth: '100px',
                    cell: row => (
                        <Badge className='text-capitalize' color={shippingStatusClasses[row?.status] || ''} pill>
                            {row?.status}
                        </Badge>
                    )
                }
            ]}
        />
    </Fragment>
}


export default Tables
