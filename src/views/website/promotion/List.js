import { Fragment } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-promotion'
import actions from './actions'

const Tables = () => (
    <Fragment>
        <Breadcrumbs breadCrumbTitle='Promotions' breadCrumbActive='Promotions' />
        <Datatable
            add='/promotion/add'
            useDatatable={useDatatable}
            actions={actions}
            columns={[
                {
                    name: 'Order',
                    selector: 'order',
                    sortable: true,
                    minWidth: '250px'
                },
                {
                    name: 'Name',
                    selector: 'name',
                    sortable: true,
                    minWidth: '225px'
                },
                {
                    name: 'Link',
                    selector: 'link',
                    sortable: true,
                    minWidth: '225px'
                }
            ]}
        />
    </Fragment>
)

export default Tables
