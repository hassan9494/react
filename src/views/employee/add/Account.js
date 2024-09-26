import FormBuilder from '@components/form'
import { api } from '@data/use-user'
import { useModels as useRoles } from '@data/use-role'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const statuses = [
    {
        value: 0, label: 'InActive'
    },
    {
        value: 1, label: 'Active'
    }
]

const UserAccountTab = ({user}) => {

    const [model, setModel] = useState()
    const { data: roles } = useRoles()

    const rolesList = roles?.map(e => (
        {
            value: e.name,
            label: e.name
        }
    ))

    useEffect(() => {
        setModel({...user, roles: user?.roles.map(e => e.name)})
    }, [user])

    const onSubmit = async data => {
        try {
            await api.create(data)
            toast.success('Operation completed successfully!')
        } catch (e) {
            toast.error(e?.response?.data?.message)
        }
    }

    return (
        <FormBuilder
            fields={[
                {
                    label: 'Name',
                    name: 'name',
                    rules: { required: true }
                },
                {
                    label: 'Email',
                    name: 'email',
                    rules: { required: true }
                },
                {
                    label: 'Phone',
                    name: 'phone',
                    rules: { required: true }
                },
                {
                    label: 'Roles',
                    name: 'roles',
                    type: 'react-select-multi',
                    list: rolesList,
                    rules: { required: true }
                },
                {
                    label: 'Status',
                    name: 'status',
                    type: 'react-select',
                    list: statuses
                },
                {
                    label: 'Verified Email Address',
                    name: 'email_verified_at',
                    type: 'checkbox',
                    disabled: true,
                    wrapper: {
                        class: 'd-flex my-2 justify-content-end'
                    }
                }
            ]}
            initialValues={model}
            onSubmit={onSubmit}
        />
    )
}
export default UserAccountTab
