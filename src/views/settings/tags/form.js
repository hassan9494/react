import FormBuilder from '@components/form'
import {
    Card,
    CardBody
} from 'reactstrap'

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
                            label: 'Script',
                            name: 'script',
                            type: 'textarea',
                            rules: { required: true }
                        },
                        {
                            label: 'Type',
                            type: 'react-select',
                            name: 'type',
                            list: [
                                {label: 'Head', value: 'HEAD'},
                                {label: 'Body', value: 'BODY'}
                            ],
                            rules: { required: true }
                        }
                    ]}
                    initialValues={model}
                    onSubmit={onSubmit}
                />
            </CardBody>
        </Card>
    )
}
