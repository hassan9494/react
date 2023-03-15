import { Fragment } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-product'
import actions from './actions'
import Avatar from '@components/avatar'
import ProductLink from "@components/product/link"

const Tables = () => (
    <Fragment>
        <Breadcrumbs breadCrumbTitle='Products' breadCrumbActive='Products' />
        <Datatable
            add='/product/add'
            useDatatable={useDatatable}
            actions={actions}
            columns={[
                {
                    name: 'ID',
                    selector: 'id',
                    sortable: true,
                    width: '100px'
                },
                {
                    name: 'Name',
                    selector: 'name',
                    sortable: true,
                    minWidth: '500px',
                    cell: row => (
                        <div><Avatar img={row.image} className={"mr-2"} />
                            <ProductLink data={row} />
                        </div>
                    )
                },
                {
                    name: 'Stock',
                    selector: 'stock',
                    sortable: true,
                    width: '100px'
                },
                {
                    name: 'Price',
                    selector: 'price.normal_price',
                    sortField: 'price->normal_price',
                    sortable: true,
                    width: '100px'
                },
                {
                    name: 'Sale Price',
                    selector: 'price.sale_price',
                    sortField: 'price->sale_price',
                    sortable: true
                }
            ]}
        />
    </Fragment>
)

export default Tables
