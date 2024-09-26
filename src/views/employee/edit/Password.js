import FormBuilder from '@components/form'
import { api } from '@data/use-user'
import { toast } from 'react-toastify'

const PasswordTab = ({user}) => {

    const onSubmit = async data => {
        try {
            await api.changePassword(user.id, data)
            toast.success('Operation completed successfully!')
        } catch (e) {
            toast.error(e?.response?.data?.message)
        }
    }

    return (
        <FormBuilder
            fields={[
                {
                    label: 'Password',
                    name: 'password',
                    type: 'password',
                    rules: { required: true }
                },
                {
                    label: 'Password Confirmation',
                    name: 'password_confirmation',
                    type: 'password',
                    rules: { required: true }
                }
            ]}
            initialValues={user}
            onSubmit={onSubmit}
        />
    )
}
export default PasswordTab
