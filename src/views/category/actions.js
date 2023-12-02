import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap'
import { FileText, MoreVertical, Trash } from 'react-feather'
import { Link } from 'react-router-dom'
import { confirm } from '@components/sweetalert'
import ability from "../../configs/acl/ability"

const onDelete = async (e, row, mutates) => {
    e.preventDefault()
    confirm(() => mutates.delete(row.id))
}

const canEditCategory = ability.can('read', 'category_edit')
const canDeleteCategory = ability.can('read', 'category_delete')

export default (row, mutates) => (
    <div className='column-action d-flex align-items-center'>
        {(canDeleteCategory || canEditCategory) &&
        <UncontrolledDropdown>
            <DropdownToggle className='pr-1' tag='span'>
                <MoreVertical size={15} className='cursor-pointer'/>
            </DropdownToggle>
            <DropdownMenu right>
                {canEditCategory &&
                <DropdownItem tag={Link} to={`/category/edit/${row.id}`} className='w-100'>
                    <FileText size={15}/>
                    <span className='align-middle ml-50'>Edit</span>
                </DropdownItem>
                }
                {canDeleteCategory &&
                    <DropdownItem tag='a' href='/' className='w-100' onClick={e => onDelete(e, row, mutates)}>
                        <Trash size={15}/>
                        <span className='align-middle ml-50'>Delete</span>
                    </DropdownItem>
                }

            </DropdownMenu>
        </UncontrolledDropdown>
        }
    </div>
)