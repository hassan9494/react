import FormBuilder from '@components/form'
import {
    Card,
    CardBody
} from 'reactstrap'

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

export default function ({ onSubmit, model }) {

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
                            label: 'Cost',
                            name: 'cost',
                            type: 'number',
                            rules: { required: true }
                        },
                        {
                            label: 'Deadline',
                            name: 'deadline',
                            type: 'date'
                        },
                        {
                            label: 'Description',
                            name: 'description',
                            type: 'textarea'
                        },

                        {
                            label: 'Students',
                            name: 'students',
                            type: 'textarea'
                        },
                        {
                            label: 'Notes',
                            name: 'notes',
                            type: 'textarea'
                        },
                        {
                            label: 'Completed',
                            name: 'completed',
                            type: 'checkbox'
                        }
                    ]}
                    initialValues={model}
                    onSubmit={onSubmit}
                />
            </CardBody>
        </Card>
    )
}
