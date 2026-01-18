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
        if (filters.sourceType) updated.push(filters.sourceType)
        if (filters.source) {
            // Pass sourceType along with source_id for the backend to know which column to use
            updated.push({
                col: 'source_id',
                val: filters.source,
                sourceType: filters.sourceType // Pass the sourceType here
            })
        }
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
                        cell: row => <div className={'d-flex align-items-center'}><Avatar img={row.image} className={"mr-2"}/> {row.name} </div>
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
                        name: 'Purchases Qty',
                        selector: 'purchases_qty',
                        sortable: true,
                        minWidth: '20px'
                    },
                    {
                        name: 'Order Quantity',
                        selector: 'order_qty',
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
                        minWidth: '100'
                    },
                    {
                        name: 'Stock Location',
                        selector: 'stock_location',
                        sortable: true,
                        minWidth: '100'
                    },
                    {
                        name: 'Store Location',
                        selector: 'location',
                        sortable: true,
                        minWidth: '100'
                    }
                ]}
            />
        </Fragment>
    )
}

export default Tables
