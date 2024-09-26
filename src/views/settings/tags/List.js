import { Fragment } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-tag'
import actions from './actions'
import ability from "../../../configs/acl/ability"

const canAddTag = ability.can('read', 'slide_add')
const Tables = () => (
    <Fragment>
        <Breadcrumbs breadCrumbTitle='Tags' breadCrumbActive='Tags' />
        <Datatable
            add={canAddTag ? 'tag/add' : null}
            useDatatable={useDatatable}
            actions={actions}
            columns={[
                {
                    name: 'Name',
                    selector: 'name',
                    sortable: true,
                    minWidth: '250px'
                },
                {
                    name: 'Script',
                    selector: 'script',
                    sortable: true,
                    minWidth: '225px'
                },
                {
                    name: 'Type',
                    selector: 'type',
                    sortable: true,
                    minWidth: '225px'
                }
            ]}
        />
    </Fragment>
)

export default Tables
