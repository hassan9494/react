import {
    Card,
    CardBody,
    Button,
    Row,
    Col,
    Form,
    FormGroup,
    Label,
    Input
} from 'reactstrap'
import { useState, useEffect } from 'react'
import Select from 'react-select'

const types = [
    {
        label: 'Fixed',
        value: 'Fixed'
    },
    {
        label: 'Percent',
        value: 'Percent'
    },
    {
        label: 'Range',
        value: 'Range'
    }
]

export default function PaymentMethodForm({ onSubmit, model, formErrors }) {
    const [selectedType, setSelectedType] = useState(model?.commission_type || '')
    const [ranges, setRanges] = useState([])
    const [selectedTypeOption, setSelectedTypeOption] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        commission: '',
        commission_type: ''
    })

    // Initialize from model
    useEffect(() => {
        console.log('Model changed:', model)

        if (model) {
            // Set form data from model
            setFormData({
                name: model.name || '',
                commission: model.commission || '',
                commission_type: model.commission_type || ''
            })

            // Set selected type
            setSelectedType(model.commission_type || '')

            // Set react-select option
            const typeOption = model.commission_type ? types.find(t => t.value === model.commission_type) : null
            setSelectedTypeOption(typeOption)

            // Initialize ranges
            if (model.commission_type === 'Range' && model.commission_range) {
                try {
                    const parsedRanges = typeof model.commission_range === 'string' ? JSON.parse(model.commission_range) : model.commission_range
                    setRanges(Array.isArray(parsedRanges) ? parsedRanges : [])
                } catch (error) {
                    console.error('Error parsing commission_range:', error)
                    setRanges([])
                }
            } else {
                setRanges([])
            }
        } else {
            // For create form - reset everything
            setFormData({
                name: '',
                commission: '',
                commission_type: ''
            })
            setSelectedType('')
            setSelectedTypeOption(null)
            setRanges([])
        }
    }, [model])

    const handleTypeChange = (selectedOption) => {
        console.log('Type change triggered:', selectedOption)
        setSelectedTypeOption(selectedOption)
        const typeValue = selectedOption?.value || ''
        setSelectedType(typeValue)
        setFormData(prev => ({
            ...prev,
            commission_type: typeValue
        }))

        if (typeValue === 'Range') {
            setRanges([{ from: '', to: '', commission: '' }])
            // Clear commission when switching to Range
            setFormData(prev => ({
                ...prev,
                commission: ''
            }))
        } else {
            setRanges([])
        }
    }

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const addRange = () => {
        setRanges([...ranges, { from: '', to: '', commission: '' }])
    }

    const removeRange = (index) => {
        if (ranges.length > 1) {
            const newRanges = ranges.filter((_, i) => i !== index)
            setRanges(newRanges)
        }
    }

    const updateRange = (index, field, value) => {
        const newRanges = [...ranges]
        newRanges[index][field] = value
        setRanges(newRanges)
    }

    const handleFormSubmit = (e) => {
        e.preventDefault()

        // Basic validation
        if (!formData.name.trim()) {
            alert('Please enter a name')
            return
        }

        if (!selectedType) {
            alert('Please select a type')
            return
        }

        const submissionData = { ...formData }

        // Use the state value for commission_type
        submissionData.commission_type = selectedType

        if (selectedType === 'Range') {
            // Validate ranges
            const validRanges = ranges.filter(range => range.from !== '' && range.to !== '' && range.commission !== ''
            )

            if (validRanges.length === 0) {
                alert('Please add at least one valid range')
                return
            }

            submissionData.commission_range = JSON.stringify(validRanges)
            submissionData.commission = null // Clear the single commission field
        } else {
            submissionData.commission_range = null
            // For Fixed/Percent, ensure commission is set
            if (!submissionData.commission) {
                alert('Please enter a commission value')
                return
            }
        }

        console.log('Final submission data:', submissionData)
        onSubmit(submissionData)
    }

    return (
        <Card>
            <CardBody>
                <Form onSubmit={handleFormSubmit}>
                    {/* Type Field */}
                    <FormGroup>
                        <Label for="commission_type">Type *</Label>
                        <Select
                            id="commission_type"
                            name="commission_type"
                            className='react-select'
                            classNamePrefix='select'
                            options={types}
                            value={selectedTypeOption}
                            onChange={handleTypeChange}
                            isClearable={true}
                        />
                    </FormGroup>

                    {/* Name Field */}
                    <FormGroup>
                        <Label for="name">Name *</Label>
                        <Input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Enter payment method name"
                        />
                    </FormGroup>

                    {/* Commission Field (only for Fixed and Percent) */}
                    {selectedType !== 'Range' && selectedType !== '' && (
                        <FormGroup>
                            <Label for="commission">
                                {selectedType === 'Percent' ? 'Commission (%)' : 'Commission'} *
                            </Label>
                            <Input
                                id="commission"
                                type="number"
                                step="0.001"
                                value={formData.commission}
                                onChange={(e) => handleInputChange('commission', e.target.value)}
                                placeholder="0.00"
                            />
                        </FormGroup>
                    )}

                    {/* Range Component */}
                    {selectedType === 'Range' && (
                        <div className="mt-4 p-3 border rounded" style={{ background: '#f8f9fa' }}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">Commission Ranges</h5>
                                <Button color="primary" size="sm" onClick={addRange} type="button">
                                    + Add New Range
                                </Button>
                            </div>

                            {ranges.length === 0 ? (
                                <div className="text-center p-3">
                                    <p className="text-muted">No ranges added. Click "Add New Range" to start.</p>
                                </div>
                            ) : (
                                ranges.map((range, index) => (
                                    <Row key={index} className="mb-3 align-items-center">
                                        <Col md={3}>
                                            <Label className="form-label">From</Label>
                                            <Input
                                                type="number"
                                                value={range.from}
                                                onChange={(e) => updateRange(index, 'from', e.target.value)}
                                                placeholder="0"
                                                step="0.01"
                                                min="0"
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <Label className="form-label">To</Label>
                                            <Input
                                                type="number"
                                                value={range.to}
                                                onChange={(e) => updateRange(index, 'to', e.target.value)}
                                                placeholder="100"
                                                step="0.01"
                                                min="0"
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <Label className="form-label">Commission</Label>
                                            <Input
                                                type="number"
                                                value={range.commission}
                                                onChange={(e) => updateRange(index, 'commission', e.target.value)}
                                                placeholder="0.00"
                                                step="0.001"
                                                min="0"
                                            />
                                        </Col>
                                        <Col md={3} className="d-flex align-items-end">
                                            <Button
                                                color="danger"
                                                size="sm"
                                                onClick={() => removeRange(index)}
                                                disabled={ranges.length === 1}
                                                type="button"
                                            >
                                                Remove
                                            </Button>
                                        </Col>
                                    </Row>
                                ))
                            )}

                            {ranges.length > 0 && (
                                <div className="mt-3 p-2 border rounded" style={{ background: 'white' }}>
                                    <h6>Ranges Preview:</h6>
                                    {ranges.map((range, index) => (
                                        <div key={index} className="small">
                                            Range {index + 1}: From <strong>{range.from || '?'}</strong> to <strong>{range.to || '?'}</strong>
                                            → Commission: <strong>{range.commission || '?'}</strong>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Form Errors Display */}
                    {formErrors && (
                        <div className="mt-3 p-3 border rounded" style={{ background: '#f8d7da', borderColor: '#f5c6cb' }}>
                            <h6 className="text-danger">Form Errors:</h6>
                            <ul className="mb-0">
                                {Object.entries(formErrors).map(([field, errors]) => (
                                    <li key={field} className="text-danger">
                                        <strong>{field}:</strong> {Array.isArray(errors) ? errors.join(', ') : errors}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Debug info */}
                    <div style={{ marginTop: '10px', padding: '10px', background: '#f8f9fa', borderRadius: '5px' }}>
                        <small>
                            <strong>Debug Info:</strong><br />
                            Selected Type: {selectedType || 'None'}<br />
                            Ranges Count: {ranges.length}<br />
                            Model ID: {model?.id || 'New'}<br />
                            Form Data: {JSON.stringify(formData)}<br />
                            Form Errors: {formErrors ? JSON.stringify(formErrors) : 'None'}
                        </small>
                    </div>

                    {/* Submit Button */}
                    <Button color="primary" type="submit" className="mt-3">
                        {model ? 'Update' : 'Create'} Payment Method
                    </Button>
                </Form>
            </CardBody>
        </Card>
    )
}