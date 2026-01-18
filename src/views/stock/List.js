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
import Select from "react-select"

export default function() {
    let toUpdate = {}

    const onRowChange = (row, key, value) => {
        const newData = { [key]: value }
        if (toUpdate[row.id]) {
            toUpdate[row.id][key] = value
        } else {
            toUpdate[row.id] = {
                sku: row.sku,
                stock_location: row.stock_location,
                location: row.location,
                stock: row.stock,
                brand_id: row.brand_id,
                ...newData
            }
        }
    }

    const onSubmit = async () => {
        const products = Object.entries(toUpdate).map(([id, { stock, sku, location, stock_location, brand_id }]) => {
            return {
                id,
                stock,
                sku,
                location,
                stock_location,
                brand_id: brand_id || null // Set to null if empty
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
    const brandsSelect = [ // Add clear option
        ...brands.map(e => ({
            value: e.id,
            label: e.name
        }))
    ]

    const { data: sources } = useSources()
    const sourcesSelect = [ // Add clear option
        ...sources.map(e => ({
            value: e.id,
            label: e.name
        }))
    ]

    // Custom Select Cell Component to handle value changes properly
    const SelectCell = ({ row, field, options }) => {
        const [selectedValue, setSelectedValue] = useState(() => {
            // Check if we have an updated value first
            if (toUpdate[row.id]?.[field] !== undefined) {
                return options.find(option => option.value === toUpdate[row.id][field])
            }
            // Fall back to row value
            return options.find(option => option.value === row[field])
        })

        const handleChange = (selectedOption) => {
            setSelectedValue(selectedOption)
            onRowChange(row, field, selectedOption?.value ?? null)
        }

        return (
            <div style={{width: '100%'}}>
                <Select
                    options={options}
                    value={selectedValue}
                    onChange={handleChange}
                    isClearable={true}
                />
            </div>
        )
    }

    // Numeric Input with wheel prevention
    const NumericInputCell = ({ row, field }) => {
        const inputRef = useRef(null)
        const [value, setValue] = useState(row[field])

        useEffect(() => {
            const handleWheel = (e) => {
                if (document.activeElement === inputRef.current) {
                    e.preventDefault()
                }
            }

            const currentInput = inputRef.current
            currentInput?.addEventListener('wheel', handleWheel, { passive: false })

            return () => {
                currentInput?.removeEventListener('wheel', handleWheel)
            }
        }, [])

        const handleChange = (e) => {
            setValue(e.target.value)
            onRowChange(row, field, e.target.value)
        }

        return (
            <Input
                type='number'
                innerRef={inputRef}
                value={value}
                onChange={handleChange}
                onWheel={(e) => e.target === document.activeElement && e.preventDefault()}
            />
        )
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Products' breadCrumbActive='Products' />
            <Datatable
                isSticky={true}
                filterBar={ability.can('read', 'stock2_save') ? <Filters /> : null}
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
                        name: 'Brand',
                        selector: 'brand_id',
                        sortable: true,
                        minWidth: '200px',
                        cell: row => (
                            <SelectCell
                                row={row}
                                field="brand_id"
                                options={brandsSelect}
                            />
                        ),
                        omit: !ability.can('read', 'stock2_minimum_quantity')
                    },
                    // {
                    //     name: 'Source',
                    //     selector: 'source_id',
                    //     sortable: true,
                    //     minWidth: '200px',
                    //     cell: row => (
                    //         <SelectCell
                    //             row={row}
                    //             field="source_id"
                    //             options={sourcesSelect}
                    //         />
                    //     ),
                    //     omit: !ability.can('read', 'stock2_minimum_quantity')
                    // },
                    {
                        name: 'Location',
                        selector: 'location',
                        cell: row => (
                            <Input
                                type='text'
                                defaultValue={row.location}
                                onChange={(e) => onRowChange(row, 'location', e.target.value)}
                            />
                        ),
                        omit: !ability.can('read', 'stock2_source_sku')
                    },
                    {
                        name: 'Stock Location',
                        selector: 'stock_location',
                        cell: row => (
                            <Input
                                type='text'
                                defaultValue={row.stock_location}
                                onChange={(e) => onRowChange(row, 'stock_location', e.target.value)}
                            />
                        ),
                        omit: !ability.can('read', 'stock2_source_sku')
                    },
                    {
                        name: 'Mikro SKU',
                        selector: 'sku',
                        sortable: true,
                        cell: row => (
                            <Input
                                type='text'
                                defaultValue={row.sku}
                                onChange={(e) => onRowChange(row, 'sku', e.target.value)}
                            />
                        ),
                        omit: !ability.can('read', 'stock2_mikro_sku')
                    }
                    // {
                    //     name: 'Source SKU',
                    //     selector: 'source_sku',
                    //     sortable: true,
                    //     cell: row => (
                    //         <Input
                    //             type='text'
                    //             defaultValue={row.source_sku}
                    //             onChange={(e) => onRowChange(row, 'source_sku', e.target.value)}
                    //         />
                    //     ),
                    //     omit: !ability.can('read', 'stock2_source_sku')
                    // }
                ]}
            />
        </Fragment>
    )
}