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
                            label: 'Type',
                            type: 'react-select',
                            name: 'type',
                            list: [
                                {label: 'Service', value: 'SERVICE'},
                                {label: 'Course', value: 'COURSE'},
                                {label: 'Tutorial', value: 'TUTORIAL'}
                            ],
                            rules: { required: true }
                        },
                        {
                            label: 'Title',
                            name: 'title',
                            rules: { required: true }
                        },
                        {
                            label: 'Order',
                            name: 'order',
                            defaultValue: 1,
                            type: 'number',
                            rules: { required: true }
                        },
                        {
                            label: 'Video',
                            name: 'video_url',
                            placeholder: 'Video URL'
                        },
                        {
                            label: 'Content',
                            name: 'content',
                            type: 'cke'
                        }
                    ]}
                    initialValues={model}
                    onSubmit={onSubmit}
                />
            </CardBody>
        </Card>
    )
}
