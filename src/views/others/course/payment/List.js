import Datatable from '@components/datatable/local'
import DatatableTitle from '@components/datatable/DatatableTitle'
import { Link } from 'react-router-dom'
import { Edit, Printer, Trash } from 'react-feather'
import { confirmDelete } from '@components/sweetalert'
import { api } from '@data/use-receipt'
import moment from 'moment'

const List = ({ usePayments }) => {

    const onDelete = async (row, mutate) => {
        confirmDelete(async () => {
            await api.delete(row.id)
            await mutate()
        })
    }

    const actions = (row, mutate) => (
        <div className='column-action d-flex align-items-center'>
            <Link to={`/receipt/print/${row.id}`} className='mx-1' target='_blank'>
                <Printer size={17} />
            </Link>
            <Link to={`/receipt/edit/${row.id}`} className='mx-1'>
                <Edit size={17} />
            </Link>
            <Link to='#' className='mx-1'>
                <Trash size={17} onClick={() => onDelete(row, mutate)}/>
            </Link>
        </div>
    )

    return (
        <Datatable
            header={<DatatableTitle title='Payments' />}
            useTable={usePayments}
            actions={actions}
            pagination={false}
            columns={[
                {
                    name: 'number',
                    selector: 'number',
                    sortable: true,
                    minWidth: '225px'
                },
                {
                    name: 'Student',
                    selector: 'name',
                    sortable: true,
                    minWidth: '225px'
                },
                {
                    name: 'Amount',
                    selector: 'amount',
                    sortable: true,
                    minWidth: '225px'
                },
                {
                    name: 'Date',
                    selector: 'date',
                    sortable: true,
                    minWidth: '225px',
                    cell: (row) => moment(row.date).format('Y-MM-DD')
                }
            ]}
        />
    )
}

export default List
