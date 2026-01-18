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
import ProductFeatures from "./components/ProductFeatures"
import ReplacementItem from "./components/ReplacementItem"
import RelatedProduct from "./components/RelatedProduct"
import DragDropMedia from './components/DragDropMedia'

const fields = ['name', 'sku', 'short_description', 'short_description_ar', 'description', 'price', 'categories', 'location', 'stock_location', 'sub_categories', 'features', 'datasheets', 'media', 'meta', 'options', 'code', 'documents', 'kit', 'stock', 'source_sku', 'brand_id', 'source_id', 'min_qty', 'maxCartAmount', 'packageInclude', 'is_retired', 'replacement_item', 'hasVariants', 'related', 'is_show_for_search', 'search_factor', 'base_purchases_price', 'exchange_factor', 'is_color_sun']
export default ({ onSubmit, model, from, loading, setLoading }) => {

    const [isLoaded, setIsLoaded] = useState(false)
    const form = useForm()

    useEffect(() => {
        if (model) {
            const normalizedModel = {
                ...model,
                // Handle potential field name inconsistencies
                short_description_ar: model.short_description_ar || model.short_description_arr || ''
            }
            const formattedModel = {
                ...model,
                short_description: model.short_description?.replace(/<br\s*\/?>/gi, '\n') || '',
                short_description_ar: model.short_description_ar ? model.short_description_ar.replace(/<br\s*\/?>/gi, '\n') : ''
            }
            form.reset(formattedModel)
        }
    }, [model, form.reset])


    const handleSubmit = async (data) => {
        const payload = {
            ...data,
            // Ensure consistent field names and line break conversion
            short_description: data.short_description?.replace(/\n/g, '<br>'),
            short_description_ar: data.short_description_ar?.replace(/\n/g, '<br>') || ''
        }

        try {
            await onSubmit(payload)
        } catch (error) {
            console.error('Submission error:', error)
        }
    }

        return (
        <Form onSubmit={form.handleSubmit(onSubmit)}>
            <Row>
                <Col sm={9}>
                    <ProductBasic form={form} model={model} from={from}/>
                    <ProductPrice form={form}/>


                    <div className={`${form.watch('is_retired') ?   null : 'd-none'}`}>
                        <CardAction title='Replacement Item' actions='collapse' isOpen={true}>
                            <ReplacementItem form={form} from={from}/>
                        </CardAction>
                    </div>


                    {/*<ProductSale form={form}/>*/}
                    <div className={`${form.watch('options.kit') ?   null : 'd-none'}`}>
                    <CardAction title='KIT Management' actions='collapse' isOpen={false}>
                        <KitTable form={form} />
                    </CardAction>
                    </div>

                    <CardAction title='Related Product' actions='collapse' isOpen={false}>
                        <RelatedProduct form={form} />
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
                    {/* Replace ProductMedia with DragDropMedia */}
                    <DragDropMedia form={form} />

                    <ProductMisc form={form}/>
                    <Button.Ripple
                        disabled={loading}
                        color="success"
                        size="block"
                        type="submit"
                    >
                        {loading ? <div className="spinner"></div> : "Save Changes"}

                    </Button.Ripple>

                </Col>
            </Row>
        </Form>
    )
}