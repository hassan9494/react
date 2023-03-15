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
            toUpdate[row.id] = { ...row.price, stock: row.stock, ...newData }
        }
    }

    const onSubmit = async () => {
        const products = Object.entries(toUpdate).map(([id, {stock, real_price, normal_price, sale_price, distributor_price }]) => {
            return {
                id,
                stock,
                price: {
                    real_price, normal_price, sale_price, distributor_price
                }
            }
        })
        if (products.length > 0) {
            await api.stock({ products })
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
                        name: 'Normal Price',
                        selector: 'price',
                        sortField: 'price->normal_price',
                        sortable: true,
                        cell: row => (
                            <div>
                                <Input
                                    type='number'
                                    defaultValue={row.price.normal_price}
                                    step='0.001'
                                    onChange={(e) => onRowChange(row, 'normal_price', e.target.value)}
                                />
                            </div>
                        )
                    },
                    {
                        name: 'Sale Price',
                        selector: 'price',
                        sortField: 'price->sale_price',
                        sortable: true,
                        cell: row => (
                            <div>
                                <Input
                                    type='number'
                                    name={`product.${row.id}.price.sale_price`}
                                    defaultValue={row.price.sale_price}
                                    step='0.001'
                                    onChange={(e) => onRowChange(row, 'sale_price', e.target.value)}
                                />
                            </div>
                        )
                    },
                    {
                        name: 'Real Price',
                        selector: 'price',
                        sortField: 'price->real_price',
                        sortable: true,
                        cell: row => (
                            <div>
                                <Input
                                    type='number'
                                    name={`product.${row.id}.price.real_price`}
                                    defaultValue={row.price.real_price}
                                    step='0.001'
                                    onChange={(e) => onRowChange(row, 'real_price', e.target.value)}
                                />
                            </div>
                        )
                    },
                    {
                        name: 'Dist Price',
                        selector: 'price',
                        sortField: 'price->distributor_price',
                        sortable: true,
                        cell: row => (
                            <div>
                                <Input
                                    type='number'
                                    name={`product.${row.id}.price.distributor_price`}
                                    defaultValue={row.price.distributor_price}
                                    step='0.001'
                                    onChange={(e) => onRowChange(row, 'distributor_price', e.target.value)}
                                />
                            </div>
                        )
                    }
                ]}
            />
        </Fragment>
    )
}
