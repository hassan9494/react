import { Fragment } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useSourceDatatable } from '@data/use-source'
import actions from './actions'
import {Badge} from "reactstrap"
import ability from "../../configs/acl/ability"

const canAddSource = ability.can('read', 'source_add')
const Tables = () => (
    <Fragment>
        <Breadcrumbs breadCrumbTitle='Sources' breadCrumbActive='Sources' />
        <Datatable
            add={canAddSource ? '/source/add' : null}
            useDatatable={useSourceDatatable}
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
