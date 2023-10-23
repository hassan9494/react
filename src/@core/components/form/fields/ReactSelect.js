import { FormGroup, Label } from 'reactstrap'
import { Controller } from 'react-hook-form'
import Select from 'react-select'

const ReactSelect = ({ form, name, label, rules = {}, list = [], ...props }) => (
    <FormGroup>
        {
            label &&
            <Label>{ label }</Label>
        }
        <Controller
            control={form.control}
            name={name}
            innerRef={form.register(rules)}
            invalid={form.errors[name] && true}
            render={({ onChange, value, name, ref }) => (
                <Select
                    className='react-select'
                    classNamePrefix='select'
                    value={list.filter(option => option.value === value)}
                    inputRef={ref}
                    options={list}
                    onChange={val => {
                        onChange(val?.value)
                        if (props.onSelectChange) {
                            props.onSelectChange(val?.value)
                        }
                    }}
                    { ...props }
                />
            )}
        />
    </FormGroup>
)

export default ReactSelect
