import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap'
import { FileText, MoreVertical, Trash, Send } from 'react-feather'
import { Link } from 'react-router-dom'
import { confirm } from '@components/sweetalert'
import { toast } from "react-toastify"
import ability from "../../configs/acl/ability"

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


const canEditUser = ability.can('read', 'user_edit')
const canDeleteUser = ability.can('read', 'user_delete')
const canSendVerificationEmail = ability.can('read', 'user_send_verification_email')

export default (row, mutates) => {
    const roles = row.roles
    const rolesArray = []
    roles.map((role, index) => {
        rolesArray[index] = `${role.name}_`
    })
  return  <div className='column-action d-flex align-items-center'>
        {(canSendVerificationEmail || canEditUser || canDeleteUser) &&
            <UncontrolledDropdown>
                <DropdownToggle className='pr-1' tag='span'>
                    <MoreVertical size={15} className='cursor-pointer'/>
                </DropdownToggle>
                <DropdownMenu right>
                    {canSendVerificationEmail &&
                        <DropdownItem tag='a' href='/' className='w-100' onClick={e => verificationEmail(e, row, mutates)}>
                            <Send size={15}/>
                            <span className='align-middle ml-50'>Verification Email</span>
                        </DropdownItem>
                    }
                    {(canEditUser && ((ability.can('read', 'user_add_admin') && rolesArray.includes("admin_")) || !rolesArray.includes("admin_"))) &&
                        <DropdownItem tag={Link} to={`/employee/edit/${row.id}`} className='w-100'>
                            <FileText size={15}/>
                            <span className='align-middle ml-50'>Edit</span>
                        </DropdownItem>
                    }
                    {canDeleteUser &&
                        <DropdownItem tag='a' href='/' className='w-100' onClick={e => onDelete(e, row, mutates)}>
                            <Trash size={15}/>
                            <span className='align-middle ml-50'>Delete</span>
                        </DropdownItem>
                    }
                </DropdownMenu>
            </UncontrolledDropdown>
        }
    </div>
}

