import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-order'
import actions from '../actions'
import { Badge, Button } from 'reactstrap'
import { selectThemeColors } from '@utils'
import Select from 'react-select'
import ability from "../../../configs/acl/ability"

import { useModels as useCities } from '@data/use-city'
import moment from "moment"

const types = [
    { value: false, label: 'Paid' },
    { value: true, label: 'Zemam' }
]

const shippingStatusClasses = {
    WAITING: 'light-warning',
    SHIPPED: 'light-info',
    DELIVERED: 'light-success'
}

export default () => {

    const { data: cities } = useCities()

    const [type, setType] = useState(false)

    const [conditions, setConditions] = useState([
        {
            col: 'status', op: '=', val: 'PROCESSING'
        },
        {
            col: 'options->dept', op: '=', val: false
        },
        {
            col: 'shipping->status', op: '!=', val: 'SHIPPED'
        },
        {
            col: 'shipping->status', op: '!=', val: 'DELIVERED'
        },
        (!ability.can('read', 'untaxed_list_view') && !ability.can('read', 'befor_completed_untaxed_list_view'))  ? {
            col: 'options->taxed',  val: true
        } : {

        }
    ])

    const onFilterChange = (val, col) => {
        if (val === false) {
            setConditions([
                {
                    col: 'status', op: '=', val: 'PROCESSING'
                },
                {
                    col: 'options->dept', op: '=', val: false
                },
                {
                    col: 'shipping->status', op: '!=', val: 'SHIPPED'
                },
                {
                    col: 'shipping->status', op: '!=', val: 'DELIVERED'
                },
                (!ability.can('read', 'untaxed_list_view') && !ability.can('read', 'befor_completed_untaxed_list_view'))  ? {
                    col: 'options->taxed',  val: true
                } : {

                }
            ])
        } else {
            setConditions([
                {
                    col: 'status', op: '=', val: 'PROCESSING'
                },
                {
                    col: 'options->dept', op: '=', val: true
                },
                (!ability.can('read', 'untaxed_list_view') && !ability.can('read', 'befor_completed_untaxed_list_view'))  ? {
                    col: 'options->taxed',  val: true
                } : {

                }
            ])
        }
        // const updated = conditions.filter(e => e.col !== col)
        // if (val !== null && val !== undefined) {
        //     updated.push({ val, col })
        //     setConditions(updated)
        // }
        setType(val)
    } 

    const Filters = () => (
        <Select
            theme={selectThemeColors}
            classNamePrefix='select'
            className='react-select w-25'
            options={types}
            value={types.filter(list => list.value === (type))}
            onChange={(e) => onFilterChange(e?.value, 'options->dept')}
        />
    )
    const canAddOrder = ability.can('read', 'order_add')
    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Orders' breadCrumbActive='Orders' />
            <Datatable
                useDatatable={useDatatable}
                initialOrder={{column: 'id', dir: 'desc'}}
                defaultSortField={'number'}
                defaultSortAsc={false}
                filterBar={<Filters />}
                conditions={conditions}
                actions={actions}
                add={canAddOrder ? '/order/create' : null}
                columns={[
                    {
                        name: 'Number',
                        selector: 'number',
                        sortable: true,
                        sortField: 'id'
                    },
                    {
                        name: 'customer',
                        selector: 'customer.name',
                        sortable: true,
                        sortField: 'customer->name'
                    },
                    {
                        name: 'phone',
                        selector: 'customer.phone',
                        sortField: 'customer->phone',
                        sortable: true
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
                        name: 'shipping',
                        selector: 'shipping.city',
                        sortable: true,
                        sortField: 'shipping->city',
                        minWidth: '100px',
                        cell: row => cities.find(city => city.id === row.city_id)?.name ?? row.shipping.city
                    },
                    {
                        name: 'shipping Status',
                        selector: 'shipping.status',
                        sortable: true,
                        sortField: 'shipping->status',
                        minWidth: '100px',
                        cell: row => (
                            <Badge className='text-capitalize' color={shippingStatusClasses[row?.shipping?.status] || ''} pill>
                                {row?.shipping?.status}
                            </Badge>
                        )
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