// ** React Imports
import { Link } from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Store & Actions
import { useDispatch } from 'react-redux'
import { handleLogout } from '@store/actions/auth'

// ** Third Party Components
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap'
import { User, Power } from 'react-feather'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/avatar.png'
import useAuth from '@data/use-auth'

const UserDropdown = () => {
    // ** Store Vars
    const { user } = useAuth()
    const dispatch = useDispatch()

    //** Vars
    const userAvatar = (user && user.avatar) || defaultAvatar

    return (
        <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
            <DropdownToggle href='/' tag='a' className='nav-link dropdown-user-link' onClick={e => e.preventDefault()}>
                <div className='user-nav d-sm-flex d-none'>
                    <span className='user-name font-weight-bold'>{(user && user?.name) || 'User'}</span>
                    <span className='user-status'>{(user && user?.role) || 'Admin'}</span>
                </div>
                <Avatar img={userAvatar} imgHeight='40' imgWidth='40' status='online'/>
            </DropdownToggle>
            <DropdownMenu right>
                <DropdownItem tag={Link} to='#' onClick={e => e.preventDefault()}>
                    <User size={14} className='mr-75'/>
                    <span className='align-middle'>Profile</span>
                </DropdownItem>
                <DropdownItem tag={Link} to='/login' onClick={() => dispatch(handleLogout())}>
                    <Power size={14} className='mr-75'/>
                    <span className='align-middle'>Logout</span>
                </DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>
    )
}

export default UserDropdown
