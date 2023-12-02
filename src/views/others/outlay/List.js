import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-outlay'
import moment from 'moment'
import actions from './actions'
import Select from "react-select"
import { selectThemeColors } from '@utils'
import ability from "../../../configs/acl/ability"

const types = [
    { value: 'PURCHASE', label: 'Purchase' },
    { value: 'OUTLAY', label: 'Outlay' }
]

const canAddOutlay = ability.can('read', 'outlay_add')
const Tables = () => {


    const [type, setType] = useState()
    const [conditions, setConditions] = useState([])

    const onFilterChange = (val, col) => {
        setConditions(val ? [{ val, col }] : [])
        setType(val)
    }

    const Filters = () => (
        <Select
            isClearable={true}
            placeholder={'Type'}
            // theme={selectThemeColors}
            classNamePrefix='select'
            className='react-select w-25'
            options={types}
            value={types.filter(list => list?.value === (type))}
            onChange={(e) => onFilterChange(e?.value, 'type')}
        />
    )


    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Others' breadCrumbActive='Outlays'/>
            <Datatable
                add={canAddOutlay ? '/outlay/add' : null}
                useDatatable={useDatatable}
                actions={actions}
                initialOrder={{column: 'id', dir: 'desc'}}
                defaultSortField={'id'}
                defaultSortAsc={false}
                conditions={conditions}
                filterBar={<Filters />}
                columns={[
                    {
                        name: 'ID',
                        selector: 'id',
                        sortable: true,
                        minWidth: '100px'
                    },
                    {
                        name: 'Outlay',
                        selector: 'name',
                        sortable: true
                    },
                    {
                        name: 'Type',
                        selector: 'type',
                        sortable: true
                    },
                    {
                        name: 'Date',
                        selector: 'date',
                        sortable: true,
                        cell: row => moment(row.date).format('Y-MM-DD')
                    },
                    {
                        name: 'Amount',
                        selector: 'amount',
                        sortable: true
                    }
                ]}
            />
        </Fragment>
    )
}

export default Tables
