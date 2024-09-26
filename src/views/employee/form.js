import {
    Card,
    CardBody
} from 'reactstrap'
import FormBuilder from '@components/form'
import { useEmployeeModels } from '@data/use-role'
import Checkbox from "../../@core/components/form/fields/Checkbox"

const Form = ({ onSubmit, model, formErrors }) => {

    const { data: roles } = useEmployeeModels()
    const rolesSelect = roles.map(
        e => ({
            value: e.name,
            label: e.name
        })
    )

    const statuses = [
        {
            value: 0, label: 'InActive'
        },
        {
            value: 1, label: 'Active'
        }
    ]

    return (
        <Card>
            <CardBody>
                <FormBuilder
                    fields={[
                        {
                            label: 'Name',
                            name: 'name',
                            type: 'text',
                            placeholder: 'Name',
                            rules: { required: true }
                        },
                        {
                            label: 'Email',
                            name: 'email',
                            type: 'text',
                            placeholder: 'Email',
                            rules: { required: true }
                        },
                        {
                            label: 'Phone',
                            name: 'phone',
                            type: 'text',
                            placeholder: 'Phone',
                            rules: { required: true }
                        },
                        {
                            label: 'Roles',
                            type: 'react-select-multi',
                            name: 'roles',
                            list: rolesSelect,
                            isClearable: true,
                            rules: { required: true }
                        },
                        {
                            label: 'Password',
                            name: 'password',
                            type: 'password',
                            placeholder: 'Password',
                            rules: { required: true }
                        },
                        {
                            label: 'Confirm Password',
                            name: 'password_confirmation',
                            type: 'password',
                            placeholder: 'Confirm Password',
                            rules: { required: true }
                        },
                        {
                            label: 'Status',
                            name: 'status',
                            type: 'react-select',
                            list: statuses
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
