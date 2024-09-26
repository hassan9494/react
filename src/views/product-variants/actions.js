import { Eye, Trash } from 'react-feather'
import { Link } from 'react-router-dom'
import { confirm } from '@components/sweetalert'
import ability from "../../configs/acl/ability"

const onDelete = async (e, row, mutates) => {
    e.preventDefault()
    confirm(() => mutates.delete(row.id))
}

const canShowProductVariants = ability.can('read', 'product_variants_list_view')

export default (row, mutates) => (
    <div className='column-action d-flex align-items-center'>
        {canShowProductVariants &&
            <Link to={`/product_variants/show/${row.id}`}>
                <Eye size={17} className='mx-1' />
            </Link>
        }

    </div>
)