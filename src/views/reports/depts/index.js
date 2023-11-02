import { Fragment, useState, React, useMemo } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-dept'
import Filters from './filters'
import moment from 'moment'
import {Badge} from "reactstrap"

const Tables = () => {


    const fixedConditions = [
        {
        col: 'paid', op: '>=', val: 0
        }
    ]

    const [conditions, setConditions] = useState([...fixedConditions])

    const status = [
        'light-warning',
        'light-success'
    ]

    const onFiltersChange = (filters) => {
        const updated = [...fixedConditions]
        if (filters.from) updated.push({col: 'date',  op: '>=', val: filters.from})
        if (filters.to) updated.push({col: 'date',  op: '<=', val: moment(filters.to).add(1, 'days').format('Y-MM-DD')})
        if (filters.paid) updated.push({col: 'paid', val: filters.paid})
        setConditions(updated)
    }

    return (
        <Fragment>

            <Breadcrumbs breadCrumbTitle='Reports' breadCrumbActive='Outlays' />

            <Filters onChange={onFiltersChange} />

            <Datatable
                useDatatable={useDatatable}
                conditions={conditions}
                header={false}
                columns={[
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
