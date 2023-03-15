import { Fragment } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-coupon'
import actions from './actions'
import { Badge } from 'reactstrap'

const Tables = () => (
    <Fragment>
        <Breadcrumbs breadCrumbTitle='Coupons' breadCrumbActive='Coupons' />
        <Datatable
            add='/coupon/add'
            useDatatable={useDatatable}
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
                    selector: 'name',
                    sortable: true,
                    minWidth: '225px'
                },
                {
                    name: 'Code',
                    selector: 'code',
                    sortable: true
                },
                {
                    name: 'amount',
                    selector: 'amount',
                    sortable: true,
                    cell: row => (
                        <Badge className='text-capitalize' color='light-warning' pill>
                            {row.is_percentage ? `${row.amount} %` : `${row.amount} $`}
                        </Badge>
                    )
                },
                {
                    name: 'valid',
                    selector: 'valid',
                    cell: row => (
                        <Badge className='text-capitalize' color={row.valid ? 'light-success' : 'light-warning'} pill>
                            {row.valid ? 'Valid' : 'Invalid'}
                        </Badge>
                    )
                }
            ]}
        />
    </Fragment>
)

export default Tables
