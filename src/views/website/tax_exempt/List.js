import { Fragment } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useTaxExemptDatatable } from '@data/use-tax-exempt'
import actions from './actions'
import { Badge } from 'reactstrap'
import ability from "../../../configs/acl/ability"

const canAddTaxExempt = ability.can('read', 'tax_exempt_add')
const Tables = () => (
    <Fragment>
        <Breadcrumbs breadCrumbTitle='TaxExempt' breadCrumbActive='TaxExempt' />
        <Datatable
            add={canAddTaxExempt ? '/tax_exempt/add' : null}
            useDatatable={useTaxExemptDatatable}
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
                    name: 'Email',
                    selector: 'email',
                    sortable: true
                },
                {
                    name: 'Tax Exempt',
                    selector: 'tax_exempt',
                    sortable: true,
                    cell: row => (
                        <Badge className='text-capitalize' color={row.tax_exempt ? 'light-success' : 'light-warning'} pill>
                            {row.tax_exempt ? `Yes` : `No`}
                        </Badge>
                    )
                },
                {
                    name: 'Tax Zero',
                    selector: 'tax_zero',
                    cell: row => (
                        <Badge className='text-capitalize' color={row.tax_zero ? 'light-success' : 'light-warning'} pill>
                            {row.tax_zero ? 'Yes' : 'No'}
                        </Badge>
                    )
                }
            ]}
        />
    </Fragment>
)

export default Tables
