import FormBuilder from '@components/form'
import {
    Card,
    CardBody
} from 'reactstrap'
import moment from 'moment'

const types = [
    {
        label: 'Cash',
        value: 'CASH'
    },
    {
        label: 'Check',
        value: 'CHECK'
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
                            label: 'Amount',
                            name: 'amount',
                            type: 'number',
                            step: 0.01,
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
                            name: 'type',
                            type: 'react-select',
                            list: types,
                            rules: { required: true },
                            isClearable: false,
                            defaultValue: types[0]
                        },
                        {
                            label: 'Check Number',
                            name: 'check_number',
                            type: 'text'
                        }
                    ]}
                    initialValues={model}
                    onSubmit={onSubmit}
                />
            </CardBody>
        </Card>
    )
}
