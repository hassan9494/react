import { Fragment } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useStockDatatable, api } from '@data/use-product'
import Avatar from '@components/avatar'
import { Button, Input } from 'reactstrap'
import { toast } from 'react-toastify'


export default function() {

    let toUpdate = {}

    const onRowChange = (row, key, value) => {
        const newData = { [key]: value }
        if (toUpdate[row.id]) {
            toUpdate[row.id][key] = value
        } else {
            toUpdate[row.id] = { sku: row.sku, source_sku: row.source_sku, min_qty: row.min_qty, stock: row.stock, ...newData }
        }
    }

    const onSubmit = async () => {
        const products = Object.entries(toUpdate).map(([id, {stock, sku, min_qty, source_sku }]) => {
            return {
                id,
                stock,
                sku,
                min_qty,
                source_sku

            }
        })
        if (products.length > 0) {
            await api.sku({ products })
            toast.success('Updated')
            toUpdate = {}
        }
    }

    const Filters = () => <Button.Ripple color='success' onClick={onSubmit}>Save Changes</Button.Ripple>

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Products' breadCrumbActive='Products'/>
            <Datatable
                filterBar={<Filters />}
                useDatatable={useStockDatatable}
                columns={[
                    {
                        name: 'Name',
                        selector: 'name',
                        sortField: 'name',
                        sortable: true,
                        minWidth: '400px',
                        maxWidth: '600px',
                        cell: row => (
                            <div><Avatar img={row.image} className={"mr-2"}/> {row.name.slice(0, 30)}... </div>
                        )
                    },
                    {
                        name: 'Available',
                        selector: 'stock',
                        sortable: true,
                        cell: row => (
                            <div>
                                <Input
                                    type='number'
                                    defaultValue={row.stock}
                                    onChange={(e) => onRowChange(row, 'stock', e.target.value)}
                                />
                            </div>
                        )
                    },
                    {
                        name: 'Minimum Quantity',
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
                        )
                    },
                    {
                        name: 'Mikro SKU',
                        selector: 'sku',
                        sortable: true,
                        cell: row => (
                            <div>
                                <Input
                                    type='text'
                                    defaultValue={row.sku}
                                    onChange={(e) => onRowChange(row, 'sku', e.target.value)}
                                />
                            </div>
                        )
                    },
                    {
                        name: 'Source SKU',
                        selector: 'source_sku',
                        sortable: true,
                        cell: row => (
                            <div>
                                <Input
                                    type='text'
                                    defaultValue={row.source_sku}
                                    onChange={(e) => onRowChange(row, 'source_sku', e.target.value)}
                                />
                            </div>
                        )
                    }
                ]}
            />
        </Fragment>
    )
}
