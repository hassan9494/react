import { CustomInput, FormGroup, Label } from 'reactstrap'
import '@styles/react/libs/tables/react-dataTable-component.scss'

const FileField = ({ form, type = 'text', name, label, rules = {}, ...props }) => (
    <FormGroup>
        {
            label &&
            <Label>{ label }</Label>
        }
        <CustomInput
            type={type}
            name={name}
            id={name}
            innerRef={form.register(rules)}
            invalid={form.errors[name] && true}
            { ...props }
        />
    </FormGroup>
)

export default FileField