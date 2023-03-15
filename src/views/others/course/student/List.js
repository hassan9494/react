import Datatable from '@components/datatable/local'
import { Link, useParams } from 'react-router-dom'
import { Button, CardHeader, CardTitle } from 'reactstrap'
import { DollarSign, Trash } from 'react-feather'
import { confirmDelete } from '@components/sweetalert'
import { api } from '@data/use-course-student'

const List = ({ useStudents }) => {

    const { id } = useParams()


    const onDelete = async (row, mutate) => {
        confirmDelete(async () => {
            await api.delete(row.id)
            await mutate()
        })
    }

    const actions = (row, mutate) => (
        <div className='column-action d-flex align-items-center'>
            <Link to={`/receipt/add?student=${row.id}`} className='mx-1'>
                <DollarSign size={17} />
            </Link>
            <Link to='#' className='mx-1'>
                <Trash size={17} onClick={() => onDelete(row, mutate)}/>
            </Link>
        </div>
    )

    const Header = () => (
        <CardHeader className='py-1'>
            <CardTitle>
                Students
            </CardTitle>
            <div className='d-flex align-items-center justify-content-end'>
                <Button.Ripple tag={Link} to={`/course/${id}/student/add`} color='primary' size='sm'>Add Student</Button.Ripple>
            </div>
        </CardHeader>
    )

    return (
        <Datatable
            header={<Header />}
            useTable={useStudents}
            actions={actions}
            pagination={false}
            columns={[
                {
                    name: 'Name',
                    selector: 'name',
                    sortable: true,
                    minWidth: '225px'
                },
                {
                    name: 'Phone',
                    selector: 'phone',
                    sortable: true,
                    minWidth: '225px'
                },
                {
                    name: 'Email',
                    selector: 'email',
                    sortable: true,
                    minWidth: '225px'
                },
                {
                    name: 'Paid Amount',
                    minWidth: '225px',
                    cell: row => {
                        const payments = row?.payments || []
                        let total = 0
                        for (const payment of payments) total += payment.amount
                        return total
                    }
                }
            ]}
        />
    )
}

export default List
