import {Fragment, useState} from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable, api } from '@data/use-order'
import actions from '../actions'
import ability from "../../../configs/acl/ability"
import moment from 'moment'
import {Badge, Button} from "reactstrap"
import {toast} from "react-toastify"
import { confirm } from '@components/sweetalert'

const Tables = () => {
    const canMigrateAll = ability.can('read', 'migrate_all_orders')
    const [conditions, setConditions] = useState([
        {
            col: 'options->taxed', op: '=', val: true
        },
        {
            col: 'is_migrated', op: '=', val: false
        },
         {
            col: 'taxed_at', op: '>=',  val: moment('01-04-2025', 'DD-MM-YYYY').format('YYYY-MM-DD')
        }
    ])
    const [isLoading, setIsLoading] = useState(false)
    const handleMigration = async () => {
        try {


            // Call submitMigrate directly (no form.handleSubmit)
            const result = await api.submitMigrateAll()


            toast.success(result.message)
        } catch (error) {
            console.error('Migration error:', error)
            toast.error(error.response?.data?.message || 'Migration failed')
        }
    }

    const handleClick = async () => {

        confirm(async () => {
            setIsLoading(true)
            try {
                handleMigration()
                console.log('test')
            } catch (error) {
                setIsLoading(false)
            } finally {
                setIsLoading(false)
            }
        })
    }
    return <Fragment>
        <div className={'d-flex justify-content-between align-items-center'}>
            <div style={{width:'50%'}}>
                <Breadcrumbs breadCrumbTitle='Orders' breadCrumbActive='Orders' />
            </div>
            {
                canMigrateAll &&
                <Button.Ripple
                    color={'primary'}
                    style={{ width:'auto'  }}
                    block
                    onClick={handleClick}
                    disabled={isLoading}
                >
                    {isLoading ? 'Migrating...' : 'Migrate All'}
                </Button.Ripple>
            }

        </div>

        <Datatable
            useDatatable={useDatatable}
            initialOrder={{column: 'id', dir: 'desc'}}
            defaultSortField={'number'}
            defaultSortAsc={false}
            conditions= { conditions}
            actions={actions}
            columns={[
                {
                    name: 'Number',
                    selector: 'number',
                    sortable: true,
                    sortField: 'id',
                    minWidth: '100px'
                },
                {
                    name: 'Tax Number',
                    selector: 'tax_number',
                    sortable: true,
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
                    name: 'notes',
                    selector: 'notes',
                    sortable: true,
                    sortField: 'notes',
                    minWidth: '100px'
                },
                {
                    name: 'customer',
                    selector: 'customer.phone',
                    sortField: 'customer->phone',
                    sortable: true,
                    minWidth: '100px'
                },
                {
                    name: 'Status',
                    sortable: false,
                    minWidth: '100px',
                    cell: row => (
                        <>
                            {
                                (row.options?.price_offer && row.status === 'PENDING') &&
                                <Badge className='text-capitalize' color={'light-secondary'} pill>Price Offer</Badge>
                            }
                            {
                                (!row.options?.taxed && row.status === 'CANCELED') &&
                                <Badge className='text-capitalize' color={'light-secondary'} pill>DELETED</Badge>
                            }
                            {
                                (row.options?.taxed && row.status === 'CANCELED') &&
                                <Badge className='text-capitalize' color={'light-secondary'} pill>RETURNED</Badge>
                            }
                            {
                                ((row.options?.taxed && !row.options?.price_offer  && row.status === 'PENDING') || (!row.options?.price_offer  && row.status === 'PENDING')) &&
                                <Badge className='text-capitalize' color={'light-secondary'} pill>New Order</Badge>
                            }
                            {
                                (!row.options?.dept && row.shipping?.status !== 'SHIPPED' && row.shipping?.status !== 'DELIVERED'  && row.status === 'PROCESSING') &&
                                <Badge className='text-capitalize' color={'light-secondary'} pill>Processing</Badge>
                            }
                            {
                                (row.shipping?.status !== 'WAITING' && row.shipping?.status !== null  && row.status === 'PROCESSING') &&
                                <Badge className='text-capitalize' color={'light-secondary'} pill>Delivery</Badge>
                            }
                            {
                                (row.shipping?.status === 'WAITING' && row.shipping?.status !== null  && row.status === 'PROCESSING') &&
                                <Badge className='text-capitalize' color={'light-secondary'} pill>Processing</Badge>
                            }
                            {
                                (row.status === 'COMPLETED') &&
                                <Badge className='text-capitalize' color={'light-secondary'} pill>COMPLETED</Badge>
                            }
                        </>
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
}


export default Tables
