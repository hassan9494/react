import { Fragment } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-shipping-provider'
import actions from './actions'
import ability from "../../../configs/acl/ability"

const canAddProvider = ability.can('read', 'shipping_provider_add')
const Tables = () => (
    <Fragment>
        <Breadcrumbs breadCrumbTitle='Providers' breadCrumbActive='Providers' />
        <Datatable
            add={canAddProvider ? '/shipping-provider/add' : null}
            useDatatable={useDatatable}
            actions={actions}
            columns={[
                {
                    name: 'ID',
                    selector: 'id',
                    sortable: true,
                    minWidth: '100px'
                },
                {
                    name: 'Name',
                    selector: 'name',
                    sortable: true,
                    minWidth: '225px'
                },
                {
                    name: 'Phone',
                    selector: 'phone',
                    sortable: true,
                    minWidth: '250px'
                },
                {
                    name: 'Notes',
                    selector: 'notes',
                    sortable: true,
                    minWidth: '250px'
                }
            ]}
        />
    </Fragment>
)

export default Tables
