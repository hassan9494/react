import { Eye, Printer, Info } from 'react-feather'
import { Link } from 'react-router-dom'
import { confirm } from '@components/sweetalert'
import ability from "../../configs/acl/ability"
import axios from '../../utility/axiosIsntance'


const recordEditView = async (orderId) => {
    try {
        await axios.post(`order/${orderId}/record-edit-view`)
        console.log("➡️ API call to:", `${axiosInstance.defaults.baseURL  }/${  url}`)

    } catch (error) {
        console.error('Failed to record edit view:', error)
    }
}


const onDelete = async (e, row, mutates) => {
    e.preventDefault()
    confirm(() => mutates.delete(row.id))
}

const canEditOrder = ability.can('read', 'order_edit')
const canPrintOrder = ability.can('read', 'order_print')
const canViewDetails = ability.can('read', 'order_details')  // Use the new permission

export default (row, mutates) => (
    <div className='column-action d-flex align-items-center'>
        {canViewDetails &&
        <Link to={`/order/details/${row.id}`} id={`pw-tooltip-${row.id}`}>
            <Info size={17} className='mx-1' />
        </Link>
        }
        {canEditOrder &&
        <Link
            to={`/order/edit/${row.id}`}
            id={`pw-tooltip-${row.id}`}
            onClick={() => recordEditView(row.id)}
        >
            <Eye size={17} className='mx-1' />
        </Link>
        }

        {canPrintOrder &&
        <Link to={`/order/print/${row.id}`} id={`pw-tooltip-${row.id}`} target='_blank'>
            <Printer size={17} className='mx-1' />
        </Link>
        }
    </div>
)
