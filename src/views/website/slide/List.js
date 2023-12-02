import { Fragment } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-slide'
import actions from './actions'
import ability from "../../../configs/acl/ability"

const canAddSlide = ability.can('read', 'slide_add')
const Tables = () => (
    <Fragment>
        <Breadcrumbs breadCrumbTitle='Slides' breadCrumbActive='Slides' />
        <Datatable
            add={canAddSlide ? '/slide/add' : null}
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
                }
            ]}
        />
    </Fragment>
)

export default Tables
