import { Fragment } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useBrandDatatable } from '@data/use-brand'
import actions from './actions'
import {Badge} from "reactstrap"
import ability from "../../configs/acl/ability"

const canAddBrand = ability.can('read', 'category_add')
const Tables = () => (
    <Fragment>
        <Breadcrumbs breadCrumbTitle='Brands' breadCrumbActive='Brands' />
        <Datatable
            add={canAddBrand ? '/brand/add' : null}
            useDatatable={useBrandDatatable}
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
                }
            ]}
        />
    </Fragment>
)

export default Tables
