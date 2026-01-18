import FormBuilder from '@components/form'
import { api } from '@data/use-user'
import { useEmployeeModels as useRoles } from '@data/use-role'
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
            await api.update(user.id, data)
            toast.success('Operation completed successfully!')
        } catch (e) {
            toast.error(e?.response?.data?.message)
        }
    }

    return (
        <div>
            <style>
                {`
                /* Ensure scrollbar for react-select dropdowns */
                .react-select__menu-list,
                .css-26l3qy-menu,
                .css-4ljt47-MenuList,
                .select__menu-list {
                    max-height: 200px !important;
                    overflow-y: auto !important;
                }
                `}
            </style>

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
                        rules: { required: true },
                        styles: {
                            menu: (provided) => ({
                                ...provided,
                                zIndex: 9999,
                                maxHeight: '200px'
                            }),
                            menuList: (provided) => ({
                                ...provided,
                                maxHeight: '200px',
                                overflowY: 'auto'
                            }),
                            control: (provided) => ({
                                ...provided,
                                minHeight: '42px'
                            })
                        },
                        menuPlacement: "auto",
                        maxMenuHeight: 200
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
        </div>
    )
}
export default UserAccountTab