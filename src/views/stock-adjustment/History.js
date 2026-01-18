import React, { useState, useEffect } from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Badge,
  Button,
  Row,
  Col,
  Input,
  Alert,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'
import { Search, Filter, Download, Calendar, User, Package, RefreshCw } from 'react-feather'
import DataTable from 'react-data-table-component'
// import DatePicker from 'react-datepicker'
// import "react-datepicker/dist/react-datepicker.css"
import { useStockAdjustmentHistory } from '../../data/use-stock-adjustment'
// import { showError } from '../../utility/Utils'

const StockAdjustmentHistory = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [order, setOrder] = useState({})
  const [filters, setFilters] = useState({
    start_date: null,
    end_date: null,
    user_id: null,
    product_id: null,
    status: null,
    adjustment_type: null
  })
  const [filterDropdown, setFilterDropdown] = useState(false)

  const { data: adjustments, total, loading, error } = useStockAdjustmentHistory({
    page,
    limit,
    search,
    order,
    filters
  })

  const statusBadge = (status) => {
    const colors = {
      pending: 'warning',
      approved: 'success',
      rejected: 'danger'
    }

    return (
        <Badge color={colors[status] || 'secondary'} className="text-capitalize">
          {status}
        </Badge>
    )
  }

  const typeBadge = (type) => {
    return (
        <Badge color={type === 'increase' ? 'success' : 'danger'} className="text-uppercase">
          {type}
        </Badge>
    )
  }

  const columns = [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
      width: '80px'
    },
    {
      name: 'Product',
      selector: row => row.product?.name,
      sortable: true,
      cell: row => (
          <div>
            <div className="font-weight-bold">{row.product?.name}</div>
            <small className="text-muted">SKU: {row.product?.sku}</small>
          </div>
      )
    },
    {
      name: 'User',
      selector: row => row.user?.name,
      sortable: true,
      cell: row => (
          <div>
            <div>{row.user?.name}</div>
            <small className="text-muted">{row.user?.email}</small>
          </div>
      )
    },
    {
      name: 'Type',
      selector: row => row.adjustment_type,
      sortable: true,
      width: '100px',
      cell: row => typeBadge(row.adjustment_type)
    },
    {
      name: 'Qty',
      selector: row => row.quantity,
      sortable: true,
      width: '80px',
      cell: row => (
          <div className="text-center">
            <span className="font-weight-bold">{row.quantity}</span>
          </div>
      )
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      width: '100px',
      cell: row => statusBadge(row.status)
    },
    {
      name: 'Approver',
      selector: row => row.approver?.name,
      sortable: true,
      cell: row => (
          <div>
            {row.approver ? (
                <>
                  <div>{row.approver.name}</div>
                  <small className="text-muted">
                    {row.approved_at ? new Date(row.approved_at).toLocaleDateString() : ''}
                  </small>
                </>
            ) : (
                <span className="text-muted">-</span>
            )}
          </div>
      )
    },
    {
      name: 'Date',
      selector: row => new Date(row.created_at).toLocaleDateString(),
      sortable: true,
      width: '100px'
    },
    {
      name: 'Impact',
      selector: row => row.new_stock,
      sortable: true,
      cell: row => (
          <div>
            <div className="small text-muted">From: {row.current_stock || 0}</div>
            <div className="font-weight-bold">To: {row.new_stock}</div>
          </div>
      )
    }
  ]

  const handleSort = (column, sortDirection) => {
    setOrder({
      column: column.selector,
      direction: sortDirection
    })
  }

  const applyFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({
      start_date: null,
      end_date: null,
      user_id: null,
      product_id: null,
      status: null,
      adjustment_type: null
    })
    setSearch('')
    setPage(1)
  }

  const activeFiltersCount = Object.values(filters).filter(v => v !== null).length

  return (
      <Card>
        <CardHeader>
          <Row className="align-items-center">
            <Col md="6">
              <h4 className="mb-0">Stock Adjustment History</h4>
              <small className="text-muted">View all stock adjustment requests and their status</small>
            </Col>
            <Col md="6" className="text-end">
              <Button color="outline-secondary" size="sm" className="me-2">
                <Download size={14} className="me-1" />
                Export Report
              </Button>
              <Dropdown isOpen={filterDropdown} toggle={() => setFilterDropdown(!filterDropdown)}>
                <DropdownToggle color="outline-primary" size="sm" caret>
                  <Filter size={14} className="me-1" />
                  Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </DropdownToggle>
                <DropdownMenu className="p-3" style={{ minWidth: '300px' }}>
                  <div className="mb-2">
                    <small className="text-muted">Status</small>
                    <div className="d-flex gap-1 flex-wrap">
                      {['pending', 'approved', 'rejected'].map(status => (
                          <Button
                              key={status}
                              color={filters.status === status ? 'primary' : 'outline-secondary'}
                              size="sm"
                              onClick={() => applyFilter('status', filters.status === status ? null : status)}
                              className="text-capitalize"
                          >
                            {status}
                          </Button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-2">
                    <small className="text-muted">Type</small>
                    <div className="d-flex gap-1">
                      {['increase', 'decrease'].map(type => (
                          <Button
                              key={type}
                              color={filters.adjustment_type === type ? 'primary' : 'outline-secondary'}
                              size="sm"
                              onClick={() => applyFilter('adjustment_type', filters.adjustment_type === type ? null : type)}
                              className="text-capitalize"
                          >
                            {type}
                          </Button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-2">
                    <small className="text-muted">Date Range</small>
                    <Row>
                      <Col xs="6">
                        <DatePicker
                            selected={filters.start_date}
                            onChange={date => applyFilter('start_date', date)}
                            placeholderText="Start Date"
                            className="form-control form-control-sm"
                            dateFormat="yyyy-MM-dd"
                            maxDate={filters.end_date || new Date()}
                        />
                      </Col>
                      <Col xs="6">
                        <DatePicker
                            selected={filters.end_date}
                            onChange={date => applyFilter('end_date', date)}
                            placeholderText="End Date"
                            className="form-control form-control-sm"
                            dateFormat="yyyy-MM-dd"
                            minDate={filters.start_date}
                            maxDate={new Date()}
                        />
                      </Col>
                    </Row>
                  </div>

                  <div className="d-flex justify-content-between mt-3">
                    <Button color="secondary" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                    <Button color="primary" size="sm" onClick={() => setFilterDropdown(false)}>
                      Apply
                    </Button>
                  </div>
                </DropdownMenu>
              </Dropdown>
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          <Row className="mb-3">
            <Col md="6">
              <div className="input-group">
              <span className="input-group-text">
                <Search size={16} />
              </span>
                <Input
                    type="text"
                    placeholder="Search adjustments..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
              </div>
            </Col>
            <Col md="3">
              <select
                  className="form-select"
                  value={limit}
                  onChange={e => setLimit(Number(e.target.value))}
              >
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
                <option value="100">100 per page</option>
              </select>
            </Col>
            <Col md="3" className="text-end">
              <Button color="outline-secondary" size="sm" onClick={() => setPage(1)}>
                <RefreshCw size={14} className="me-1" />
                Refresh
              </Button>
            </Col>
          </Row>

          {error && (
              <Alert color="danger" className="mb-3">
                Error loading adjustment history: {error.message}
              </Alert>
          )}

          <DataTable
              columns={columns}
              data={adjustments}
              progressPending={loading}
              pagination
              paginationServer
              paginationTotalRows={total}
              paginationPerPage={limit}
              paginationRowsPerPageOptions={[10, 20, 50, 100]}
              onChangePage={setPage}
              onChangeRowsPerPage={setLimit}
              onSort={handleSort}
              sortServer
              highlightOnHover
              striped
              noDataComponent={
                <div className="p-5 text-center">
                  <Package size={48} className="text-muted mb-3" />
                  <h5>No stock adjustments found</h5>
                  <p className="text-muted">
                    {search || activeFiltersCount > 0 ? 'Try changing your search or filters' : 'No stock adjustment requests have been made yet'}
                  </p>
                </div>
              }
              subHeader={false}
          />

          {total > 0 && (
              <div className="mt-3 text-muted small">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} adjustments
              </div>
          )}
        </CardBody>
      </Card>
  )
}

export default StockAdjustmentHistory