import { useEffect, useState } from 'react'
import {
    Col,
    Button,
    Form,
    Row
} from 'reactstrap'
import { useForm } from 'react-hook-form'
import ProductBasic from './components/ProductBasic'

// Include both fields we need
const fields = ['name', 'selected_product_id']

export default ({ onSubmit, model, from }) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const form = useForm()

    useEffect(() => {
        if (model?.id) {
            fields.forEach(field => form.setValue(field, model[field]))
            setIsLoaded(true)
        }
    }, [model, form])

    return (
        <Form onSubmit={form.handleSubmit(onSubmit)}>
            <Row>
                <Col sm={12}>
                    <ProductBasic form={form} model={model} />
                </Col>
                <Col sm={12} className="text-right mt-2">
                    <Button color='success' type='submit'>
                        {from === 'add' ? 'Create Variant' : 'Update Variant'}
                    </Button>
                </Col>
            </Row>
        </Form>
    )
}