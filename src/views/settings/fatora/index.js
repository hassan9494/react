import { Fragment, useState, useEffect } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import { useParams } from 'react-router-dom'
import {
    Button,
    Card,
    CardBody,
    Row,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Badge,
    Collapse,
    Tooltip,
    Alert,
    InputGroup, InputGroupAddon, InputGroupText
} from 'reactstrap'
import FormErrors from '@components/form-errors'
import { useForm } from 'react-hook-form'
import CardHeader from 'reactstrap/lib/CardHeader'
import { useModel, api } from '@data/use-setting'

export default () => {
    const { id } = useParams()
    const { data: responseData, update, loading, error, mutate } = useModel(3)
    const { register, errors, handleSubmit, control, setValue } = useForm()
    const [formErrors, setFormErrors] = useState(null)

    // Extract data from the response
    const setting = responseData?.setting?.value

    // Set the default value when setting data is available
    useEffect(() => {
        if (setting) {
            setValue('company_id', JSON.parse(setting)?.company_id)
            setValue('seller_income_source', JSON.parse(setting)?.seller_income_source)
            setValue('seller_name', JSON.parse(setting)?.seller_name)
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
        return <div>Loading Elasticsearch monitoring data...</div>
    }

    if (error) {
        return <div>Error loading data: {error.message}</div>
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Settings' breadCrumbActive='Fatora'/>
            <Row>
                <Col lg='10'>
                    {/* Search Type Settings */}
                    <Card>
                        <CardHeader className='p-1 d-flex justify-content-between align-items-center'>
                            Fatora Data Information
                            <Button.Ripple color='success' type='submit' onClick={handleSubmit(onSubmit)}>
                                Save
                            </Button.Ripple>
                        </CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <FormGroup row>
                                    <Label sm='3' for='seller_name'><strong>Seller Name</strong></Label>
                                    <Col sm='6'>
                                            <Input
                                                name='seller_name'
                                                type='text'
                                                value={setting?.seller_name}
                                                defaultValue={'منتصر و محمود للالكترونيات'}
                                                innerRef={register({required: true})}
                                                invalid={errors.seller_name && true}
                                            />
                                    </Col>
                                    <Label sm='3' for='seller_name'><strong>اسم البائع</strong></Label>
                                </FormGroup>
                                <FormGroup row>
                                    <Label sm='3' for='seller_income_source'><strong>Seller Income Source </strong></Label>
                                    <Col sm='6'>
                                            <Input
                                                name='seller_income_source'
                                                type='text'
                                                value={setting?.seller_income_source}
                                                defaultValue={'13322320'}
                                                innerRef={register({required: true})}
                                                invalid={errors.seller_income_source && true}
                                            />
                                    </Col>
                                    <Label sm='3' for='seller_income_source'><strong> تسلسل مصدر الدخل</strong></Label>
                                </FormGroup>
                                <FormGroup row>
                                    <Label sm='3' for='company_id'><strong>Company Id</strong></Label>
                                    <Col sm='6'>
                                            <Input
                                                name='company_id'
                                                type='text'
                                                value={setting?.company_id}
                                                defaultValue={'13461320'}
                                                innerRef={register({required: true})}
                                                invalid={errors.company_id && true}
                                            />
                                    </Col>
                                    <Label sm='3' for='company_id'><strong>الرقم الضريبي</strong></Label>
                                </FormGroup>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}