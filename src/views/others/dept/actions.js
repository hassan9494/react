import { Edit, Trash } from 'react-feather'
import { Link } from 'react-router-dom'
import { confirmDelete } from '@components/sweetalert'
import ability from "../../../configs/acl/ability"

const onDelete = async (row, mutates) => {
    confirmDelete(() => mutates.delete(row.id))
}

const actions = (row, mutates) => (
    <div className='column-action d-flex align-items-center'>
        {ability.can('read', 'dept_edit') &&
        <Link to={`/dept/edit/${row.id}`} className='mx-1'>
            <Edit size={17} />
        </Link>
        }
        {ability.can('read', 'dept_delete') &&
        <Link to='#' className='mx-1'>
            <Trash size={17} onClick={() => onDelete(row, mutates)}/>
        </Link>
        }
    </div>
)

export default actions