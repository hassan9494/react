import React, { Fragment, useState, useEffect, useMemo } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import {
    Card,
    CardBody,
    CardHeader,
    Badge,
    Button,
    Input,
    Row,
    Col,
    Spinner,
    Alert
} from 'reactstrap'
import {
    Plus,
    Search,
    Filter,
    RefreshCw,
    ChevronDown,
    ChevronUp,
    Package,
    Clock,
    User,
    CheckCircle,
    XCircle,
    AlertCircle,
    Truck
} from 'react-feather'
import { Link } from 'react-router-dom'
import Datatable from '../../@core/components/datatable'
import { useTransferOrders, api } from '../../data/use-transfer-order'
import TransferOrderActions from './actions'
import ability from '../../configs/acl/ability'
import { showError, showSuccess } from '../../utility/Utils'

const TransferOrderList = () => {
    const [filters, setFilters] = useState({
        status: 'all',
        search: '',
        startDate: '',
        endDate: ''
    })
    const [showFilters, setShowFilters] = useState(false)
    const canCreate = ability.can('read', 'transfer_order_create')

    // Custom hook for datatable
    const useTransferOrderDatatable = (params) => {
        const { page, per_page, conditions = {}, dateRange = {}, searchTerm = '' } = params

        // Map conditions to API filters
        const apiFilters = {
            page,
            per_page,
            ...(conditions.status && conditions.status !== 'all' && { status: conditions.status }),
            ...(searchTerm && { search: searchTerm }),
            ...(conditions.search && { search: conditions.search }),
            ...(dateRange.startDate && { start_date: dateRange.startDate }),
            ...(dateRange.endDate && { end_date: dateRange.endDate })
        }

        const { data: transferOrders, isLoading, total, refetch } = useTransferOrders(apiFilters)

        return {
            data: transferOrders || [],
            total: total || 0,
            loading: isLoading,
            error: null,
            refetch
        }
    }

    // Status options
    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'PENDING', label: 'Pending' },
        { value: 'COMPLETED', label: 'Completed' }
    ]

    // Columns for Datatable
    const columns = useMemo(() => [
        {
            name: 'TRANSFER #',
            selector: row => row.number,
            sortable: true,
            minWidth: '120px',
            cell: row => (
                <div className="font-weight-bold">
                    <Link to={`/transfer-order/details/${row.id}`} className="text-primary">
                        {row.number}
                    </Link>
                    <div className="small text-muted mt-1">
                        {new Date(row.created_at).toLocaleDateString()}
                    </div>
                </div>
            )
        },
        {
            name: 'PRODUCTS',
            selector: row => row.summary?.total_products || 0,
            sortable: true,
            width: '100px',
            cell: row => (
                <div className="text-center">
                    <div className="d-flex align-items-center justify-content-center">
                        <Package size={16} className="me-1 text-primary" />
                        <span className="fw-bold">{row.summary?.total_products || 0}</span>
                    </div>
                    <div className="small text-muted">
                        {row.summary?.total_quantity || 0} units
                    </div>
                </div>
            )
        },
        {
            name: 'QUANTITY',
            selector: row => row.summary?.total_quantity || 0,
            sortable: true,
            width: '100px',
            cell: row => (
                <div className="text-center fw-bold">
                    {row.summary?.total_quantity || 0}
                </div>
            )
        },
        {
            name: 'CREATED BY',
            selector: row => row.created_by?.name,
            sortable: true,
            minWidth: '180px',
            cell: row => (
                <div>
                    <div className="d-flex align-items-center">
                        <User size={14} className="me-1 text-muted" />
                        <span>{row.created_by?.name || 'System'}</span>
                    </div>
                    <small className="text-muted d-block">
                        {row.created_by?.email || ''}
                    </small>
                </div>
            )
        },
        {
            name: 'STATUS',
            selector: row => row.status,
            sortable: true,
            width: '130px',
            cell: row => {
                const statusConfig = {
                    PENDING: {
                        color: 'warning',
                        icon: <AlertCircle size={12} />,
                        text: 'Pending',
                        tooltip: 'Awaiting completion'
                    },
                    COMPLETED: {
                        color: 'success',
                        icon: <CheckCircle size={12} />,
                        text: 'Completed',
                        tooltip: 'Transfer completed'
                    }
                }

                const config = statusConfig[row.status] || {
                    color: 'secondary',
                    icon: null,
                    text: row.status,
                    tooltip: row.status
                }

                return (
                    <Badge
                        color={config.color}
                        className="d-flex align-items-center gap-1"
                        pill
                    >
                        {config.icon}
                        <span>{config.text}</span>
                    </Badge>
                )
            }
        },
        {
            name: 'COMPLETED AT',
            selector: row => row.completed_at,
            sortable: true,
            width: '150px',
            cell: row => (row.completed_at ? (
                <div className="small d-flex align-items-center">
                    <Clock size={10} className="me-1 text-muted" />
                    {new Date(row.completed_at).toLocaleDateString()}
                </div>
            ) : (
                <span className="text-muted small">-</span>
            ))
        },
        {
            name: 'NOTES',
            minWidth: '200px',
            cell: row => (
                <div className="small text-truncate" style={{ maxWidth: '200px' }}>
                    {row.notes || <span className="text-muted">No notes</span>}
                </div>
            )
        },
        {
            name: 'ACTIONS',
            width: '250px',
            cell: row => <TransferOrderActions row={row} refetch={() => {}} />
        }
    ], [])

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    // Reset all filters
    const resetFilters = () => {
        setFilters({
            status: 'all',
            search: '',
            startDate: '',
            endDate: ''
        })
    }

    // Alternative: Inline filter bar that sits next to the table header
    const InlineFilterBar = () => (
        <div className="d-flex align-items-center gap-3 mb-2">
            <div className="d-flex align-items-center gap-2">

                {/* Status Filter */}
                <select
                    className="form-select form-select-sm border-0 shadow-sm"
                    style={{ width: '140px' }}
                    value={filters.status}
                    onChange={e => handleFilterChange('status', e.target.value)}
                >
                    {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Date Range */}
                <div className="d-flex align-items-center gap-1">
                    <Input
                        type="date"
                        value={filters.startDate}
                        onChange={e => handleFilterChange('startDate', e.target.value)}
                        className="form-control-sm"
                        style={{ width: '130px' }}
                        placeholder="Start date"
                    />
                    <span className="text-muted small">to</span>
                    <Input
                        type="date"
                        value={filters.endDate}
                        onChange={e => handleFilterChange('endDate', e.target.value)}
                        className="form-control-sm"
                        style={{ width: '130px' }}
                        placeholder="End date"
                    />
                </div>
            </div>

            {/* Reset Button */}
            {(filters.status !== 'all' || filters.startDate || filters.endDate) && (
                <Button
                    color="light"
                    size="sm"
                    onClick={resetFilters}
                    className="d-flex align-items-center ms-auto"
                >
                    <RefreshCw size={12} className="me-1" />
                    Reset
                </Button>
            )}
        </div>
    )
    // Header actions component
    const HeaderActions = () => (
        <div className="ms-auto">
            {canCreate && (
                <Link to="/transfer-order/create">
                    <Button color="primary" size="sm" className="d-flex align-items-center">
                        <Plus size={14} className="me-1" />
                        New Transfer
                    </Button>
                </Link>
            )}
        </div>
    )


    return (
        <Fragment>
            <Breadcrumbs
                breadCrumbTitle='Transfer Orders'
                breadCrumbActive='List'
            />

            <Card>
                <CardHeader>
                    <div className="d-flex justify-content-between align-items-center w-100">
                        <div>
                            <h4 className="mb-0">Transfer Orders</h4>
                        </div>
                        <HeaderActions />

                    </div>
                </CardHeader>
                <CardBody>
                    <InlineFilterBar  />

                    <Datatable
                        useDatatable={useTransferOrderDatatable}
                        columns={columns}
                        title=""
                        hasSearch={true}
                        conditions={{
                            status: filters.status,
                            search: filters.search
                        }}
                        dateRange={{
                            startDate: filters.startDate,
                            endDate: filters.endDate
                        }}
                        isSticky={true}
                        initialOrder={{ column: 'created_at', dir: 'desc' }}
                        noDataComponent={
                            <div className="text-center py-5">
                                <div className="mb-3">
                                    <Truck size={48} className="text-muted" />
                                </div>
                                <h5>No Transfer Orders Found</h5>
                                <p className="text-muted mb-4">
                                    {filters.status !== 'all' || filters.search || filters.startDate || filters.endDate ? 'Try adjusting your filters' : 'Create your first transfer order'}
                                </p>
                                {canCreate && !(filters.status !== 'all' || filters.search || filters.startDate || filters.endDate) && (
                                    <Link to="/transfer-order/create">
                                        <Button color="primary">
                                            <Plus size={14} className="me-1" />
                                            Create Transfer Order
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        }
                    />
                </CardBody>
            </Card>

            <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
        }
        .text-truncate {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
        </Fragment>
    )
}

export default TransferOrderList