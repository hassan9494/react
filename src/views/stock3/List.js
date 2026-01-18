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
    const toUpdate = useRef({}) // Use ref to persist changes without re-renders

    const onChange = (row, key, value) => {
        // Define numeric fields for proper value handling
        const numericFields = [
            'air_min_qty', 'air_order_qty',
            'sea_min_qty', 'sea_order_qty',
            'local_min_qty', 'local_order_qty',
            'purchases_qty'
        ]

        // Process value based on field type
        let processedValue = value

        if (numericFields.includes(key)) {
            processedValue = value === '' ? 0 : Number(value)
        } else if (key.includes('_id')) {
            // Handle ID fields (source_id, brand_id) - convert empty string to null
            processedValue = value === '' || value === undefined ? null : value
        }

        // Get or create row update object
        if (!toUpdate.current[row.id]) {
            toUpdate.current[row.id] = {}
        }

        // Update the specific field
        toUpdate.current[row.id][key] = processedValue

        // Keep the row id for reference
        toUpdate.current[row.id].id = row.id
    }

    const onSubmit = async () => {
        // Convert object of updates to array
        const products = Object.values(toUpdate.current)

        if (products.length > 0) {
            try {
                // Send all updates to a single endpoint
                await api.stock3({ products })
                toast.success('Updated successfully')

                // Reset updates
                toUpdate.current = {}

                // Optionally refresh the data table here if needed
                // refreshTable()

            } catch (error) {
                toast.error('Update failed')
                console.error('Update error:', error)
            }
        } else {
            toast.info('No changes to save')
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

            input.addEventListener('wheel', handleWheel, { passive: false })

            return () => {
                input.removeEventListener('wheel', handleWheel)
            }
        }, [])

        const handleChange = (e) => {
            const newValue = e.target.value
            setValue(newValue)
            onChange(row, field, newValue)
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

    const TextInput = ({ row, field }) => {
        const [value, setValue] = useState(row[field] || '')

        const handleChange = (e) => {
            const newValue = e.target.value
            setValue(newValue)
            onChange(row, field, newValue)
        }

        return (
            <Input
                type="text"
                value={value}
                onChange={handleChange}
            />
        )
    }

    // Custom Select Cell Component for Source
    const SelectCell = ({ row, field, options }) => {
        const [selectedValue, setSelectedValue] = useState(() => {
            // Check if we have an update for this field
            if (toUpdate.current[row.id]?.[field] !== undefined) {
                return options.find(option => option.value === toUpdate.current[row.id][field])
            }
            // Otherwise use the original row value
            return options.find(option => option.value === row[field])
        })

        const handleChange = (selectedOption) => {
            setSelectedValue(selectedOption)
            const value = selectedOption?.value ?? null
            onChange(row, field, value)
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

    const { data: sources } = useSources()
    const sourcesSelect = [
        ...sources.map(e => ({
            value: e.id,
            label: e.name
        }))
    ]

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Stock 3' breadCrumbActive='Stock 3' />
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
                        name: 'Available',
                        selector: 'stock',
                        minWidth: '100px',
                        cell: row =>  row.stock,
                        omit: !ability.can('read', 'stock_available')
                    },

                    // Air Section
                    {
                        name: 'Air Source',
                        selector: 'air_source_id',
                        sortable: true,
                        minWidth: '200px',
                        cell: row => (
                            <SelectCell
                                row={row}
                                field="air_source_id"
                                options={sourcesSelect}
                            />
                        ),
                        omit: !ability.can('read', 'stock2_minimum_quantity')
                    },
                    {
                        name: 'Air sourcesku',
                        selector: 'air_source_sku',
                        minWidth: '200px',
                        cell: row => (
                            <TextInput
                                row={row}
                                field="air_source_sku"
                            />
                        ),
                        omit: !ability.can('read', 'stock2_source_sku')
                    },
                    {
                        name: 'Air Minimum Qty',
                        selector: 'air_min_qty',
                        minWidth: '200px',
                        cell: row => <NumericInput row={row} field="air_min_qty" />,
                        omit: !ability.can('read', 'stock2_minimum_quantity')
                    },
                    {
                        name: 'Air Order Qty',
                        selector: 'air_order_qty',
                        minWidth: '200px',
                        cell: row => <NumericInput row={row} field="air_order_qty" />,
                        omit: !ability.can('read', 'stock2_mikro_sku')
                    },

                    // Sea Section
                    {
                        name: 'Sea Source',
                        selector: 'sea_source_id',
                        sortable: true,
                        minWidth: '200px',
                        cell: row => (
                            <SelectCell
                                row={row}
                                field="sea_source_id"
                                options={sourcesSelect}
                            />
                        ),
                        omit: !ability.can('read', 'stock2_minimum_quantity')
                    },
                    {
                        name: 'Sea sourcesku',
                        selector: 'sea_source_sku',
                        minWidth: '200px',
                        cell: row => (
                            <TextInput
                                row={row}
                                field="sea_source_sku"
                            />
                        ),
                        omit: !ability.can('read', 'stock2_source_sku')
                    },
                    {
                        name: 'Sea Minimum Qty',
                        selector: 'sea_min_qty',
                        minWidth: '200px',
                        cell: row => <NumericInput row={row} field="sea_min_qty" />,
                        omit: !ability.can('read', 'stock2_minimum_quantity')
                    },
                    {
                        name: 'Sea Order Qty',
                        selector: 'sea_order_qty',
                        minWidth: '200px',
                        cell: row => <NumericInput row={row} field="sea_order_qty" />,
                        omit: !ability.can('read', 'stock2_mikro_sku')
                    },

                    // Local Section
                    {
                        name: 'Local Source',
                        selector: 'local_source_id',
                        sortable: true,
                        minWidth: '200px',
                        cell: row => (
                            <SelectCell
                                row={row}
                                field="local_source_id"
                                options={sourcesSelect}
                            />
                        ),
                        omit: !ability.can('read', 'stock2_minimum_quantity')
                    },
                    {
                        name: 'Local sourcesku',
                        selector: 'local_source_sku',
                        minWidth: '200px',
                        cell: row => (
                            <TextInput
                                row={row}
                                field="local_source_sku"
                            />
                        ),
                        omit: !ability.can('read', 'stock2_source_sku')
                    },
                    {
                        name: 'Local Minimum Qty',
                        selector: 'local_min_qty',
                        minWidth: '200px',
                        cell: row => <NumericInput row={row} field="local_min_qty" />,
                        omit: !ability.can('read', 'stock2_minimum_quantity')
                    },
                    {
                        name: 'Local Order Qty',
                        selector: 'local_order_qty',
                        minWidth: '200px',
                        cell: row => <NumericInput row={row} field="local_order_qty" />,
                        omit: !ability.can('read', 'stock2_mikro_sku')
                    },

                    // Purchases Qty
                    {
                        name: 'Purchases Qty',
                        selector: 'purchases_qty',
                        minWidth: '200px',
                        cell: row => <NumericInput row={row} field="purchases_qty" />,
                        omit: !ability.can('read', 'stock2_minimum_quantity')
                    }
                ]}
            />
        </Fragment>
    )
}