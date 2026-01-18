import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatableForDeleted } from '@data/use-transaction'
import moment from 'moment'
import actions from './actions'
import Select from "react-select"
import { selectThemeColors } from '@utils'
import ability from "../../../configs/acl/ability"


const Tables = () => {


    const [conditions, setConditions] = useState([
        {
            col: 'deleted_at', op: '!=', val: null
        }
    ])

    const onFilterChange = (val, col) => {
        setConditions(val ? [{ val, col }] : [])
        
    }


    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Financial' breadCrumbActive='Deleted'/>
            <Datatable
                // add={canAddOutlay ? '/payment_method/add' : null}
                useDatatable={useDatatableForDeleted}
                // actions={actions}
                initialOrder={{column: 'id', dir: 'desc'}}
                defaultSortField={'id'}
                defaultSortAsc={false}
                conditions={conditions}
                columns={[
                    {
                        name: 'ID',
                        selector: 'id',
                        sortable: true
                    },
                    {
                        name: 'Order Id / Return Order Id',
                        selector: 'order_id',
                        sortable: true,
                        cell: row => (
                            <div>
                                {row.order_id ? (
                                    <a className='text-dark' href={`/order/edit/${row.order_id}`} target='_blank'>{ row.order_id }</a>
                                ) : (row.return_order_id ? (
                                    <a className='text-dark' href={`/return-order/edit/${row.return_order_id}`} target='_blank'>R_{ row.return_order_id }</a>
                                ) : (
                                    <span className='text-muted'>-</span>
                                ))}
                            </div>
                        )
                    },
                    {
                        name: 'Type',
                        selector: 'type',
                        sortable: true,
                        cell: row => (
                            <span className={`badge badge-${row.type === 'deposit' ? 'success' : 'danger'}`}>
                                {row.type}
                            </span>
                        )
                    },
                    {
                        name: 'Amount',
                        selector: 'amount',
                        sortable: true
                    },
                    {
                        name: 'Commission',
                        selector: 'commission',
                        sortable: true
                    },
                    {
                        name: 'Shipping',
                        selector: 'shipping',
                        sortable: true
                    },
                    {
                        name: 'Total Amount',
                        selector: 'total_amount',
                        sortable: true
                    },
                    {
                        name: 'Payment Method',
                        selector: 'payment_method_id',
                        sortable: true,
                        cell: row => row.paymentMethod || '-'
                    },
                    {
                        name: 'Created By',
                        selector: 'created_user',
                        sortable: true,
                        cell: row => row.created_user || '-'
                    },
                    {
                        name: 'Deleted By',
                        selector: 'deleted_user',
                        sortable: true,
                        cell: row => row.deleted_user || '-'
                    },
                    {
                        name: 'Date',
                        selector: 'created_at',
                        sortable: true,
                        cell: row => moment(row.created_at).format('YYYY-MM-DD HH:mm')
                    }
                ]}
            />
        </Fragment>
    )
}

export default Tables
