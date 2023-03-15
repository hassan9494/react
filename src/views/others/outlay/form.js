import FormBuilder from '@components/form'
import {
    Card,
    CardBody
} from 'reactstrap'
import moment from 'moment'

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
                            label: 'Type',
                            name: 'type',
                            type: 'react-select',
                            list: types,
                            rules: { required: true }
                        },
                        {
                            label: 'Name',
                            name: 'name',
                            rules: { required: true }
                        },
                        {
                            label: 'Amount',
                            name: 'amount',
                            type: 'number',
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
                            label: 'Invoice',
                            name: 'invoice'
                        },
                        {
                            label: 'Notes',
                            name: 'notes'
                        }
                    ]}
                    initialValues={model}
                    onSubmit={onSubmit}
                />
            </CardBody>
        </Card>
    )
}
