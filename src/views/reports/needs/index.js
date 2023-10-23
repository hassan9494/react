import { Fragment, useState, React, useMemo } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useNeed } from '@data/use-report'
import Filters from './filters'
import moment from 'moment'
import Avatar from '@components/avatar'

const Tables = () => {


    const fixedConditions = ['need']

    const [conditions, setConditions] = useState([...fixedConditions])

    const onFiltersChange = (filters) => {
        const updated = [...fixedConditions]
        if (filters.from) updated.push({col: 'taxed_at',  op: '>=', val: filters.from})
        if (filters.to) updated.push({col: 'taxed_at',  op: '<=', val: moment(filters.to).add(1, 'days').format('Y-MM-DD')})
        if (filters.status) updated.push({col: 'status', val: filters.status})
        if (filters.exempt) updated.push({col: 'options->tax_exempt', val: filters.exempt})
        setConditions(updated)
    }

    return (
        <Fragment>

            <Breadcrumbs breadCrumbTitle='Reports' breadCrumbActive='Orders' />

            <Filters onChange={onFiltersChange} />

            <Datatable
                useDatatable={useNeed}
                conditions={conditions}
                // header={false}
                columns={[
                    {
                        name: 'Name',
                        selector: 'name',
                        sortable: true,
                        minWidth: '500px',
                        searchable: true,
                        cell: row => <div><Avatar img={row.image} className='mr-2'/>{row.name}</div>
                    },
                    {
                        name: 'Qty',
                        selector: 'stock',
                        sortable: true,
                        minWidth: '100px'
                    },
                    {
                        name: 'Min Quantity',
                        selector: 'min_qty',
                        sortable: true,
                        minWidth: '100px'
                    }
                ]}
            />
        </Fragment>
    )
}

export default Tables
