// ** States
import { Fragment, useState } from 'react'
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
    add,
    actions,
    conditions,
    filterBar,
    hasSearch =  true,
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

    const { data, total, mutates, loading } = useDatatable({
        page: currentPage,
        limit: rowsPerPage,
        search: searchValue,
        order,
        conditions
    })

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


    // ** Custom Pagination
    const Footer = () => {
        // const count = Number((store.total / rowsPerPage).toFixed(0))
        const count = Math.ceil((total / rowsPerPage))

        if (!footer) return <></>

        return (
            <>
                <hr className='my-0'/>
                <div className="d-flex">
                    <div className="px-1 d-flex align-items-center">
                        <Label for='sort-select'>show</Label>
                        <Input
                            className='dataTable-select'
                            type='select'
                            id='sort-select'
                            value={rowsPerPage}
                            onChange={e => handlePerPage(e)}
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </Input>
                        <Label for='sort-select'>entries</Label>
                    </div>
                    <div className="ml-auto px-1">
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
                                'pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'
                            }
                        />
                    </div>
                </div>
            </>
        )
    }

    // ** Table data to render
    const dataToRender = () => data.slice(0, rowsPerPage)


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
            <Col className='d-flex align-items-center justify-content-end' sm='8'>
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
                { header ?  header : <Header /> }
                <DataTable
                    noHeader
                    className='react-dataTable'
                    columns={columns}
                    sortIcon={<ChevronDown size={10}/>}
                    onSort={handleSort}
                    pagination
                    paginationServer
                    paginationComponent={Footer}
                    data={dataToRender()}
                    progressPending={loading}
                    progressComponent={
                        <Spinner color='primary' className="my-3"/>
                    }
                    persistTableHead={true}
                    {...props}
                />
            </Card>
        </Fragment>
    )
}
