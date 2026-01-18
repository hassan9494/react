import { Fragment, useState, useEffect } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import { useTaxExempt } from '@data/use-tax-exempt'
import { useHistory, useParams } from 'react-router-dom'
import Form from './form'
import { useForm } from "react-hook-form"

const Edit = () => {
    const history = useHistory()
    const { id } = useParams()
    const { data: model, update } = useTaxExempt(id)
    const [formErrors, setFormErrors] = useState(null)
    const [isFormInitialized, setIsFormInitialized] = useState(false)

    const form = useForm({
        defaultValues: {
            identity_number_type: 'NIN',
            tax_exempt: false,
            tax_zero: false,
            user_id: null,
            name: '',
            email: '',
            phone: '',
            identity_number: '',
            exemption_expiration_date: '',
            media: [] // Initialize as empty array for media
        }
    })

    useEffect(() => {
        if (model && !isFormInitialized) {
            // Format the date to YYYY-MM-DD
            const formattedDate = model.exemption_expiration_date ? model.exemption_expiration_date.split(' ')[0] : ''

            // Prepare media array if image exists
            const media = model.media ? model.media  : []

            form.reset({
                ...model,
                identity_number_type: model.identity_number_type || 'NIN',
                exemption_expiration_date: formattedDate,
                tax_exempt: Boolean(model.tax_exempt),
                tax_zero: Boolean(model.tax_zero),
                media
            })
            setIsFormInitialized(true)
        }
    }, [model, form, isFormInitialized])

    const onSubmit = async data => {
        try {
            // The media field will contain the uploaded file information
            // from Uppy, which should be in the format your backend expects
            await update(data)
            history.push('/tax_exempt/list')
        } catch (e) {
            setFormErrors(e.response?.data?.errors)
        }
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Tax Exempt' breadCrumbActive='Edit Tax Exempt'/>
            <Form model={model} onSubmit={onSubmit} form={form} formErrors={formErrors} isEditMode={true} />
        </Fragment>
    )
}

export default Edit