import Datatable from '@components/datatable/local'
import { Link, useParams } from 'react-router-dom'
import { Edit, Printer, Trash } from 'react-feather'
import { confirmDelete } from '@components/sweetalert'
import { api } from '@data/use-project-receipt'
import { Button, CardHeader, CardTitle, Col } from 'reactstrap'
import moment from 'moment'
import ability from "../../../../configs/acl/ability"

const List = ({ usePayments }) => {

    const { id } = useParams()

    const onDelete = async (row, mutate) => {
        confirmDelete(() => {
            api.delete(row.id)
            mutate()
        })
    }

    const actions = (row, mutate) => (
        <div className='column-action d-flex align-items-center'>
            {ability.can('read', 'receipt_print') &&
            <Link to={`/project-receipt/print/${row.id}`} className='mx-1' target='_blank'>
                <Printer size={17} />
            </Link>
            }
            {ability.can('read', 'receipt_edit') &&
            <Link to={`/project-receipt/edit/${row.id}`} className='mx-1'>
                <Edit size={17} />
            </Link>
            }
            {ability.can('read', 'receipt_delete') &&
            <Link to='#' className='mx-1'>
                <Trash size={17} onClick={() => onDelete(row, mutate)}/>
            </Link>
            }
        </div>
    )

    const Header = () => (
        <CardHeader className='py-1'>
            <CardTitle>
                Payments
            </CardTitle>
            {ability.can('read', 'receipt_add') &&
            <Col className='d-flex align-items-center justify-content-end' sm='8'>
                <Button.Ripple tag={Link} to={`/project-receipt/add?project=${id}`} color='primary' size='sm'>Add Payment</Button.Ripple>
            </Col>
            }
        </CardHeader>
    )

    return (
        <Datatable
            header={<Header />}
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
                    name: 'Name',
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
