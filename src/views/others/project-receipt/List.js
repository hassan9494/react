import { Fragment } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-project-receipt'
import actions from './actions'
import ability from "../../../configs/acl/ability"

const canAddReceipt = ability.can('read', 'receipt_add')
const Tables = () => (
    <Fragment>
        <Breadcrumbs breadCrumbTitle='Others' breadCrumbActive='Project Receipts' />
        <Datatable
            // add={canAddReceipt ? '/receipt/add' : null}
            useDatatable={useDatatable}
            actions={actions}
            initialOrder={{column: 'id', dir: 'desc'}}
            defaultSortField={'number'}
            defaultSortAsc={false}
            columns={[
                {
                    name: 'Number',
                    selector: 'number',
                    sortable: true,
                    sortField: 'id',
                    minWidth: '100px'
                },
                {
                    name: 'Name',
                    selector: 'name',
                    sortable: true
                },
                {
                    name: 'Type',
                    selector: 'type',
                    sortable: true
                },
                {
                    name: 'Amount',
                    selector: 'amount',
                    sortable: true
                }
            ]}
        />
    </Fragment>
)

export default Tables
