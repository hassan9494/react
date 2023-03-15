import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap'
import { FileText, MoreVertical, Trash, Send } from 'react-feather'
import { Link } from 'react-router-dom'
import { confirm } from '@components/sweetalert'
import { toast } from "react-toastify"

const onDelete = async (e, row, mutates) => {
    e.preventDefault()
    confirm(() => mutates.delete(row.id))
}
const verificationEmail = async (e, row, mutates) => {
    e.preventDefault()
    confirm(async  () => {
        await mutates.verificationEmail(row.id)
        toast.success('Success')
    })
}

export default (row, mutates) => (
    <div className='column-action d-flex align-items-center'>
        <UncontrolledDropdown>
            <DropdownToggle className='pr-1' tag='span'>
                <MoreVertical size={15} className='cursor-pointer'/>
            </DropdownToggle>
            <DropdownMenu right>
                <DropdownItem tag='a' href='/' className='w-100' onClick={e => verificationEmail(e, row, mutates)}>
                    <Send size={15}/>
                    <span className='align-middle ml-50'>Verification Email</span>
                </DropdownItem>
                <DropdownItem tag={Link} to={`/user/edit/${row.id}`} className='w-100'>
                    <FileText size={15}/>
                    <span className='align-middle ml-50'>Edit</span>
                </DropdownItem>
                <DropdownItem tag='a' href='/' className='w-100' onClick={e => onDelete(e, row, mutates)}>
                    <Trash size={15}/>
                    <span className='align-middle ml-50'>Delete</span>
                </DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>
    </div>
)