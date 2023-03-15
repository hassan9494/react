import { Eye, Printer } from 'react-feather'
import { Link } from 'react-router-dom'
import { confirm } from '@components/sweetalert'

const onDelete = async (e, row, mutates) => {
    e.preventDefault()
    confirm(() => mutates.delete(row.id))
}

export default (row, mutates) => (
    <div className='column-action d-flex align-items-center'>
        <Link to={`/order/edit/${row.id}`} id={`pw-tooltip-${row.id}`}>
            <Eye size={17} className='mx-1' />
        </Link>
        <Link to={`/order/print/${row.id}`} id={`pw-tooltip-${row.id}`} target='_blank'>
            <Printer size={17} className='mx-1' />
        </Link>
    </div>
)