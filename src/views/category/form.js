import {
    Card,
    CardBody
} from 'reactstrap'
import FormBuilder from '@components/form'
import { useCategories } from '@data/use-category'

const Form = ({ onSubmit, model, formErrors }) => {

    const { data: categories } = useCategories()
    const categoriesSelect = categories.map(
        e => ({
            value: e.id,
            label: e.title
        })
    )

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
                            rules: { required: true }
                        },
                        {
                            label: 'Title',
                            name: 'title',
                            rules: { required: true }
                        },
                        {
                            label: 'Slug',
                            name: 'slug',
                            rules: { required: true }
                        },
                        {
                            label: 'Icon',
                            name: 'icon'
                        },
                        {
                            label: 'Available',
                            type: 'checkbox',
                            name: 'available',
                            isClearable: true,
                            rules: { required: false }
                        },
                        {
                            label: 'Image',
                            name: 'media',
                            type: 'uploader',
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

export default Form
