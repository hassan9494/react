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
                            label: 'Location',
                            name: 'location',
                            rules: { required: true }
                        },
                        {
                            label: 'Email',
                            name: 'email',
                            rules: { required: true }
                        },
                        {
                            label: 'Facebook',
                            name: 'facebook',
                            rules: { required: true }
                        },
                        {
                            label: 'Instagram',
                            name: 'instagram',
                            rules: { required: true }
                        },
                        {
                            label: 'Telegram',
                            name: 'telegram',
                            rules: { required: true }
                        },
                        {
                            label: 'Whatsapp',
                            name: 'whatsapp',
                            rules: { required: true }
                        },
                        {
                            label: 'Youtube',
                            name: 'youtube',
                            rules: { required: true }
                        },
                        {
                            label: 'Call',
                            name: 'call',
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
