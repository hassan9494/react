import FormBuilder from '@components/form'
import {
    Card,
    CardBody
} from 'reactstrap'

export default function ({ onSubmit, model }) {

    // 'name' => 'required|max:255',
    //     'code' => 'required',
    //     'is_percentage' => 'required|boolean',
    //     'value' => 'required|numeric',
    //     'start_at' => 'required',
    //     'end_at' => 'required',
    //     'count' => 'required|numeric',
    //     'active' => 'required|boolean',

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
                            label: 'Code',
                            name: 'code',
                            defaultValue: Math.random().toString(36).toUpperCase().replace(/[0-9O]/g, '').substring(1, 10),
                            rules: { required: true }
                        },
                        {
                            label: 'Amount',
                            name: 'amount',
                            defaultValue: 0,
                            type: 'number',
                            step: '0.1',
                            rules: { required: true }
                        },
                        {
                            label: 'Is Percentage',
                            name: 'is_percentage',
                            type: 'checkbox',
                            wrapper: {
                                class: 'd-flex my-2 justify-content-end'
                            }
                        },
                        {
                            label: 'Start Date',
                            name: 'start_at',
                            type: 'date'
                        },
                        {
                            label: 'End Date',
                            name: 'end_at',
                            type: 'date'
                        },
                        {
                            label: 'Count',
                            name: 'count',
                            type: 'number',
                            defaultValue: 1
                        },
                        {
                            label: 'Active',
                            name: 'active',
                            type: 'checkbox',
                            wrapper: {
                                class: 'd-flex my-2 justify-content-end'
                            }
                        }
                    ]}
                    initialValues={model}
                    onSubmit={onSubmit}
                />
            </CardBody>
        </Card>
    )
}
