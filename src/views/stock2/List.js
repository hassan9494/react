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
            toUpdate[row.id] = { sku: row.sku, source_sku: row.source_sku, min_qty: row.min_qty, stock: row.stock, brand_id:row.brand_id, source_id:row.source_id, ...newData }
        }
    }

    const onSubmit = async () => {
        const products = Object.entries(toUpdate).map(([id, { stock, sku, min_qty, source_sku, brand_id, source_id}]) => {
            return {
                id,
                stock,
                sku,
                min_qty,
                source_sku,
                brand_id,
                source_id
            }
        })
        if (products.length > 0) {
            await api.sku({ products })
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
                        name: 'Brand',
                        selector: 'brand_id',
                        sortable: true,
                        minWidth: '200px',
                        maxWidth: '300px',
                        cell: row => (
                            <div style={{width: '100%'}}>
                                <Select
                                    options={brandsSelect}
                                    value={brandsSelect.find(option => option.value === row.brand_id)}
                                    onChange={(selectedOption) => onRowChange(row, 'brand_id', selectedOption.value)}
                                />
                            </div>
                        ),
                        omit: !ability.can('read', 'stock2_minimum_quantity')
                    },
                    {
                        name: 'Source',
                        selector: 'source_id',
                        sortable: true,
                        minWidth: '200px',
                        maxWidth: '300px',
                        cell: row => (
                            <div style={{width: '100%'}}>
                                <Select
                                    options={sourcesSelect}
                                    value={sourcesSelect.find(option => option.value === row.source_id)}
                                    onChange={(selectedOption) => onRowChange(row, 'source_id', selectedOption.value)}
                                />
                            </div>
                        ),
                        omit: !ability.can('read', 'stock2_minimum_quantity')
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
                        ),
                        omit: !ability.can('read', 'stock2_minimum_quantity')
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
                        ),
                        omit: !ability.can('read', 'stock2_mikro_sku')
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
                        ),
                        omit: !ability.can('read', 'stock2_source_sku')
                    }
                ]}
            />
        </Fragment>
    )
}
