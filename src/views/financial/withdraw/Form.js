import { useState, useEffect } from 'react'
import {
    Card,
    CardBody,
    FormGroup,
    Label,
    Input,
    Button,
    Row,
    Col
} from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import moment from 'moment'

export default function WithdrawForm({ onSubmit, model, formErrors, paymentMethods }) {
    const [formData, setFormData] = useState({
        amount: '',
        created_at: '',
        payment_method_id: null
    })
    const [loading, setLoading] = useState(false)

    // Convert payment methods to options for react-select
    const paymentMethodOptions = paymentMethods.map(method => ({
        value: method.id,
        label: method.name
    }))

    // Initialize form data when model is available
    useEffect(() => {
        if (model) {
            const currentPaymentMethod = paymentMethods.find(m => m.id === model.payment_method_id)

            setFormData({
                amount: model.amount.toString(),
                created_at: moment(model.created_at).format('YYYY-MM-DDTHH:mm'),
                payment_method_id: currentPaymentMethod ? {
                    value: currentPaymentMethod.id,
                    label: currentPaymentMethod.name
                } : null
            })
        }
    }, [model, paymentMethods])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSelectChange = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            payment_method_id: selectedOption
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {

            let formattedDate = formData.created_at

            // If the date is in datetime-local format, convert it
            if (formData.created_at && formData.created_at.includes('T')) {
                formattedDate = moment(formData.created_at).format('YYYY-MM-DD HH:mm:ss')
            }
            // Prepare data for submission
            const submitData = {
                amount: formData.amount,
                created_at: formData.created_at,
                payment_method_id: formData.payment_method_id ? formData.payment_method_id.value.toString() : '',
                type: 'withdraw'
            }

            console.log('Submitting data:', submitData)
            await onSubmit(submitData)
        } catch (error) {
            console.error('Form submission error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardBody>
                <form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="amount">Amount *</Label>
                                <Input
                                    type="number"
                                    id="amount"
                                    name="amount"
                                    step="0.001"
                                    min="0.001"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    required
                                />
                                {formErrors?.amount && (
                                    <div className="text-danger mt-1">{formErrors.amount}</div>
                                )}
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="created_at">Date & Time *</Label>
                                <Input
                                    type="datetime-local"
                                    id="created_at"
                                    name="created_at"
                                    value={formData.created_at}
                                    onChange={handleInputChange}
                                    required
                                />
                                {formErrors?.created_at && (
                                    <div className="text-danger mt-1">{formErrors.created_at}</div>
                                )}
                            </FormGroup>
                        </Col>
                    </Row>

                    <FormGroup>
                        <Label for="payment_method_id">Payment Method *</Label>
                        <Select
                            theme={selectThemeColors}
                            className="react-select"
                            classNamePrefix="select"
                            options={paymentMethodOptions}
                            value={formData.payment_method_id}
                            onChange={handleSelectChange}
                            isClearable={false}
                            isSearchable
                            placeholder="Select Payment Method"
                        />
                        {formErrors?.payment_method_id && (
                            <div className="text-danger mt-1">{formErrors.payment_method_id}</div>
                        )}
                    </FormGroup>

                    <div className="mt-3">
                        <Button
                            color="primary"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Withdraw'}
                        </Button>
                    </div>
                </form>

                {/* Display current transaction info */}
                {model && (
                    <div className="mt-4 p-3 bg-light rounded">
                        <h6 className="mb-3">Transaction Information</h6>
                        <div className="row">
                            <div className="col-md-4">
                                <small className="text-muted">Transaction ID</small>
                                <p className="mb-1"><strong>{model.transaction_id || 'N/A'}</strong></p>
                            </div>
                            <div className="col-md-4">
                                <small className="text-muted">Type</small>
                                <p className="mb-1">
                                    <span className={`badge badge-${model.type === 'deposit' ? 'success' : 'danger'}`}>
                                        {model.type}
                                    </span>
                                </p>
                            </div>
                            <div className="col-md-4">
                                <small className="text-muted">Current Total Amount</small>
                                <p className="mb-1"><strong>${parseFloat(model.total_amount || 0).toFixed(2)}</strong></p>
                            </div>
                        </div>
                    </div>
                )}
            </CardBody>
        </Card>
    )
}