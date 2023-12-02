import { Eye, Trash } from 'react-feather'
import { Link } from 'react-router-dom'
import { confirm } from '@components/sweetalert'
import ability from "../../configs/acl/ability"

const onDelete = async (e, row, mutates) => {
    e.preventDefault()
    confirm(() => mutates.delete(row.id))
}

const canEditProduct = ability.can('read', 'product_edit')
const canDeleteProduct = ability.can('read', 'product_delete')

export default (row, mutates) => (
    <div className='column-action d-flex align-items-center'>
        {canEditProduct &&
            <Link to={`/product/edit/${row.id}`}>
                <Eye size={17} className='mx-1' />
            </Link>
        }
        {canDeleteProduct &&
            <Link to='#'>
                <Trash size={17} onClick={e => onDelete(e, row, mutates)}/>
            </Link>
        }

    </div>
)