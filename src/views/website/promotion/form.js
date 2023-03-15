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
                            label: 'Image',
                            name: 'media',
                            type: 'uploader',
                            rules: { required: true }
                        },
                        {
                            label: 'Order',
                            name: 'order',
                            type: 'number',
                            rules: { required: true }
                        },
                        {
                            label: 'Name',
                            name: 'name',
                            rules: { required: true }
                        },
                        {
                            label: 'Link',
                            name: 'link',
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
