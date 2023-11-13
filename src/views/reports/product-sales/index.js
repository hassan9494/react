import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useProduct } from '@data/use-report'
import Filters from './filters'
import Avatar from '@components/avatar'
import actions from './actions'
import moment from "moment/moment"

const Tables = () => {

    const fixedConditions = []

    const [conditions, setConditions] = useState([...fixedConditions])

    const columns = [
        {
            name: 'Name',
            selector: 'name',
            sortable: true,
            minWidth: '500px',
            cell: row => <div><Avatar img={row.image} className='mr-2'/>{row.name}</div>
        },
        {
            name: 'Qty',
            selector: 'quantity',
            sortable: true,
            minWidth: '100px'
        },
        {
            name: 'Price',
            selector: 'price.normal_price',
            sortField: 'price->normal_price',
            sortable: true,
            minWidth: '100px'
        },
        {
            name: 'Sales',
            selector: 'sales',
            sortable: false
        }
    ]
    const onFiltersChange = (filters) => {
        const updated = [...fixedConditions]
        if (filters.from) updated.push({col: 'date',  op: '>=', val: filters.from})
        if (filters.to) updated.push({col: 'date',  op: '<=', val: moment(filters.to).add(1, 'days').format('Y-MM-DD')})
        setConditions(updated)
    }

    return (
        <Fragment>

            <Breadcrumbs breadCrumbTitle='Reports' breadCrumbActive='Products Sales' />

            {/*<Filters onChange={() => {}} />*/}

            <Datatable
                useDatatable={useProduct}
                header={false}
                actions={actions}
                conditions={conditions}
                columns={columns}
            />
        </Fragment>
    )
}

export default Tables
