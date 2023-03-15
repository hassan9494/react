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
                            step: 0.1,
                            rules: { required: true }
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
                            label: 'Description',
                            name: 'description',
                            type: 'textarea'
                        }
                    ]}
                    initialValues={model}
                    onSubmit={onSubmit}
                />
            </CardBody>
        </Card>
    )
}
