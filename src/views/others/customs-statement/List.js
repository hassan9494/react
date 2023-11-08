import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-customs-statement'
import moment from 'moment'
import actions from './actions'
import Select from "react-select"
import { selectThemeColors } from '@utils'


const Tables = () => {


    const [conditions, setConditions] = useState([])

    const onFilterChange = (val, col) => {
        setConditions(val ? [{ val, col }] : [])
    }


    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Customs Statement' breadCrumbActive='customs-statements'/>
            <Datatable
                add='/customs-statement/add'
                useDatatable={useDatatable}
                actions={actions}
                initialOrder={{column: 'id', dir: 'desc'}}
                defaultSortField={'id'}
                defaultSortAsc={false}
                conditions={conditions}
                columns={[
                    {
                        name: 'ID',
                        selector: 'id',
                        sortable: true,
                        minWidth: '100px'
                    },
                    {
                        name: 'Customs Statement',
                        selector: 'name',
                        sortable: true
                    },
                    {
                        name: 'Invoice',
                        selector: 'invoice',
                        sortable: true
                    },
                    {
                        name: '2% income',
                        selector: 'invoice_2_percent',
                        sortable: true
                    },
                    {
                        name: 'Date',
                        selector: 'date',
                        sortable: true,
                        cell: row => moment(row.date).format('Y-MM-DD')
                    },
                    {
                        name: 'Amount',
                        selector: 'amount',
                        sortable: true
                    }
                ]}
            />
        </Fragment>
    )
}

export default Tables
