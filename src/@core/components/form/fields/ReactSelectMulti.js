import { FormGroup, Label } from 'reactstrap'
import { Controller } from 'react-hook-form'
import Select from 'react-select'
import { selectThemeColors } from '@utils'

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
                    theme={selectThemeColors}
                    className='react-select'
                    classNamePrefix='select'
                    value={list.filter(option => value?.includes(option.value))}
                    inputRef={ref}
                    options={list}
                    onChange={val => onChange(val.map(e => e.value))}
                    { ...props }
                    isMulti
                />
            )}
        />
    </FormGroup>
)

export default ReactSelect
