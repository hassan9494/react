import FormBuilder from '@components/form'
import { Card, CardBody } from 'reactstrap'

const Form = ({ onSubmit, model }) => (
    <Card>
        <CardBody>
            <FormBuilder
                initialValues={model}
                onSubmit={onSubmit}
                fields={[
                    {
                        label: 'Name',
                        name: 'name',
                        rules: { required: true }
                    },
                    {
                        label: 'Phone',
                        name: 'phone'
                    },
                    {
                        label: 'Email',
                        name: 'email',
                        type: 'email'
                    },
                    {
                        label: 'Notes',
                        name: 'notes',
                        type: 'textarea'
                    }
                ]}
            />
        </CardBody>
    </Card>
)

export default Form
