import { Eye, Trash } from 'react-feather'
import { Link } from 'react-router-dom'
import { confirm } from '@components/sweetalert'

const onDelete = async (e, row, mutates) => {
    e.preventDefault()
    confirm(() => mutates.delete(row.id))
}

export default (row, mutates) => (
    <div className='column-action d-flex align-items-center'>
        <Link to={`/product/edit/${row.id}`}>
            <Eye size={17} className='mx-1' />
        </Link>
        <Link to='#'>
            <Trash size={17} onClick={e => onDelete(e, row, mutates)}/>
        </Link>
    </div>
)