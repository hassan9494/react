import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useProducts } from '@data/use-report'
import Filters from './filters'
import Avatar from '@components/avatar'

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
            name: 'Sales',
            selector: 'sales',
            sortable: false
        }
    ]

    return (
        <Fragment>

            <Breadcrumbs breadCrumbTitle='Reports' breadCrumbActive='Orders' />

            <Filters onChange={() => {}} />

            <Datatable
                useDatatable={useProducts}
                header={false}
                columns={columns}
            />
        </Fragment>
    )
}

export default Tables
