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

export default function Local({
    header,
    columns = [],
    actions,
    pagination = true,
    conditions = {},
    useTable
}) {

    const { data, mutate } = useTable({ conditions })

    if (actions) {
        columns.push({
            name: 'Actions',
            allowOverflow: true,
            width: '200px',
            cell: (row) => actions(row, mutate)
        })
    }

    return (
        <Card>
            { header }
            <DataTable
                noHeader
                pagination={pagination}
                data={data}
                columns={columns}
                className='react-dataTable'
                sortIcon={<ChevronDown size={10} />}
                persistTableHead={true}
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
            />
        </Card>
    )
}
