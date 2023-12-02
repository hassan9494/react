import { Edit, Trash, Users } from 'react-feather'
import { Link } from 'react-router-dom'
import { confirmDelete } from '@components/sweetalert'
import ability from "../../../configs/acl/ability"

const onDelete = async (row, mutates) => {
    confirmDelete(() => mutates.delete(row.id))
}

const actions = (row, mutates) => (
    <div className='column-action d-flex align-items-center'>
        {ability.can('read', 'course_edit') &&
        <Link to={`/course/edit/${row.id}`} className='mx-1'>
            <Edit size={17} />
        </Link>
        }
        {ability.can('read', 'course_delete') &&
        <Link to='#' className='mx-1'>
            <Trash size={17} onClick={() => onDelete(row, mutates)}/>
        </Link>
        }
    </div>
)

export default actions