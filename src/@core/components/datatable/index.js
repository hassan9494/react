// ** States
import { Fragment, useState, useRef, useEffect } from 'react'
import ReactPaginate from 'react-paginate'
import { Button, Card, CardHeader, CardTitle, Col, Input, Label, Row, Spinner } from 'reactstrap'
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
// ** Styles
import DatatableSearch from './DatatableSearch'
// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'
import DatatableTitle from './DatatableTitle'

export default function Datatable({
                                      useDatatable,
                                      columns,
                                      isSticky = false,
                                      add,
                                      actions,
                                      conditions,
                                      dateRange,
                                      filterBar,
                                      hasSearch = true,
                                      title = '',
                                      header,
                                      footer = true,
                                      initialOrder = {},
                                      ...props
                                  }) {

    const [currentPage, setCurrentPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [order, setOrder] = useState(initialOrder)
    const [searchValue, setSearchValue] = useState('')
    const [pageInputValue, setPageInputValue] = useState('')
    const pageInputRef = useRef(null)
    const [isInputFocused, setIsInputFocused] = useState(false)

    const { data, total, mutates, loading } = useDatatable({
        page: currentPage,
        limit: rowsPerPage,
        search: searchValue,
        order,
        conditions,
        dateRange
    })

    // Keep input focused after re-renders
    useEffect(() => {
        if (isInputFocused && pageInputRef.current) {
            pageInputRef.current.focus()
        }
    })

    // Update input value when currentPage changes
    useEffect(() => {
        setPageInputValue('')
    }, [currentPage])

    if (actions) {
        columns.push({
            name: 'Actions',
            allowOverflow: true,
            width: '200px',
            cell: (row) => actions(row, mutates)
        })
    }

    // ** Function to handle filter
    const handleFilter = q => {
        setCurrentPage(0)
        setSearchValue(q)
    }

    // ** Function to handle Pagination and get data
    const handlePagination = page => setCurrentPage(page.selected)

    // ** Function to handle per page
    const handlePerPage = e => {
        setCurrentPage(0)
        setRowsPerPage(parseInt(e.target.value))
    }

    // ** Function to handle per page
    const handleSort = (column, dir) => {
        setOrder({ column: column?.sortField || column.selector, dir })
    }

    // ** Function to handle direct page navigation
    const handlePageInput = (e) => {
        // Only allow numbers
        const value = e.target.value.replace(/[^0-9]/g, '')
        setPageInputValue(value)
    }

    // ** Function to navigate to the specified page
    const goToPage = () => {
        if (!pageInputValue) return

        const pageNumber = parseInt(pageInputValue, 10)
        const totalPages = Math.ceil(total / rowsPerPage)

        if (pageNumber < 1 || pageNumber > totalPages) {
            // Invalid page number, reset input
            setPageInputValue('')
            return
        }

        // Convert to zero-based index for ReactPaginate
        setCurrentPage(pageNumber - 1)
    }

    // ** Function to handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            goToPage()
        }
    }

    // ** Custom Pagination
    const Footer = () => {
        const count = Math.ceil((total / rowsPerPage))

        if (!footer) return <></>

        return (
            <>
                <hr className='my-0' />
                <div className="d-flex justify-content-between align-items-center flex-wrap p-1">
                    <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center">
                            <Label for='sort-select' className='mb-0 mr-1'>Show</Label>
                            <Input
                                className='dataTable-select'
                                type='select'
                                id='sort-select'
                                value={rowsPerPage}
                                onChange={e => handlePerPage(e)}
                                style={{ width: '80px' }}
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </Input>
                            <Label for='sort-select' className='mb-0 ml-1'>entries</Label>
                        </div>

                        {/* Page input field */}
                        <div className="d-flex align-items-center ml-2">
                            <Label for='page-input' className='mb-0 mr-1'>Go to page:</Label>
                            <Input
                                innerRef={pageInputRef}
                                type='text'
                                id='page-input'
                                value={pageInputValue}
                                onChange={handlePageInput}
                                onKeyPress={handleKeyPress}
                                onFocus={() => setIsInputFocused(true)}
                                onBlur={() => setIsInputFocused(false)}
                                style={{ width: '60px', marginRight: '8px' }}
                                placeholder='Page #'
                            />
                            <Button
                                color='primary'
                                size='sm'
                                onClick={goToPage}
                                disabled={!pageInputValue}
                            >
                                Go
                            </Button>
                        </div>
                    </div>

                    <div className="d-flex align-items-center mt-1 mt-sm-0">
                        <div className="d-flex align-items-center mr-2">
              <span className="text-muted">
                {total > 0 ? `Page ${currentPage + 1} of ${count}` : 'No pages'}
              </span>
                        </div>
                        <ReactPaginate
                            previousLabel={''}
                            nextLabel={''}
                            breakLabel='...'
                            pageCount={count || 1}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={2}
                            activeClassName='active'
                            forcePage={currentPage}
                            onPageChange={page => handlePagination(page)}
                            pageClassName={'page-item'}
                            nextLinkClassName={'page-link'}
                            nextClassName={'page-item next'}
                            previousClassName={'page-item prev'}
                            previousLinkClassName={'page-link'}
                            pageLinkClassName={'page-link'}
                            breakClassName='page-item'
                            breakLinkClassName='page-link'
                            containerClassName={
                                'pagination react-paginate separated-pagination pagination-sm justify-content-end'
                            }
                        />
                    </div>
                </div>
            </>
        )
    }

    // ** Table data to render
    const dataToRender = () => {
        if (!data || !Array.isArray(data)) return []
        return data
    }

    const Header = () => (
        <Row className='mx-0 mt-1 mb-50'>
            {
                hasSearch &&
                <Col className='d-flex align-items-center' sm='4'>
                    <DatatableSearch
                        handleFilter={handleFilter}
                        initialSearchValue={searchValue}
                    />
                </Col>
            }
            <Col className='d-flex align-items-center justify-content-sm-end justify-content-start mt-1 mt-sm-0' sm='8'>
                {
                    filterBar
                }
                {
                    add &&
                    <Button.Ripple tag={Link} to={add} color='primary ml-1'>
                        Add Record
                    </Button.Ripple>
                }
            </Col>
        </Row>
    )

    return (
        <Fragment>
            <Card>
                <DatatableTitle title={title} />
                {header ? header : <Header />}
                <DataTable
                    style={isSticky ? { overflowY: 'scroll', maxHeight: '700px' } : {}}
                    noHeader
                    className='react-dataTable'
                    columns={columns}
                    sortIcon={<ChevronDown size={10} />}
                    onSort={handleSort}
                    pagination
                    paginationServer
                    paginationComponent={Footer}
                    data={dataToRender()}
                    progressPending={loading}
                    progressComponent={
                        <Spinner color='primary' className="my-3" />
                    }
                    persistTableHead={true}
                    {...props}
                />
            </Card>
        </Fragment>
    )
}
