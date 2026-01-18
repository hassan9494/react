import { Fragment } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useLocationDatatable } from '@data/use-location'
import actions from './actions'
import {Badge} from "reactstrap"
import ability from "../../configs/acl/ability"

const canAddLocation = ability.can('read', 'location_add')
const Tables = () => (
    <Fragment>
        <Breadcrumbs breadCrumbTitle='Locations' breadCrumbActive='Locations' />
        <Datatable
            add={canAddLocation ? '/location/add' : null}
            useDatatable={useLocationDatatable}
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
                }
            ]}
        />
    </Fragment>
)

export default Tables
