import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-project'
import actions from './actions'
import { Badge } from 'reactstrap'
import Select from 'react-select'
import ability from "../../../configs/acl/ability"


const types = [
    { value: true, label: 'Complete' },
    { value: false, label: 'Not Complete' }
]
const canAddProject = ability.can('read', 'project_add')

const Tables = () => {

    const [completed, setCompleted] = useState()
    const [conditions, setConditions] = useState([])

    const onFilterChange = (val, col) => {
        setConditions(typeof val === "boolean" ? [{val, col}] : [])
        setCompleted(val)
    }

    const Filters = () => (
        <Select
            isClearable={true}
            placeholder={'Status'}
            classNamePrefix='select'
            className='react-select w-25'
            options={types}
            value={types.filter(list => list?.value === (completed))}
            onChange={(e) => onFilterChange(e?.value, 'completed')}
        />
    )

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Others' breadCrumbActive='Projects' />
            <Datatable
                add={canAddProject ? '/project/add' : null}
                useDatatable={useDatatable}
                actions={actions}
                initialOrder={{column: 'id', dir: 'desc'}}
                defaultSortField={'id'}
                defaultSortAsc={false}
                filterBar={<Filters />}
                conditions={conditions}
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
                        sortable: true
                    },
                    {
                        name: 'Cost',
                        selector: 'cost',
                        sortable: true,
                        cell: row => row?.cost.toFixed(2)
                    },
                    {
                        name: 'Total Paid',
                        selector: 'total_paid',
                        sortable: false,
                        cell: row => row?.total_paid.toFixed(2)
                    },
                    {
                        name: 'Status',
                        selector: 'completed',
                        sortable: true,
                        cell: row => (
                            row?.completed ? <Badge className='text-capitalize' color={'light-success'} pill>Completed</Badge> : <Badge className='text-capitalize' color={'light-warning'} pill>UnComplete</Badge>
                        )
                    }
                ]}
            />
        </Fragment>

    )
}

export default Tables
