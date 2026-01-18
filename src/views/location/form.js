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
                            label: 'Name',
                            name: 'name',
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
