import { FormGroup, Input, Label } from 'reactstrap'
import '@styles/react/libs/tables/react-dataTable-component.scss'

const Field = ({ form, type = 'text', name, label, rules = {}, ...props }) => (
    <FormGroup>
        {
            label &&
            <Label>{ label }</Label>
        }
        <Input
            type={type}
            name={name}
            innerRef={form.register(rules)}
            invalid={form.errors[name] && true}
            { ...props }
        />
    </FormGroup>
)

export default Field