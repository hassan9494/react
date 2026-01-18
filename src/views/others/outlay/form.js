import FormBuilder from '@components/form'
import {
    Card,
    CardBody
} from 'reactstrap'
import moment from 'moment'
import { useState } from 'react'// Import useState from React


const types = [
    {
        label: 'Purchase',
        value: 'PURCHASE'
    },
    {
        label: 'Outlay',
        value: 'OUTLAY'
    }
]

const Purchase_types = [
    {
        label: 'Tax',
        value: 'TAX'
    },
    {
        label: 'Non Tax',
        value: 'NON TAX'
    }
]
const Outlay_types = [
    {
        label: 'Administrative',
        value: 'ADMINISTRATIVE'
    },
    {
        label: 'General',
        value: 'GENERAL'
    },
    {
        label: 'Other',
        value: 'OTHER'
    }
]

export default function ({ onSubmit, model }) {
    const getOutlayType = () => {
        return model?.type
    }
    const [selectedType, setSelectedType] = useState(getOutlayType)

     // State to track the selected type

    const handleTypeChange = (obj) => {
        setSelectedType(obj)
    }

    return (
        <Card>
            <CardBody>
                <FormBuilder
                    fields={[
                        {
                            label: 'Type',
                            name: 'type',
                            type: 'react-select',
                            list: types,
                            rules: { required: true },
                            isClearable: true,
                            onSelectChange: handleTypeChange
                    },
                        {
                            label: selectedType === 'PURCHASE' || model?.type ===  'PURCHASE' ? 'Purchase Type' : 'Outlay Type',
                            name: 'sub_type',
                            type: 'react-select',
                            list: selectedType === 'PURCHASE' || model?.type ===  'PURCHASE'  ? Purchase_types : Outlay_types,
                            rules: { required: false },
                            isClearable: true
                        },
                        {
                            label: 'Name',
                            name: 'name',
                            rules: { required: true }
                        },
                        {
                            label: 'Tax Number',
                            name: 'tax_number',
                            type: 'number',
                            rules: { required: false }
                        },
                        {
                            label: 'Amount',
                            name: 'amount',
                            type: 'number',
                            step: 0.001,
                            rules: { required: true }
                        },
                        {
                            label: 'Tax',
                            name: 'tax',
                            rules: { required: false }
                        },
                        {
                            label: 'Total Amount',
                            name: 'total_amount',
                            type: 'number',
                            step: 0.001,
                            rules: { required: true }
                        },
                        {
                            label: 'Date',
                            name: 'date',
                            type: 'date',
                            rules: { required: true },
                            defaultValue: moment().format('Y-MM-DD')
                        },
                        {
                            label: 'Invoice No',
                            name: 'invoice'
                        },
                        {
                            label: 'Notes',
                            name: 'notes'
                        },
                        {
                            label: 'Media',
                            name: 'media',
                            type: 'uploader',
                            rules: { required: false }
                        }
                    ]}
                    initialValues={model}
                    onSubmit={onSubmit}
                />
            </CardBody>
        </Card>
    )
}
