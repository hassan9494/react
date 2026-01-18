import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-return-order'
import actions from '../return-actions'
import { Badge, Button } from 'reactstrap'
import { selectThemeColors } from '@utils'
import Select from 'react-select'
import ability from "../../../configs/acl/ability"

import { useModels as useCities } from '@data/use-city'
import moment from "moment"


export default () => {

    const { data: cities } = useCities()


    const [conditions, setConditions] = useState([])


    const canAddOrder = ability.can('read', 'order_add')
    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Return Orders' breadCrumbActive='Return Orders' />
            <Datatable
                useDatatable={useDatatable}
                initialOrder={{column: 'id', dir: 'desc'}}
                defaultSortField={'number'}
                defaultSortAsc={false}
                conditions={conditions}
                actions={actions}
                add={canAddOrder ? '/return-order/create' : null}
                columns={[
                    {
                        name: 'Number',
                        selector: 'number',
                        sortable: true,
                        sortField: 'id'
                    },
                    {
                        name: 'Old Order Number',
                        selector: 'oldOrder.tax_number',
                        sortable: true,
                        sortField: 'order_id'
                    },
                    {
                        name: 'notes',
                        selector: 'notes',
                        sortable: true,
                        width: '200px'
                    },
                    {
                        name: 'Created Date',
                        selector: 'created_at',
                        sortable: true,
                        sortField: 'created_at',
                        minWidth: '100px',
                        cell: row => moment(row.created_at).format('YYYY-MM-DD')
                    },
                    {
                        name: 'Fatora Status',
                        selector: 'fatora_status',
                        sortable: true,
                        sortField: 'fatora_status'
                    },
                    {
                        name: 'Status',
                        selector: 'status',
                        sortable: true,
                        sortField: 'status'
                    },
                    {
                        name: 'Total',
                        selector: 'total',
                        sortable: true,
                        minWidth: '100px',
                        cell: row => Number.parseFloat(row?.total).toFixed(2)
                    }
                ]}
            />
        </Fragment>
    )
}