import { Fragment } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useSubCategoryDatatable } from '@data/use-category'
import actions from './actions'
import Avatar from "../../@core/components/avatar"

const Tables = () => (
    <Fragment>
        <Breadcrumbs breadCrumbTitle='Sub Categories' breadCrumbActive='Sub Categories' />
        <Datatable
            useDatatable={useSubCategoryDatatable}
            actions={actions}
            columns={[
                {
                    name: 'ID',
                    selector: 'id',
                    sortable: true,
                    minWidth: '100px'
                },
                {
                    name: 'Name',
                    selector: 'title',
                    sortable: true,
                    minWidth: '300px',
                    cell: row => (
                        <div>
                            <Avatar img={row.image} className={"mr-2"} />
                            <a className='text-dark' href={``} target='_blank'>{ row.title }</a>
                        </div>
                    )
                },
                {
                    name: 'Slug',
                    selector: 'slug',
                    sortable: true,
                    minWidth: '250px'
                },
                {
                    name: 'Order',
                    selector: 'order',
                    sortable: true,
                    minWidth: '100px'
                },
                {
                    name: 'Parent',
                    selector: 'parent.title',
                    sortable: true,
                    minWidth: '250px'
                }
            ]}
        />
    </Fragment>
)

export default Tables
