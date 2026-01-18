import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useProducts } from '@data/use-report'
import Filters from './filters'
import Avatar from '@components/avatar'
import moment from "moment"

const Tables = () => {

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
            name: 'All Sales',
            selector: 'sales',
            sortable: false
        },
        {
            name: 'Taxed Sales',
            selector: 'taxed_sales',
            sortable: false
        },
        {
            name: 'Untaxed Sales',
            selector: 'untaxed_sales',
            sortable: false
        }
    ]
    const [dateRange, setDateRange] = useState({ from: null, to: null })

    const onFiltersChange = (filters) => {
        setDateRange({
            from: filters.from,
            to: filters.to ? moment(filters.to).add(1, 'days').format('YYYY-MM-DD') : null
        })
    }
    return (
        <Fragment>

            <Breadcrumbs breadCrumbTitle='Reports' breadCrumbActive='Orders' />


            <Filters onChange={onFiltersChange} />

            <Datatable
                dateRange={dateRange}
                useDatatable={useProducts}
                header={false}
                columns={columns}
            />
        </Fragment>
    )
}

export default Tables
