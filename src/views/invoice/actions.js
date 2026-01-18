import { Eye, Printer } from 'react-feather'
import { Link } from 'react-router-dom'
import { confirm } from '@components/sweetalert'
import ability from "../../configs/acl/ability"

const onDelete = async (e, row, mutates) => {
    e.preventDefault()
    confirm(() => mutates.delete(row.id))
}
const canEditInvoice = ability.can('read', 'invoice_edit')
export default (row, mutates) => (
    <div className='column-action d-flex align-items-center'>
        {canEditInvoice &&
        <Link to={`/invoice/edit/${row.id}`} id={`pw-tooltip-${row.id}`}>
            <Eye size={17} className='mx-1' />
        </Link>
        }
        {/*{canPrintOrder &&*/}
        {/*<Link to={`/order/print/${row.id}`} id={`pw-tooltip-${row.id}`} target='_blank'>*/}
        {/*    <Printer size={17} className='mx-1' />*/}
        {/*</Link>*/}
        {/*}*/}
    </div>
)