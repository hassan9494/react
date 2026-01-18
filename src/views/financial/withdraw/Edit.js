import { Fragment, useState, useEffect } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import { useHistory, useParams } from 'react-router-dom'
import Form from './Form'
import { toast } from 'react-toastify'
import { useModel, api as transactionApi  } from '@data/use-transaction'
import { api as paymentMethodApi } from '@data/use-payment-method'
import {
    Card,
    CardBody,
    Spinner,
    Alert
} from 'reactstrap'

const Edit = () => {
    const history = useHistory()
    const { id } = useParams()

    const { data: model, update: updateModel } = useModel(id)
    const [loading, setLoading] = useState(true)
    const [paymentMethods, setPaymentMethods] = useState([])
    const [formErrors, setFormErrors] = useState(null)

    // Fetch payment methods
    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                const paymentMethodsResponse = await paymentMethodApi.index()
                setPaymentMethods(paymentMethodsResponse || [])
            } catch (error) {
                console.error('Failed to fetch payment methods:', error)
                toast.error('Failed to load payment methods')
            }
        }

        fetchPaymentMethods()
    }, [])

    // Set loading to false when model is loaded
    useEffect(() => {
        if (model) {
            setLoading(false)

            // Check if transaction is a withdraw
            if (model.type !== 'withdraw') {
                toast.error('This is not a withdraw transaction')
                history.push('/withdraw/list')
            }
        }
    }, [model, history])

    const onSubmit = async data => {
        try {
            // Prepare data for update
            const updateData = {
                payment_method_id: parseInt(data.payment_method_id),
                amount: parseFloat(data.amount),
                type: 'withdraw'
            }

            // Include date if it was changed
            if (data.created_at) {
                updateData.created_at = data.created_at
            }

            console.log('Updating withdraw with data:', updateData)

            // Use the update function from useModel hook
            await updateModel(updateData)
            toast.success('Withdraw updated successfully!')
            history.push('/withdraw/list')
        } catch (e) {
            console.error('Update error:', e)
            setFormErrors(e.response?.data?.errors || { message: 'Failed to update withdraw' })
            toast.error(e.response?.data?.message || 'Failed to update withdraw')
        }
    }

    if (loading) {
        return (
            <Fragment>
                <Breadcrumbs breadCrumbTitle='Financial' breadCrumbActive='Edit Withdraw' />
                <Card>
                    <CardBody className="text-center">
                        <Spinner color="primary" />
                        <p className="mt-2">Loading withdraw data...</p>
                    </CardBody>
                </Card>
            </Fragment>
        )
    }

    if (!model) {
        return (
            <Fragment>
                <Breadcrumbs breadCrumbTitle='Financial' breadCrumbActive='Edit Withdraw' />
                <Card>
                    <CardBody>
                        <Alert color="danger">
                            Withdraw not found
                        </Alert>
                    </CardBody>
                </Card>
            </Fragment>
        )
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Financial' breadCrumbActive='Edit Withdraw' />
            <Form
                model={model}
                onSubmit={onSubmit}
                formErrors={formErrors}
                paymentMethods={paymentMethods}
            />
        </Fragment>
    )
}

export default Edit