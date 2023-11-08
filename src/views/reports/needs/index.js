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
        if (filters.type) updated.push(filters.type)
        setConditions(updated)
    }
    const { REACT_APP_WEBSITE } = process.env
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
                        minWidth: '350px',
                        searchable: true,
                        cell: row => <div><Avatar img={row.image} className='mr-2'/>{row.name}</div>
                    },
                    {
                        name: 'Qty',
                        selector: 'stock',
                        sortable: true,
                        minWidth: '20px'
                    },
                    {
                        name: 'Min Quantity',
                        selector: 'min_qty',
                        sortable: true,
                        minWidth: '20px'
                    },
                    {
                        name: 'Price',
                        selector: 'price',
                        sortField: 'price',
                        sortable: true,
                        minWidth: '20px'
                    },
                    {
                        name: 'Price All',
                        selector: 'priceAll',
                        sortable: false,
                        minWidth: '20px'
                    },
                    {
                        name: 'Real Price',
                        selector: 'real_price',
                        sortField: 'real_price',
                        sortable: true,
                        minWidth: '20px'
                    },
                    {
                        name: 'Real Price All',
                        selector: 'allRealPrice',
                        sortable: false,
                        minWidth: '20px'
                    },
                    {
                        name: 'Source SKU',
                        selector: 'source_sku',
                        sortable: true,
                        minWidth: '350px'
                    },
                    {
                        name: 'Link',
                        selector:  row => <a href={`${REACT_APP_WEBSITE}product/${row.sku}`} > {`${REACT_APP_WEBSITE}product/${row.sku}`} </a>,
                        sortable: true,
                        minWidth: '400px'
                    }
                ]}
            />
        </Fragment>
    )
}

export default Tables
