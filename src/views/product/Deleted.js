import { Fragment } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatableForDeleted } from '@data/use-product'
import actions from './deleted_actions'
import Avatar from '@components/avatar'
import ProductLink from "@components/product/link"
import ability from "../../configs/acl/ability"


const canAddProduct = ability.can('read', 'product_add')
const Tables = () => (
    <Fragment>
        <Breadcrumbs breadCrumbTitle='Products' breadCrumbActive='Products' />
        <Datatable
            add={canAddProduct ? '/product/add' : null}
            useDatatable={useDatatableForDeleted}
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
