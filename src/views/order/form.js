import { useEffect } from 'react'
import FormErrors from '@components/form-errors'
import {
    Col,
    Label,
    Input,
    Button,
    Form,
    FormGroup,
    Card,
    CardBody
} from 'reactstrap'
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import { useCategories } from '../../data/use-category'

const CategoryForm = ({ onSubmit, model, formErrors }) => {

    const { data: categories } = useCategories()
    const { register, errors, handleSubmit, control, setValue } = useForm()
    const categoriesSelect = categories.map(e => {
        return {
            value: e.id,
            label: e.title
        }
    })

    useEffect(() => {
        if (model) {
            const fields = ['order', 'title', 'slug', 'icon', 'parent']
            fields.forEach(field => setValue(field, model[field]))
        }
    }, [model])

    return (
        <Card>
            <CardBody>
                <Form onSubmit={handleSubmit(onSubmit)}>

                    <FormGroup row>
                        <Label sm='3' for='order'>Order</Label>
                        <Col sm='9'>
                            <Input
                                type='number'
                                name='order'
                                id='order'
                                placeholder='Order'
                                innerRef={register({required: true})}
                                invalid={errors.order && true}
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label sm='3' for='slug'>Title</Label>
                        <Col sm='9'>
                            <Input
                                type='text'
                                name='title'
                                id='title'
                                placeholder='Title'
                                innerRef={register({required: true})}
                                invalid={errors.title && true}
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label sm='3' for='slug'>Slug</Label>
                        <Col sm='9'>
                            <Input
                                type='text'
                                name='slug'
                                id='slug'
                                placeholder='Slug'
                                innerRef={register({required: true})}
                                invalid={errors.slug && true}
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label sm='3' for='icon'>Icon</Label>
                        <Col sm='9'>
                            <Input
                                type='text'
                                name='icon'
                                id='icon'
                                placeholder='Icon'
                                innerRef={register({required: true})}
                                invalid={errors.icon && true}
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label sm='3' for='parent'>Parent</Label>
                        <Col sm='9'>
                            <Controller
                                control={control}
                                defaultValue={null}
                                name="parent"
                                render={({ onChange, value, name, ref }) => (
                                    <Select
                                        className='react-select'
                                        classNamePrefix='select'
                                        value={categoriesSelect.filter(option => option.value === value)}
                                        inputRef={ref}
                                        options={categoriesSelect}
                                        onChange={val => onChange(val?.value)}
                                        isClearable={true}
                                    />
                                )}
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup className='mb-0' row>
                        <Col className='d-flex' md={{size: 9, offset: 3}}>
                            <FormErrors errors={formErrors} />
                        </Col>
                        <Col className='d-flex' md={{size: 9, offset: 3}}>
                            <Button.Ripple className='mr-1' color='primary' type='submit'>
                                Submit
                            </Button.Ripple>
                        </Col>
                    </FormGroup>
                </Form>
            </CardBody>
        </Card>
    )
}

export default CategoryForm
