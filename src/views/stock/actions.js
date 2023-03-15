import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap'
import { Save } from 'react-feather'
import { Link } from 'react-router-dom'
import { confirm } from '@components/sweetalert'

const onDelete = async (e, row, mutates) => {
    e.preventDefault()
    confirm(() => mutates.delete(row.id))
}

export default (row, mutates) => (

    <div className='column-action d-flex align-items-center'>
        <Save size={18} className='mx-1' />
    </div>
)