import {Fragment, useState} from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import {useDatatable} from '@data/use-return-order'
import Filters from './filters'
import moment from 'moment'

const Tables = () => {

    const fixedConditions = [
        {
            col: 'status', val: 'COMPLETED'
        }
    ]

    const [conditions, setConditions] = useState([...fixedConditions])

    const onFiltersChange = (filters) => {
        const updated = [...fixedConditions]
        if (filters.from) updated.push({col: 'created_at', op: '>=', val: filters.from})
        if (filters.to) updated.push({
            col: 'created_at',
            op: '<=',
            val: moment(filters.to).add(1, 'days').format('Y-MM-DD')
        })

        if (filters.status) updated.push({col: 'is_migrated', val: filters.status})
        setConditions(updated)
    }


    return (
        <Fragment>

            <Breadcrumbs breadCrumbTitle='Reports' breadCrumbActive='Orders' />

            <Filters onChange={onFiltersChange} />

            <Datatable
                useDatatable={useDatatable}
                conditions={conditions}
                header={false}
                columns={[
                    {
                        name: 'Number',
                        selector: 'number',
                        sortable: true,
                        sortField: 'id'
                    },
                    {
                        name: 'notes',
                        selector: 'notes',
                        sortable: true,
                        width: '200px'
                    },
                    {
                        name: 'Created Date',
                        selector: 'created_at',
                        sortable: true,
                        sortField: 'created_at',
                        minWidth: '100px',
                        cell: row => moment(row.created_at).format('YYYY-MM-DD')
                    },
                    {
                        name: 'Total',
                        selector: 'total',
                        sortable: true,
                        minWidth: '100px',
                        cell: row => Number.parseFloat(row?.total).toFixed(2)
                    }
                ]}
            />
        </Fragment>
    )
}

export default Tables
