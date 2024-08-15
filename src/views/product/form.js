import { useEffect, useState } from 'react'
import {
    Col,
    Button,
    Form,
    Row, CardBody, Card
} from 'reactstrap'
import { useForm } from 'react-hook-form'
import ProductBasic from './components/ProductBasic'
import ProductDatasheets from './components/ProductDatasheets'
import ProductPrice from './components/ProductPrice'
import ProductMisc from './components/ProductMisc'
import ProductMedia from './components/ProductMedia'
import ProductDescription from './components/ProductDescription'
import ProductSale from './components/ProductSale'
import CardAction from '@components/card-actions'
import KitTable from './components/KitTable'

const fields = ['name', 'sku', 'short_description', 'description', 'price', 'categories', 'features', 'datasheets', 'media', 'meta', 'options', 'code', 'documents', 'kit', 'stock', 'source_sku', 'brand_id', 'source_id', 'min_qty', 'maxCartAmount']

export default ({ onSubmit, model }) => {

    const [isLoaded, setIsLoaded] = useState(false)
    const form = useForm()

    useEffect(() => {
        if (model?.id) {
            fields.forEach(field => form.setValue(field, model[field]))
        }
    }, [model])

    return (
        <Form onSubmit={form.handleSubmit(onSubmit)}>
            <Row>
                <Col sm={9}>
                    <ProductBasic form={form}/>
                    <ProductPrice form={form}/>
                    {/*<ProductSale form={form}/>*/}
                    <CardAction title='KIT Management' actions='collapse' isOpen={false}>
                        <KitTable form={form} />
                    </CardAction>

                    <CardAction title='Content' actions='collapse' isOpen={false}>
                        <CardBody>
                            <ProductDescription form={form}/>
                            {/*<ProductFeatures form={form}/>*/}
                        </CardBody>
                    </CardAction>

                    <ProductDatasheets form={form}/>

                </Col>
                <Col sm={3}>
                    <ProductMedia form={form}/>
                    <ProductMisc form={form}/>
                    <Button.Ripple
                        color='success'
                        size='block'
                        type='submit'>
                        Save Changes
                    </Button.Ripple>
                </Col>
            </Row>
        </Form>
    )
}