import React, {Fragment, useEffect, useRef, useState} from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useStockDatatable, api } from '@data/use-product'
import Avatar from '@components/avatar'
import { Button, Input } from 'reactstrap'
import { toast } from 'react-toastify'
import ability from "../../configs/acl/ability"
import { useBrands } from '@data/use-brand'
import { useSources } from '@data/use-source'

export default function() {
    let toUpdate = {}

    const onRowChange = (row, key, value) => {
        const numericFields = ['stock', 'purchases_qty', 'stock_available', 'store_available']
        const processedValue = numericFields.includes(key) && value === '' ? 0 : value

        if (toUpdate[row.id]) {
            toUpdate[row.id][key] = processedValue
        } else {
            toUpdate[row.id] = {
                ...row,
                [key]: processedValue
            }
        }
    }

    const onSubmit = async () => {
        const products = Object.entries(toUpdate).map(([id, data]) => ({
            id,
            ...data
        }))

        if (products.length > 0) {
            await api.stock2({ products })
            toast.success('Updated')
            toUpdate = {}
        }
    }

    const NumericInput = ({ row, field }) => {
        const [value, setValue] = useState(row[field])
        const inputRef = useRef(null)

        useEffect(() => {
            const input = inputRef.current
            if (!input) return

            const handleWheel = (e) => {
                if (document.activeElement === input) {
                    e.preventDefault()
                }
            }

            // Modern way to add non-passive event listener
            input.addEventListener('wheel', handleWheel, { passive: false })

            return () => {
                input.removeEventListener('wheel', handleWheel)
            }
        }, [])

        const handleChange = (e) => {
            const newValue = e.target.value === '' ? 0 : e.target.value
            setValue(newValue)
            onRowChange(row, field, newValue)
        }


        return (
            <Input
                type="number"
                innerRef={inputRef}
                value={value}
                onChange={handleChange}
                onWheel={(e) => {
                    if (document.activeElement === e.target) {
                        e.preventDefault()
                    }
                }}
            />
        )
    }

    const readOnlyStockAvailable = ability.can('read', 'stock_available_read_only')

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Products' breadCrumbActive='Products' />
            <Datatable
                isSticky={true}
                filterBar={ability.can('read', 'stock2_save') ? (
                    <Button.Ripple color='success' onClick={onSubmit}>
                        Save Changes
                    </Button.Ripple>
                ) : null}
                useDatatable={useStockDatatable}
                columns={[
                    {
                        name: 'Name',
                        selector: 'name',
                        sortable: true,
                        minWidth: '400px',
                        cell: row => (
                            <div className='d-flex align-items-center'>
                                <Avatar img={row.image} className="mr-2"/>
                                <a className='text-dark' href={`${process.env.REACT_APP_WEBSITE}/product/${row.link}`} target='_blank' rel="noopener noreferrer">
                                    {row.name}
                                </a>
                            </div>
                        )
                    },
                    {
                        name: 'Purchases Qty',
                        selector: 'purchases_qty',
                        cell: row => <NumericInput row={row} field="purchases_qty" />,
                        omit: !ability.can('read', 'stock2_minimum_quantity')
                    },
                    {
                        name: 'Available',
                        selector: 'stock',
                        sortable: true,
                        cell: row => {
                            const inputRef = useRef(null) // Create a ref for the input

                            useEffect(() => {
                                const handleWheel = (e) => {
                                    e.preventDefault() // Prevent mouse wheel changes
                                }

                                const currentInput = inputRef.current
                                if (currentInput) {
                                    currentInput.addEventListener('wheel', handleWheel)
                                }

                                return () => {
                                    if (currentInput) {
                                        currentInput.removeEventListener('wheel', handleWheel)
                                    }
                                }
                            }, [])

                            return (
                                !readOnlyStockAvailable ?  <div>
                                    <Input
                                        type='number'
                                        defaultValue={row.stock}
                                        onChange={(e) => onRowChange(row, 'stock', e.target.value)}
                                        innerRef={inputRef} // Attach ref to Input
                                    />
                                </div> : <div>
                                    <span>{row.stock}</span>
                                </div>
                            )
                        },
                        omit: !ability.can('read', 'stock_available')
                    },
                    {
                        name: 'Stock Available',
                        selector: 'stock_available',
                        cell: row => <NumericInput row={row} field="stock_available" />,
                        omit: !ability.can('read', 'stock2_source_sku')
                    },
                    {
                        name: 'Store Available',
                        selector: 'store_available',
                        cell: row => <NumericInput row={row} field="store_available" />,
                        omit: !ability.can('read', 'stock2_source_sku')
                    }
                ]}
            />
        </Fragment>
    )
}