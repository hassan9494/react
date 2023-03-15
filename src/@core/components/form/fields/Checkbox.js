import { FormGroup, Label, CustomInput } from 'reactstrap'
import '@styles/react/libs/tables/react-dataTable-component.scss'

const Checkbox = ({ form, type = 'text', name, label, rules = {}, wrapper = { class: '' }, ...props }) => (
    <FormGroup className={wrapper?.class || 'd-flex'}>
        {
            label &&
            <Label className='font-medium-1 mr-2'>{ label }</Label>
        }
        <CustomInput
            id={name}
            type='switch'
            name={name}
            innerRef={form.register(rules)}
            invalid={form.errors[name] && true}
            { ...props }
        />
    </FormGroup>
)

export default Checkbox