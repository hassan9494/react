import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap'
import { FileText, MoreVertical, Trash } from 'react-feather'
import { Link } from 'react-router-dom'
import { confirm } from '@components/sweetalert'
import ability from "../../configs/acl/ability"

const onDelete = async (e, row, mutates) => {
    e.preventDefault()
    confirm(() => mutates.delete(row.id))
}

const canEditLocation = ability.can('read', 'location_edit')
const canDeleteLocation = ability.can('read', 'location_delete')

export default (row, mutates) => (
    <div className='column-action d-flex align-items-center'>
        {(canDeleteLocation || canEditLocation) &&
        <UncontrolledDropdown>
            <DropdownToggle className='pr-1' tag='span'>
                <MoreVertical size={15} className='cursor-pointer'/>
            </DropdownToggle>
            <DropdownMenu right>
                {canEditLocation &&
                <DropdownItem tag={Link} to={`/location/edit/${row.id}`} className='w-100'>
                    <FileText size={15}/>
                    <span className='align-middle ml-50'>Edit</span>
                </DropdownItem>
                }
                {canDeleteLocation &&
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