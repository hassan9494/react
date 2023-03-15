import { Link, useHistory } from 'react-router-dom'
import { login } from '@data/use-auth'
import { useForm } from 'react-hook-form'
import { Facebook, Twitter, Mail, GitHub } from 'react-feather'
import InputPasswordToggle from '@components/input-password-toggle'
import { Card, CardBody, CardText, Form, FormGroup, Label, Input, CustomInput, Button } from 'reactstrap'
import '@styles/base/pages/page-auth.scss'
import themeConfig from '@configs/themeConfig'

const LoginV1 = () => {


    const history = useHistory()
    const { handleSubmit, register, errors } = useForm()

    const onSubmit = async (data) => {
        await login(data)
        history.push('/')
    }

    return (
        <div className='auth-wrapper auth-v1 px-2'>
            <div className='auth-inner py-2'>
                <Card className='mb-0'>
                    <CardBody>
                        <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
                            <h2 className='brand-text text-primary ml-1'>{ themeConfig.app.appName }</h2>
                        </Link>
                        <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
                             <FormGroup>
                                 <Label className='form-label' for='login-email'>Email</Label>
                                 <Input
                                     id='login-email'
                                     type='email'
                                     name='email'
                                     innerRef={register({required: true})}
                                     invalid={errors.email && true}
                                     autoFocus
                                 />
                            </FormGroup>

                            <FormGroup>
                                <div className='d-flex justify-content-between'>
                                    <Label className='form-label' for='login-password'>Password</Label>
                                    <Link to='/'>
                                        <small>Forgot Password?</small>
                                    </Link>
                                </div>
                                <Input
                                    id='login-password'
                                    type='password'
                                    name='password'
                                    innerRef={register({required: true})}
                                    invalid={errors.email && true}
                                    autoFocus
                                />
                            </FormGroup>

                            <FormGroup>
                                <CustomInput type='checkbox' className='custom-control-Primary' id='remember-me' label='Remember Me' />
                            </FormGroup>

                            <Button.Ripple color='primary' block className='mt-2' type='submit'>
                                Sign in
                            </Button.Ripple>

                        </Form>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}

export default LoginV1
