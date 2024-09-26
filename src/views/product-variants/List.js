import { Fragment } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useVariantsDatatable } from '@data/use-product'
import actions from './actions'
import Avatar from '@components/avatar'
import ProductLink from "@components/product/link"
import ability from "../../configs/acl/ability"


const Tables = () => (
    <Fragment>
        <Breadcrumbs breadCrumbTitle='Products' breadCrumbActive='Products' />
        <Datatable
            useDatatable={useVariantsDatatable}
            actions={actions}
            conditions={[
                {
                    col: 'hasVariants', op: '=', val: true
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
                        <div><Avatar img={row.image} className={"mr-2"} />
                            <ProductLink data={row} />
                        </div>
                    )
                },
                {
                    name: 'Colors Count',
                    selector: 'variants_count',
                    sortable: true
                }
            ]}
        />
    </Fragment>
)

export default Tables
