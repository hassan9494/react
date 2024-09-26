// ** React Imports
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
// ** User Edit Components
import PasswordTab from './Password'
import AccountTab from './Account'
import { useModel } from '@data/use-user'

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux'

// ** Third Party Components
import { User, Info, Key } from 'react-feather'
import { Card, CardBody, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane, Alert } from 'reactstrap'

// ** Styles
import '@styles/react/apps/app-users.scss'

const UserEdit = () => {

    // const { id } = useParams()
    //
    // const { data: model, update } = useModel(id)

    // ** States & Vars
    const [activeTab, setActiveTab] = useState('1')
        // store = useSelector(state => state.users),
        // dispatch = useDispatch(),
        // {id} = useParams()

    // ** Function to toggle tabs
    const toggle = tab => setActiveTab(tab)

    // // ** Function to get user on mount
    // useEffect(() => {
    //   dispatch(getUser(parseInt(id)))
    // }, [dispatch])

    return (
        <Row className='app-user-edit'>
            <Col sm='9'>
                <Card>
                    <CardBody className='pt-2'>
                        <Nav pills>
                            <NavItem>
                                <NavLink active={activeTab === '1'} onClick={() => toggle('1')}>
                                    <User size={14}/>
                                    <span className='align-middle d-none d-sm-block'>Account</span>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink active={activeTab === '2'} onClick={() => toggle('2')}>
                                    <Key size={14}/>
                                    <span className='align-middle d-none d-sm-block'>Password</span>
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={activeTab}>
                            <TabPane tabId='1'>
                                <AccountTab />
                            </TabPane>
                            <TabPane tabId='2'>
                                <PasswordTab />
                            </TabPane>
                        </TabContent>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    )
}
export default UserEdit
