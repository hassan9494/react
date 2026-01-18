import {Eye, Trash, RefreshCcw} from 'react-feather'
import {Link} from 'react-router-dom'
import {confirm} from '@components/sweetalert'
import ability from "../../configs/acl/ability"
import { api } from '@data/use-product'

const onDelete = async (e, row, mutates) => {
    e.preventDefault()
    confirm(() => mutates.delete(row.id))
}

const onRestore = async (e, row, mutates) => {
    e.preventDefault()
    confirm(() => api.restore(row.id))
}

const canEditProduct = ability.can('read', 'product_edit')
const canDeleteProduct = ability.can('read', 'product_delete')

export default (row, mutates) => (
    <div className='column-action d-flex align-items-center'>

        {/*{canDeleteProduct &&*/}
        {/*<Link to='#'>*/}
        {/*    <Trash size={17}  className='mx-1'  onClick={e => onDelete(e, row, mutates)}/>*/}
        {/*</Link>*/}
        {/*}*/}
        {canDeleteProduct &&

        <Link to='#'>
            <RefreshCcw  size={17} onClick={e => onRestore(e, row, mutates)}/>
        </Link>
        }

    </div>
)