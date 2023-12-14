import { Fragment, useEffect, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-order'
import actions from '../actions'
import { Badge, Button } from 'reactstrap'
import { selectThemeColors } from '@utils'
import Select from 'react-select'
import { useModels as useShippingProviders } from '@data/use-shipping-provider'
import ability from "../../../configs/acl/ability"

const shippingStatusClasses = {
    WAITING: 'light-warning',
    SHIPPED: 'light-info',
    DELIVERED: 'light-success'
}

export default () => {

    const [provider, setProvider] = useState(false)

    const { data: providers } = useShippingProviders()
    const providersList = providers.map(e => ({ label: e.name, value: e.id }))

    const [conditions, setConditions] = useState([
        {
            col: 'status', op: '=', val: 'PROCESSING'
        },
        {
            col: 'shipping->status', op: '!=', val: null
        },
        {
            col: 'shipping->status', op: '!=', val: 'WAITING'
        },
        (!ability.can('read', 'untaxed_list_view') && !ability.can('read', 'befor_completed_untaxed_list_view'))  ? {
                col: 'options->taxed',  val: true
            } : {
                
            }
    ])

    const onFilterChange = (val, col) => {
        const updated = conditions.filter(e => e.col !== col)
        updated.push({ val, col })
        setConditions(updated)
        setType(val)
    }

    useEffect(() => {
        const updated = conditions.filter(e => e.col !== 'shipping_provider_id')
        if (provider) updated.push({ val: provider, col: 'shipping_provider_id' })
        setConditions(updated)
    }, [provider])

    const Filters = () => (
        <>
            <Select
                theme={selectThemeColors}
                classNamePrefix='select'
                className='react-select w-25'
                options={providersList}
                placeholder={'Select Shipping Provider...'}
                onChange={val => {
                    setProvider(val?.value || null)
                }}
                isClearable={true}
                value={providersList.filter(option => option.value === provider)}
            />
        </>
    )

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
                columns={[
                    {
                        name: 'Number',
                        selector: 'number',
                        sortable: true,
                        defaultSortAsc: false,
                        sortField: 'id',
                        minWidth: '100px'
                    },
                    {
                        name: 'customer',
                        selector: 'customer.name',
                        sortable: true,
                        sortField: 'customer->name',
                        minWidth: '100px'
                    },
                    {
                        name: 'phone',
                        selector: 'customer.phone',
                        sortable: true,
                        sortField: 'customer->phone',
                        minWidth: '100px'
                    },
                    {
                        name: 'Info',
                        sortable: false,
                        minWidth: '100px',
                        cell: row => (
                            <>
                                {
                                    row.options?.dept &&
                                    <Badge className='text-capitalize' color={'light-secondary'} pill>Zemam</Badge>
                                }
                                {
                                    row.options?.taxed &&
                                    <Badge className='text-capitalize' color={'light-secondary'} pill>Taxed</Badge>
                                }
                                {
                                    !row.options?.taxed &&
                                    <Badge className='text-capitalize' color={'light-secondary'} pill>Normal</Badge>
                                }
                                {
                                    row.options?.tax_exempt &&
                                    <Badge className='text-capitalize' color={'light-secondary'} pill>M3fe</Badge>
                                }
                                {
                                    row.options?.price_offer &&
                                    <Badge className='text-capitalize' color={'light-secondary'} pill>Offer</Badge>
                                }
                            </>
                        )
                    },
                    {
                        name: 'shipping',
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