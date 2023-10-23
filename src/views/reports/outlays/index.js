import { Fragment, useState, React, useMemo } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-outlay'
import Filters from './filters'
import moment from 'moment'
import Avatar from '@components/avatar'

const Tables = () => {


    const fixedConditions = [
        {
        col: 'type', val: 'OUTLAY'
        }
    ]

    const [conditions, setConditions] = useState([...fixedConditions])

    const onFiltersChange = (filters) => {
        const updated = [...fixedConditions]
        if (filters.from) updated.push({col: 'date',  op: '>=', val: filters.from})
        if (filters.to) updated.push({col: 'date',  op: '<=', val: moment(filters.to).add(1, 'days').format('Y-MM-DD')})
        if (filters.sub_type) updated.push({col: 'sub_type', val: filters.sub_type})
        setConditions(updated)
    }

    return (
        <Fragment>

            <Breadcrumbs breadCrumbTitle='Reports' breadCrumbActive='Outlays' />

            <Filters onChange={onFiltersChange} />

            <Datatable
                useDatatable={useDatatable}
                conditions={conditions}
                // header={false}
                columns={[
                    {
                        name: 'Outlay',
                        selector: 'name',
                        sortable: true,
                        searchable: true
                    },
                    {
                        name: 'Type',
                        selector: 'sub_type',
                        sortable: true,
                        searchable: true
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
                    },
                    {
                        name: 'Total Amount',
                        selector: 'total_amount',
                        sortable: true
                    },
                    {
                        name: 'Invoice',
                        selector: 'invoice',
                        sortable: true
                    },
                    {
                        name: 'Tax',
                        selector: 'tax',
                        sortable: true
                    },
                    {
                        name: 'Notes',
                        selector: 'notes',
                        sortable: true
                    }
                ]}
            />
        </Fragment>
    )
}

export default Tables
