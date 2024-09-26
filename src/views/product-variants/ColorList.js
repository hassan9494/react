import { Fragment } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-variants-product'
import actions from './color_actions'
import Avatar from '@components/avatar'
import ProductLink from "@components/product/link"
import ability from "../../configs/acl/ability"
import {useParams} from "react-router-dom"


const Tables = () => {
    const { id } = useParams()
    const canAddProduct = ability.can('read', 'product_variants_add')
    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Colors' breadCrumbActive='Colors'/>
            <Datatable
                useDatatable={(params) => useDatatable({ ...params, id })}
                actions={actions}
                id={id}
                add={canAddProduct ? `/product_variants/add/${id}` : null}
                conditions={[
                    {
                        col: 'product_id', op: '=', val: id
                    }
                ]}
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
                            <div><Avatar img={row.image} className={"mr-2"}/>
                                <ProductLink data={row}/>
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
}


export default Tables
