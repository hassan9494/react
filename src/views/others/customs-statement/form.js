import FormBuilder from '@components/form'
import {
    Card,
    CardBody
} from 'reactstrap'
import moment from 'moment'
import { useState } from 'react'// Import useState from React


export default function ({ onSubmit, model }) {
     // State to track the selected type

    return (
        <Card>
            <CardBody>
                <FormBuilder
                    fields={[
                        {
                            label: 'Customs statement number',
                            name: 'name',
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
                            label: 'Amount',
                            name: 'amount',
                            type: 'number',
                            rules: { required: true }
                        },
                        {
                            label: 'Tax',
                            name: 'invoice'
                        },
                        {
                            label: '2% income',
                            name: 'invoice_2_percent'
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
