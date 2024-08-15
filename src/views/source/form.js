import {
    Card,
    CardBody
} from 'reactstrap'
import FormBuilder from '@components/form'
import {useBrand} from '@data/use-brand'

const Form = ({onSubmit, model, formErrors}) => {


    return (
        <Card>
            <CardBody>
                <FormBuilder
                    fields={[
                        {
                            label: 'Order',
                            name: 'order',
                            type: 'number',
                            defaultValue: 1,
                            rules: {required: true}
                        },
                        {
                            label: 'Name',
                            name: 'name',
                            rules: {required: true}
                        },
                        {
                            label: 'Slug',
                            name: 'slug',
                            rules: {required: true}
                        }
                    ]}
                    initialValues={model}
                    onSubmit={onSubmit}
                />
            </CardBody>
        </Card>
    )
}

export default Form
