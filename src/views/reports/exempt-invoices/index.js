import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-order'
import Filters from './filters'
import moment from 'moment'

const Tables = () => {

    const fixedConditions = [
        {
            col: 'options->taxed', val: true
        },
        {
            col: 'options->tax_exempt', val: true
        }
    ]

    const [conditions, setConditions] = useState([...fixedConditions])

    const onFiltersChange = (filters) => {
        const updated = [...fixedConditions]
        if (filters.from) updated.push({col: 'taxed_at|updated_at',  op: '>=', val: filters.from})
        if (filters.to) updated.push({col: 'taxed_at|updated_at',  op: '<=', val: moment(filters.to).add(1, 'days').format('Y-MM-DD')})
        if (filters.zero) updated.push({col: 'options->tax_zero', val: filters.zero})
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
                        sortField: 'id',
                        minWidth: '100px'
                    },
                    {
                        name: 'date',
                        selector: 'taxed_at',
                        sortable: true,
                        minWidth: '100px',
                        cell: row => (row.taxed_at ? moment(row.taxed_at).format('Y-MM-DD') : moment(row.updated_at).format('Y-MM-DD'))
                    },
                    {
                        name: 'customer',
                        selector: 'customer.name',
                        sortable: true,
                        sortField: 'customer->name',
                        minWidth: '100px'
                    },
                    {
                        name: 'customer',
                        selector: 'customer.phone',
                        sortField: 'customer->phone',
                        sortable: true,
                        minWidth: '100px'
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
