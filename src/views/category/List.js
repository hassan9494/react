import { Fragment } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useCategoryDatatable } from '@data/use-category'
import actions from './actions'
import {Badge} from "reactstrap"
import ability from "../../configs/acl/ability"

const canAddCategory = ability.can('read', 'category_add')
const Tables = () => (
    <Fragment>
        <Breadcrumbs breadCrumbTitle='Categories' breadCrumbActive='Categories' />
        <Datatable
            add={canAddCategory ? '/category/add' : null}
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
                    name: 'Is Sub Category',
                    selector: 'parent',
                    sortable: true,
                    minWidth: '250px',
                    cell: row => (
                        <Badge className='text-capitalize' color={row.parent === 0 ?  'light-warning' : 'light-success' } pill>
                            {row.parent === 0 ? 'No' : 'Yes'}
                        </Badge>
                    )
                },
                {
                    name: 'Order',
                    selector: 'order',
                    sortable: true,
                    minWidth: '250px'
                }
            ]}
        />
    </Fragment>
)

export default Tables
