import FormBuilder from '@components/form'
import {
    Card,
    CardBody
} from 'reactstrap'
import moment from 'moment'
import {toast} from "react-toastify"
import {useEffect, useState} from "react"
import { api as PaymentMethodApi } from '@data/use-payment-method'

export default function ({ onSubmit, model, formErrors, setFormErrors }) {

    const [paymentMethods, setPaymentMethods] = useState([])

    const handleSubmit = (data) => {
        console.log(data.check_number)
        // Add validation for check_number when payment method is Check
        const selectedPaymentMethod = paymentMethods.find(pm => pm.id === data.type)
        if (selectedPaymentMethod?.name === 'Check' && !data.check_number) {
            const errors = {
                ...formErrors,
                check_number: ['Check number is required when payment type is Check']
            }
            toast.error('Check number is required when payment type is Check')
            throw { response: { data: { errors } } }
        }

        // Proceed with original onSubmit if validation passes
        onSubmit(data)
    }

    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                const response = await PaymentMethodApi.index()
                setPaymentMethods(response || [])
            } catch (error) {
                console.error('Failed to fetch payment methods:', error)
                toast.error('Failed to load payment methods')
            }
        }
        fetchPaymentMethods()
    }, [])

    // Transform payment methods to the format needed for react-select
    const paymentMethodOptions = paymentMethods.map(method => ({
        label: method.name,
        value: method.id
    }))
    return (
        <Card>
            <CardBody>
                <FormBuilder
                    fields={[
                        {
                            label: 'Name',
                            name: 'name',
                            rules: { required: true }
                        },
                        {
                            label: 'Amount',
                            name: 'amount',
                            type: 'number',
                            step: 0.001,
                            rules: { required: true },
                            defaultValue: 0
                        },
                        {
                            label: 'Date',
                            name: 'date',
                            type: 'date',
                            rules: { required: true },
                            defaultValue: moment().format('Y-MM-DD')
                        },
                        {
                            label: 'Explanation',
                            name: 'explanation'
                        },
                        {
                            label: 'Notes',
                            name: 'notes',
                            type: 'textarea'
                        },
                        {
                            label: 'Type',
                            name: 'payment_method_id',
                            type: 'react-select',
                            list: paymentMethodOptions,
                            rules: { required: true },
                            isClearable: false,
                            defaultValue: paymentMethodOptions[0] // Default to first payment method
                        },
                        {
                            label: 'Check Number',
                            name: 'check_number',
                            type: 'text'
                        }
                    ]}
                    initialValues={model}
                    onSubmit={handleSubmit}
                    formErrors={formErrors}
                />
            </CardBody>
        </Card>
    )
}