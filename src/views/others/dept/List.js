import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-dept'
import actions from './actions'
import { Badge } from 'reactstrap'
import moment from 'moment'
import Select from 'react-select'
import { selectThemeColors } from '@utils'

const status = [
    'light-warning',
    'light-success'
]

const types = [
    { value: false, label: 'Not Paid' },
    { value: true, label: 'Paid' }
]

const Tables = () => {

    const [paid, setPaid] = useState()
    const [conditions, setConditions] = useState([])

    const onFilterChange = (val, col) => {
        setConditions(typeof val === "boolean" ? [{ val, col }] : [])
        setPaid(val)
    }

    const Filters = () => (
        <Select
            isClearable={true}
            placeholder={'Status'}
            theme={selectThemeColors}
            classNamePrefix='select'
            className='react-select w-25'
            options={types}
            value={types.filter(list => list?.value === (paid))}
            onChange={(e) => onFilterChange(e?.value, 'paid')}
        />
    )

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Others' breadCrumbActive='Depts' />
            <Datatable
                add='/dept/add'
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
                        name: 'Amount',
                        selector: 'amount',
                        sortable: true
                    },
                    {
                        name: 'Date',
                        selector: 'date',
                        sortable: true,
                        cell: row => moment(row.date).format('Y-MM-DD')
                    },
                    {
                        name: 'Status',
                        selector: 'paid',
                        sortable: true,
                        cell: row => (
                            <Badge className='text-capitalize' color={status[row?.paid]} pill>
                                { row?.paid ? 'PAID' : 'UN-PAID' }
                            </Badge>
                        )
                    }
                ]}
            />
        </Fragment>
    )
}

export default Tables
