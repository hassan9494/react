import {
    Button,
    Card,
    CardBody, Col, CustomInput, Form, FormGroup, Input, Label, Row
} from 'reactstrap'
import { useEffect, useState, useCallback } from "react"
import { Controller } from "react-hook-form"
import AsyncSelect from "react-select/async/dist/react-select.esm"
import Select from "react-select"
import { api } from '@data/use-user'
import { Save } from "react-feather"
import CustomUploader from '@components/form/fields/CustomUploader' // Import your Uppy CustomUploader component

const TaxExemptForm = ({ onSubmit, form, model, isEditMode = false }) => {
    const [user, setUser] = useState(null)
    const [isInitialLoad, setIsInitialLoad] = useState(true)

    // Memoized callback for user change
    const onUserChange = useCallback((value) => {
        setUser(value?.item || null)
        if (value?.item) {
            form.setValue('name', value.item.name)
            form.setValue('email', value.item.email)
            form.setValue('phone', value.item.phone)
            form.setValue('user_id', value.item.id)
        } else {
            form.setValue('name', '')
            form.setValue('email', '')
            form.setValue('phone', '')
            form.setValue('user_id', null)
        }
    }, [form])

    // Render user item for select
    const renderItem = useCallback((item) => (
        <div className="d-flex justify-content-left align-items-center">
            <div className="d-flex flex-column">
                <h6 className="user-name text-truncate mb-0">{item?.name}</h6>
                <small className="text-truncate text-muted mb-0">{item?.email}</small>
            </div>
        </div>
    ), [])

    // Fetch user options
    const promiseOptions = useCallback(async (inputValue) => {
        const data = await api.autocompleteUserForTaxExempt(inputValue)
        return data.map(({ id, name, email, phone }) => ({
            label: renderItem({ id, name, email, phone }),
            value: id,
            item: { id, name, email, phone }
        }))
    }, [renderItem])

    const identity_number_typeOptions = [
        { label: 'الرقم الوطني', value: 'NIN' },
        { label: 'الرقم الشخصي لغير الأردني', value: 'PN' },
        { label: 'الرقم الضريبي للمشتري', value: 'TN' }
    ]

    const handleChangeType = useCallback((status) => {
        form.setValue('identity_number_type', status?.value || 'NIN')
    }, [form])

    // Watch tax_exempt value
    const tax_exempt = form.watch('tax_exempt')

    // Handle tax exempt changes
    useEffect(() => {
        if (!isInitialLoad && !tax_exempt) {
            form.setValue('tax_zero', false)
        }
    }, [tax_exempt, form, isInitialLoad])

    // Initialize user data for edit mode
    useEffect(() => {
        if (isEditMode && model?.user && isInitialLoad) {
            setUser(model.user)
            onUserChange({ item: model.user })
            setIsInitialLoad(false)
        }
    }, [model, isEditMode, isInitialLoad, onUserChange])

    return (
        <Form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
                <CardBody>
                    <Row>
                        <Col sm='12'>
                            <FormGroup>
                                <Controller
                                    control={form.control}
                                    name="user_id"
                                    render={({ onChange }) => (
                                        <AsyncSelect
                                            isClearable
                                            className='react-select'
                                            classNamePrefix='select'
                                            defaultOptions
                                            value={user ? {
                                                value: user.id,
                                                label: renderItem(user),
                                                item: user
                                            } : null}
                                            loadOptions={promiseOptions}
                                            cacheOptions
                                            onChange={(value, extra) => {
                                                onChange(value?.item?.id || null)
                                                onUserChange(value)
                                            }}
                                        />
                                    )}
                                />
                            </FormGroup>
                        </Col>

                        <Col sm='4'>
                            <FormGroup>
                                <Label for='customerName'>Name</Label>
                                <Input
                                    type='text'
                                    id='customerName'
                                    name="name"
                                    innerRef={form.register({ required: true })}
                                    invalid={form.errors.name && true}
                                />
                            </FormGroup>
                        </Col>

                        <Col sm='4'>
                            <FormGroup>
                                <Label for='customerPhone'>Phone</Label>
                                <Input
                                    type='text'
                                    id='customerPhone'
                                    name="phone"
                                    innerRef={form.register({ required: true })}
                                    invalid={form.errors.phone && true}
                                />
                            </FormGroup>
                        </Col>

                        <Col sm='4'>
                            <FormGroup>
                                <Label for='customerEmail'>Email</Label>
                                <Input
                                    type='text'
                                    id='customerEmail'
                                    name="email"
                                    innerRef={form.register({ required: false })}
                                    invalid={form.errors.email && true}
                                />
                            </FormGroup>
                        </Col>

                        <Col sm='4'>
                            <FormGroup>
                                <Label for='identity_number_type'>Identity Number Type</Label>
                                <Controller
                                    control={form.control}
                                    name="identity_number_type"
                                    defaultValue="NIN"
                                    render={({ onChange, value }) => (
                                        <Select
                                            className='react-select'
                                            classNamePrefix='select'
                                            value={identity_number_typeOptions.find(opt => opt.value === (value || 'NIN'))}
                                            options={identity_number_typeOptions}
                                            onChange={val => {
                                                onChange(val?.value || 'NIN')
                                                handleChangeType(val)
                                            }}
                                        />
                                    )}
                                />
                            </FormGroup>
                        </Col>

                        <Col sm='4'>
                            <FormGroup>
                                <Label for='identity_number'>Customer Identity Number</Label>
                                <Input
                                    type='text'
                                    id='identity_number'
                                    name="identity_number"
                                    innerRef={form.register({ required: false })}
                                    invalid={form.errors.identity_number && true}
                                />
                            </FormGroup>
                        </Col>

                        <Col sm='4'>
                            <div className='d-flex justify-content-between mt-1'>
                                <CustomInput
                                    id='order-tax-exempt'
                                    type='switch'
                                    name='tax_exempt'
                                    innerRef={form.register({
                                        onChange: () => setIsInitialLoad(false)
                                    })}
                                />
                                <Label className='mb-0 font-medium-1' for='order-tax-exempt'>
                                    <strong>معفي من الضريبة</strong>
                                </Label>
                            </div>
                            <div className='d-flex justify-content-between mt-1'>
                                <CustomInput
                                    disabled={!tax_exempt}
                                    id='order-tax-zero'
                                    type='switch'
                                    name='tax_zero'
                                    innerRef={form.register()}
                                />
                                <Label className='mb-0 font-medium-1' for='order-tax-zero'>
                                    <strong>معفي بنسبة الصفر</strong>
                                </Label>
                            </div>
                        </Col>

                        <Col sm='4'>
                            <FormGroup>
                                <Label for='exemption_expiration_date'>Exemption Expiration Date</Label>
                                <Input
                                    type='date'
                                    id='exemption_expiration_date'
                                    name="exemption_expiration_date"
                                    innerRef={form.register({ required: true })}
                                    invalid={form.errors.exemption_expiration_date && true}
                                />
                            </FormGroup>
                        </Col>

                        {/* Image Upload Field using Uppy */}
                        <Col sm='12'>
                            <FormGroup>
                                <Label for='media'>Image Upload</Label>
                                <CustomUploader
                                    form={form}
                                    name="media"
                                    label=""
                                    rules={{ required: false }}
                                    maxNumberOfFiles={1}
                                />
                                {form.errors.media && (
                                    <div className="text-danger small mt-1">
                                        {form.errors.media.message}
                                    </div>
                                )}
                            </FormGroup>
                        </Col>

                    </Row>
                    <Row>
                        <Col sm='4'></Col>
                        <Col sm='4'></Col>
                        <Col sm='4'>
                            <Button.Ripple color='secondary' type='submit'>
                                <Save size={14} />
                                <span className='align-middle ml-25'>Save Changes</span>
                            </Button.Ripple>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Form>
    )
}

export default TaxExemptForm