import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Form,
    Button,
    Row,
    Col,
    Input,
    Label,
    FormGroup,
    CustomInput
} from 'reactstrap'
import CouponProducts from './component/ProductsTable'
import CouponBrands from './component/BrandsTable'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'

export default function CouponForm({ onSubmit, model, formErrors }) {
    const form = useForm({
        defaultValues: {
            name: '',
            code: Math.random().toString(36).toUpperCase().replace(/[0-9O]/g, '').substring(1, 10),
            amount: 0,
            is_percentage: false,
            start_at: '',
            end_at: '',
            count: 1,
            active: true,
            products: [],
            brands: []
        }
    })

    // Reset form when model data is available (for edit mode)
    useEffect(() => {
        if (model) {
            // Format dates from ISO to YYYY-MM-DD
            const formattedModel = {
                ...model,
                start_at: model.start_at ? model.start_at.split('T')[0] : '',
                end_at: model.end_at ? model.end_at.split('T')[0] : '',
                products: model.products || [],
                brands: model.brands || []
            }
            form.reset(formattedModel)
        }
    }, [model]) // Remove form from dependencies

    const handleFormSubmit = (data) => {
        onSubmit(data)
    }

    return (
        <Card>
            <CardBody>
                <Form onSubmit={form.handleSubmit(handleFormSubmit)}>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="name">Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="Enter coupon name"
                                    invalid={formErrors?.name}
                                    innerRef={form.register({ required: true })}
                                    name="name"
                                />
                                {formErrors?.name && (
                                    <div className="text-danger small mt-1">
                                        {Array.isArray(formErrors.name) ? formErrors.name[0] : formErrors.name}
                                    </div>
                                )}
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="code">Code *</Label>
                                <Input
                                    id="code"
                                    placeholder="Enter coupon code"
                                    invalid={formErrors?.code}
                                    innerRef={form.register({ required: true })}
                                    name="code"
                                />
                                {formErrors?.code && (
                                    <div className="text-danger small mt-1">
                                        {Array.isArray(formErrors.code) ? formErrors.code[0] : formErrors.code}
                                    </div>
                                )}
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="start_at">Start Date *</Label>
                                <Input
                                    id="start_at"
                                    type="date"
                                    invalid={formErrors?.start_at}
                                    innerRef={form.register({ required: true })}
                                    name="start_at"
                                />
                                {formErrors?.start_at && (
                                    <div className="text-danger small mt-1">
                                        {Array.isArray(formErrors.start_at) ? formErrors.start_at[0] : formErrors.start_at}
                                    </div>
                                )}
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="end_at">End Date *</Label>
                                <Input
                                    id="end_at"
                                    type="date"
                                    invalid={formErrors?.end_at}
                                    innerRef={form.register({ required: true })}
                                    name="end_at"
                                />
                                {formErrors?.end_at && (
                                    <div className="text-danger small mt-1">
                                        {Array.isArray(formErrors.end_at) ? formErrors.end_at[0] : formErrors.end_at}
                                    </div>
                                )}
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="amount">Amount *</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    placeholder="Enter amount"
                                    invalid={formErrors?.amount}
                                    innerRef={form.register({ required: true })}
                                    name="amount"
                                />
                                {formErrors?.amount && (
                                    <div className="text-danger small mt-1">
                                        {Array.isArray(formErrors.amount) ? formErrors.amount[0] : formErrors.amount}
                                    </div>
                                )}
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="count">Usage Count</Label>
                                <Input
                                    id="count"
                                    type="number"
                                    min="1"
                                    placeholder="Enter usage count"
                                    invalid={formErrors?.count}
                                    innerRef={form.register()}
                                    name="count"
                                />
                                {formErrors?.count && (
                                    <div className="text-danger small mt-1">
                                        {Array.isArray(formErrors.count) ? formErrors.count[0] : formErrors.count}
                                    </div>
                                )}
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="count_per_user">Count Per User</Label>
                                <Input
                                    id="count_per_user"
                                    type="number"
                                    min="1"
                                    placeholder="Enter count per user"
                                    invalid={formErrors?.count_per_user}
                                    innerRef={form.register()}
                                    name="count_per_user"
                                />
                                {formErrors?.count_per_user && (
                                    <div className="text-danger small mt-1">
                                        {Array.isArray(formErrors.count_per_user) ? formErrors.count_per_user[0] : formErrors.count_per_user}
                                    </div>
                                )}
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={3}>
                            <FormGroup check className="d-flex justify-content-start">
                                <div className="d-flex align-items-center">
                                    <CustomInput
                                        type="switch"
                                        id="is_percentage"
                                        name="is_percentage"
                                        innerRef={form.register()}
                                        label="Is Percentage"
                                    />
                                </div>
                            </FormGroup>
                            {formErrors?.is_percentage && (
                                <div className="text-danger small mt-1">
                                    {Array.isArray(formErrors.is_percentage) ? formErrors.is_percentage[0] : formErrors.is_percentage}
                                </div>
                            )}
                        </Col>
                        <Col md={3}>
                            <FormGroup check className="d-flex justify-content-start">
                                <div className="d-flex align-items-center">
                                    <CustomInput
                                        type="switch"
                                        id="active"
                                        name="active"
                                        innerRef={form.register()}
                                        label="Active"
                                    />
                                </div>
                            </FormGroup>
                            {formErrors?.active && (
                                <div className="text-danger small mt-1">
                                    {Array.isArray(formErrors.active) ? formErrors.active[0] : formErrors.active}
                                </div>
                            )}
                        </Col>
                        <Col md={3}>
                            <FormGroup check className="d-flex justify-content-start">
                                <div className="d-flex align-items-center">
                                    <CustomInput
                                        type="switch"
                                        id="apply_count"
                                        name="apply_count"
                                        innerRef={form.register()}
                                        label="Apply Count"
                                    />
                                </div>
                            </FormGroup>
                            {formErrors?.apply_count && (
                                <div className="text-danger small mt-1">
                                    {Array.isArray(formErrors.apply_count) ? formErrors.apply_count[0] : formErrors.apply_count}
                                </div>
                            )}
                        </Col>
                        <Col md={3}>
                            <FormGroup check className="d-flex justify-content-start">
                                <div className="d-flex align-items-center">
                                    <CustomInput
                                        type="switch"
                                        id="apply_count_per_user"
                                        name="apply_count_per_user"
                                        innerRef={form.register()}
                                        label="Apply Count Per User"
                                    />
                                </div>
                            </FormGroup>
                            {formErrors?.apply_count_per_user && (
                                <div className="text-danger small mt-1">
                                    {Array.isArray(formErrors.apply_count_per_user) ? formErrors.apply_count_per_user[0] : formErrors.apply_count_per_user}
                                </div>
                            )}
                        </Col>
                    </Row>

                    {/* Brands section */}
                    <Card className='mt-3'>
                        <CardHeader>
                            <CardTitle tag='h4' className='mb-1'>Brands excluded from the discount</CardTitle>
                            <small className='text-muted'>
                                Select brands that this coupon will not apply to. Leave empty to apply to all products.
                            </small>
                        </CardHeader>
                        <CardBody>
                            <CouponBrands
                                form={form}
                                disabled={false}
                                isMigrated={false}
                            />
                        </CardBody>
                    </Card>

                    {/* Products section */}
                    <Card className='mt-3'>
                        <CardHeader>
                            <CardTitle tag='h4' className='mb-1'>Products excluded from the discount</CardTitle>
                            <small className='text-muted'>
                                Select products that this coupon will not apply to. Leave empty to apply to all products.
                            </small>
                        </CardHeader>
                        <CardBody>
                            <CouponProducts
                                form={form}
                                disabled={false}
                                isMigrated={false}
                            />
                        </CardBody>
                    </Card>

                    <div className="mt-3">
                        <Button type='submit' color='primary' className='me-2'>
                            Submit
                        </Button>
                    </div>
                </Form>
            </CardBody>
        </Card>
    )
}