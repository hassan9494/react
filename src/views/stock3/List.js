import { Fragment } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useStockDatatable, api } from '@data/use-product'
import Avatar from '@components/avatar'
import { Button, Input } from 'reactstrap'
import { toast } from 'react-toastify'
import ability from "../../configs/acl/ability"
import { useBrands } from '@data/use-brand'
import { useSources } from '@data/use-source'
import Select from "react-select"

export default function() {

    let toUpdate = {}

    const onRowChange = (row, key, value) => {
        const newData = { [key]: value }
        if (toUpdate[row.id]) {
            toUpdate[row.id][key] = value
        } else {
            toUpdate[row.id] = {  min_qty: row.min_qty, order_qty: row.order_qty, location:row.location, stock_available:row.stock_available, store_available:row.store_available, ...newData }
        }
    }

    const onSubmit = async () => {
        const products = Object.entries(toUpdate).map(([id, { order_qty, location, min_qty, stock_available, store_available }]) => {
            return {
                id,
                min_qty,
                order_qty,
                location,
                stock_available,
                store_available
            }
        })
        if (products.length > 0) {
            await api.stock2({ products })
            toast.success('Updated')
            toUpdate = {}
        }
    }

    const Filters = () => <Button.Ripple color='success' onClick={onSubmit}>Save Changes</Button.Ripple>

    const { data: brands } = useBrands()
    const brandsSelect = brands.map(e => {
        return {
            value: e.id,
            label: e.name
        }
    })
    const { data: sources } = useSources()
    const sourcesSelect = sources.map(e => {
        return {
            value: e.id,
            label: e.name
        }
    })

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Products' breadCrumbActive='Products' />
            <Datatable
                filterBar={ability.can('read', 'stock2_save') ? <Filters /> : null}
                useDatatable={useStockDatatable}
                columns={[
                    {
                        name: 'Name',
                        selector: 'name',
                        sortField: 'name',
                        sortable: true,
                        minWidth: '400px',
                        maxWidth: '500px',
                        cell: row => (
                            <div style={{width:'100%'}}><Avatar img={row.image} className={"mr-2"} /> {row.name.slice(0, 30)}... </div>
                        )
                    },
                    {
                        name: 'Minimum Qty',
                        selector: 'min_qty',
                        sortable: true,
                        cell: row => (
                            <div>
                                <Input
                                    type='number'
                                    defaultValue={row.min_qty}
                                    onChange={(e) => onRowChange(row, 'min_qty', e.target.value)}
                                />
                            </div>
                        ),
                        omit: !ability.can('read', 'stock2_minimum_quantity')
                    },
                    {
                        name: 'Order Qty',
                        selector: 'order_qty',
                        sortable: true,
                        cell: row => (
                            <div>
                                <Input
                                    type='text'
                                    defaultValue={row.order_qty}
                                    onChange={(e) => onRowChange(row, 'order_qty', e.target.value)}
                                />
                            </div>
                        ),
                        omit: !ability.can('read', 'stock2_mikro_sku')
                    },
                    {
                        name: 'Location',
                        selector: 'location',
                        sortable: true,
                        cell: row => (
                            <div>
                                <Input
                                    type='text'
                                    defaultValue={row.location}
                                    onChange={(e) => onRowChange(row, 'location', e.target.value)}
                                />
                            </div>
                        ),
                        omit: !ability.can('read', 'stock2_source_sku')
                    },
                    {
                        name: 'Stock Available',
                        selector: 'stock_available',
                        sortable: true,
                        cell: row => (
                            <div>
                                <Input
                                    type='text'
                                    defaultValue={row.stock_available}
                                    onChange={(e) => onRowChange(row, 'stock_available', e.target.value)}
                                />
                            </div>
                        ),
                        omit: !ability.can('read', 'stock2_source_sku')
                    },
                    {
                        name: 'Store Available',
                        selector: 'store_available',
                        sortable: true,
                        cell: row => (
                            <div>
                                <Input
                                    type='text'
                                    defaultValue={row.store_available}
                                    onChange={(e) => onRowChange(row, 'store_available', e.target.value)}
                                />
                            </div>
                        ),
                        omit: !ability.can('read', 'stock2_source_sku')
                    }
                ]}
            />
        </Fragment>
    )
}
