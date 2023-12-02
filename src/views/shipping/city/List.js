import { Fragment } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-city'
import actions from './actions'
import ability from "../../../configs/acl/ability"

const canAddCity = ability.can('read', 'city_add')
const Tables = () => (
    <Fragment>
        <Breadcrumbs breadCrumbTitle='Cities' breadCrumbActive='Cities' />
        <Datatable
            add={canAddCity ? '/city/add' : null}
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
                    name: 'Cost',
                    selector: 'shipping_cost',
                    sortable: true,
                    minWidth: '250px'
                }
            ]}
        />
    </Fragment>
)

export default Tables
