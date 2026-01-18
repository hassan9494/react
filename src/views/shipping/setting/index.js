import { Fragment, useState, useEffect } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import { useParams } from 'react-router-dom'
import { Button, Card, CardBody, Row, Col, Form, FormGroup, Input, Label, Badge, Collapse, Tooltip, Alert } from 'reactstrap'
import FormErrors from '@components/form-errors'
import { useForm } from 'react-hook-form'
import CardHeader from 'reactstrap/lib/CardHeader'
import { useModel, api } from '@data/use-setting'

export default () => {
    const { id } = useParams()
    const { data: responseData, update, loading, error, mutate } = useModel(2)
    const { register, errors, handleSubmit, control, setValue, watch } = useForm()
    const [formErrors, setFormErrors] = useState(null)


    // Extract data from the response
    const setting = responseData?.setting

    // Set the default value when setting data is available
    useEffect(() => {
        if (setting && setting.value) {
            setValue('value', setting.value)
        }
    }, [setting, setValue])

    const onSubmit = async data => {
        try {
            await update(data)
            console.log('Submitted data:', data)
        } catch (e) {
            setFormErrors(e.response?.data?.errors)
        }
    }
    if (loading) {
        return <></>
    }

    if (error) {
        return <div>Error loading data: {error.message}</div>
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Settings' breadCrumbActive='free shipping limit'/>
            <Row>
                <Col lg='10'>
                    {/* Search Type Settings */}
                    <Card>
                        <CardHeader className='p-1 d-flex justify-content-between align-items-center'>
                            Free shipping limit
                            <Button.Ripple color='success' type='submit' onClick={handleSubmit(onSubmit)}>
                                Save
                            </Button.Ripple>
                        </CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <FormGroup tag="fieldset">
                                    <Label for='value'>Value</Label>
                                    <FormGroup>
                                        <Input
                                            type='number'
                                            name='value'
                                            id='value'
                                            innerRef={register({ required: true })}
                                            onChange={(e) => setValue('value', e.target.value)}
                                        />
                                        {errors.value && <span className='text-danger'>This field is required</span>}
                                    </FormGroup>
                                </FormGroup>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}