import {
    Col,
    FormGroup,
    Card,
    CardBody, Row, CardHeader
} from 'reactstrap'
import {Field} from '@components/form/fields'
import AsyncSelect from 'react-select/async/dist/react-select.esm'
import {api} from '@data/use-product'
import {useState, useEffect} from 'react'

export default function Basic({form, model}) {
    const {setValue, register} = form
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [defaultOption, setDefaultOption] = useState(null)

    // Register the selected_product_id field
    register('selected_product_id')


    const renderProductOption = (product) => (
        <div className="d-flex justify-content-left align-items-center">
            <div className="avatar mr-50" width="32" height="32">
                <img src={product.image} alt={product.name} height="32" width="32"/>
            </div>
            <div className="d-flex flex-column">
                <h6 className="user-name text-truncate mb-0">{product.name}</h6>
                <small className="text-truncate text-muted mb-0">SKU: {product.sku}</small>
            </div>
        </div>
    )
    // Set initial selected product when model is provided (edit mode)
    useEffect(() => {
        if (model && model.selected_product) {
            setSelectedProduct(model.selected_product)
            setValue('selected_product', model.selected_product)
            setValue('selected_product_id', model.selected_product_id)

            // Create default option for AsyncSelect
            setDefaultOption({
                label: renderProductOption(model.selected_product),
                value: model.selected_product.id,
                product: model.selected_product
            })
        }
    }, [model, setValue])

    const promiseOptions = async (inputValue) => {
        try {
            const data = await api.autocomplete(inputValue)
            return data.map((product) => ({
                label: renderProductOption(product),
                value: product.id,
                product
            }))
        } catch (error) {
            console.error('Error fetching products:', error)
            return []
        }
    }

    const handleProductSelect = (selectedOption) => {
        if (selectedOption) {
            setSelectedProduct(selectedOption.product)
            setValue('selected_product', selectedOption.product)
            setValue('selected_product_id', selectedOption.product.id)
        } else {
            setSelectedProduct(null)
            setValue('selected_product', null)
            setValue('selected_product_id', null)
        }
    }

    return (
        <Card>
            <CardHeader>
                <h4>Basic Info</h4>
            </CardHeader>
            <CardBody>
                {/* Hidden input for selected_product_id */}
                <input type="hidden" {...register('selected_product_id')} />

                {/* Product Selection */}
                <Row>
                    <Col sm={12}>
                        <FormGroup>
                            <label>Select Product to Copy Details From</label>
                            <AsyncSelect
                                isClearable={true}
                                className='react-select'
                                classNamePrefix='select'
                                loadOptions={promiseOptions}
                                cacheOptions
                                onChange={handleProductSelect}
                                value={defaultOption}
                                placeholder="Search for a product to copy details from..."
                                noOptionsMessage={({inputValue}) => (inputValue ? 'No products found' : 'Type to search products')
                                }
                            />
                        </FormGroup>
                    </Col>
                </Row>

                {/* Name Field */}
                <Row>
                    <Col sm={12}>
                        <Field
                            label={'Variant Name'}
                            name={'name'}
                            rules={{required: true}}
                            form={form}
                            placeholder="Enter variant name"
                        />
                    </Col>
                </Row>

                {/* Selected Product Info Display */}
                {selectedProduct && (
                    <Row>
                        <Col sm={12}>
                            <FormGroup>
                                <label>Selected Product Info</label>
                                <div className="border p-2 rounded bg-light">
                                    <small>
                                        <strong>Name:</strong> {selectedProduct.name}<br/>
                                        <strong>SKU:</strong> {selectedProduct.sku}<br/>
                                        <strong>ID:</strong> {selectedProduct.id}
                                    </small>
                                </div>
                            </FormGroup>
                        </Col>
                    </Row>
                )}
            </CardBody>
        </Card>
    )
}