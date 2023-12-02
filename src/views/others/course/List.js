import { Fragment } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-course'
import actions from './actions'
import ability from "../../../configs/acl/ability"

const canAddCourse = ability.can('read', 'course_add')
const Tables = () => (
    <Fragment>
        <Breadcrumbs breadCrumbTitle='Others' breadCrumbActive='Courses' />
        <Datatable
            add={canAddCourse ? '/course/add' : null}
            useDatatable={useDatatable}
            actions={actions}
            initialOrder={{column: 'id', dir: 'desc'}}
            defaultSortField={'id'}
            defaultSortAsc={false}
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
                    selector: 'cost',
                    sortable: true,
                    minWidth: '225px'
                },
                {
                    name: 'Students Count',
                    selector: 'students_count',
                    minWidth: '225px'
                }
            ]}
        />
    </Fragment>
)

export default Tables
