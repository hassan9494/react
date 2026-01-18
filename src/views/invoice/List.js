import { Fragment } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-invoice'
import actions from './actions'
import ability from "./../../configs/acl/ability"
import {Badge} from "reactstrap"
import moment from "moment"


const shippingStatusClasses = {
    DRAFT: 'light-warning',
    CANCELED: 'light-info',
    COMPLETED: 'light-success'
}
const Tables = () => {

    const canAddInvoice = ability.can('read', 'invoice_add')
    return <Fragment>
        <Breadcrumbs breadCrumbTitle='Purchases' breadCrumbActive='Purchases' />
        <Datatable
            useDatatable={useDatatable}
            initialOrder={{column: 'date', dir: 'desc'}}
            defaultSortField={'date'}
            defaultSortAsc={false}
            conditions= {!ability.can('read', 'show_completed_invoices') ?  { status: 'DRAFT' } : { }}
            actions={actions}
            add={canAddInvoice ? '/invoice/create' : null}
            columns={[
                {
                    name: 'Name',
                    selector: 'name',
                    sortable: true,
                    sortField: 'name',
                    minWidth: '100px'
                },
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
                    name: 'Created Date',
                    selector: 'created_at',
                    sortable: true,
                    sortField: 'created_at',
                    minWidth: '100px',
                    cell: row => moment(row.created_at).format('YYYY-MM-DD')
                },
                {
                    name: 'Date',
                    selector: 'date',
                    sortable: true,
                    sortField: 'date',
                    minWidth: '100px',
                    cell: row => moment(row.date).format('YYYY-MM-DD')
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
