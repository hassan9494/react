import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-payment-method'
import moment from 'moment'
import actions from './actions'
import Select from "react-select"
import { selectThemeColors } from '@utils'
import ability from "../../../configs/acl/ability"


const canAddOutlay = ability.can('read', 'payment_method_add')
const Tables = () => {


    const [conditions, setConditions] = useState([])

    const onFilterChange = (val, col) => {
        setConditions(val ? [{ val, col }] : [])
        
    }


    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Financial' breadCrumbActive='Payment Method'/>
            <Datatable
                add={canAddOutlay ? '/payment_method/add' : null}
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
                        name: 'Name',
                        selector: 'name',
                        sortable: true
                    },
                    {
                        name: 'Type',
                        selector: 'commission_type',
                        sortable: true
                    }
                ]}
            />
        </Fragment>
    )
}

export default Tables
