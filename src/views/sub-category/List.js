import { Fragment } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useCategoryDatatable } from '@data/use-category'
import actions from './actions'

const Tables = () => (
    <Fragment>
        <Breadcrumbs breadCrumbTitle='Categories' breadCrumbActive='Categories' />
        <Datatable
            add='/category/add'
            useDatatable={useCategoryDatatable}
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
                    selector: 'title',
                    sortable: true,
                    minWidth: '225px'
                },
                {
                    name: 'Slug',
                    selector: 'slug',
                    sortable: true,
                    minWidth: '250px'
                },
                {
                    name: 'Order',
                    selector: 'order',
                    sortable: true,
                    minWidth: '250px'
                },
                {
                    name: 'Parent',
                    selector: 'parent',
                    sortable: true,
                    minWidth: '250px'
                }
            ]}
        />
    </Fragment>
)

export default Tables
