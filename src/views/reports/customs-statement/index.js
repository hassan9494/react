import { Fragment, useState, React, useMemo } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-customs-statement'
import Filters from './filters'
import moment from 'moment'
import Avatar from '@components/avatar'

const Tables = () => {


    const [conditions, setConditions] = useState(null)

    const onFiltersChange = (filters) => {
        const updated = []
        if (filters.from) updated.push({col: 'date',  op: '>=', val: filters.from})
        if (filters.to) updated.push({col: 'date',  op: '<=', val: moment(filters.to).add(1, 'days').format('Y-MM-DD')})
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
                        name: 'ID',
                        selector: 'id',
                        sortable: true,
                        minWidth: '100px'
                    },
                    {
                        name: 'Customs Statement',
                        selector: 'name',
                        sortable: true
                    },
                    {
                        name: 'Invoice',
                        selector: 'invoice',
                        sortable: true
                    },
                    {
                        name: '2% income',
                        selector: 'invoice_2_percent',
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
