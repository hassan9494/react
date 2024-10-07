import {
    Col,
    FormGroup,
    Card,
    CardBody, Row, CardHeader
} from 'reactstrap'
import {Field, SelectMulti, Select} from '@components/form/fields'
import {useCategories, useSubCategories} from '@data/use-category'
import {useBrands} from '@data/use-brand'
import {useSources} from "@data/use-source"
import {useEffect, useState} from "react"

export default function Basic({form, model, page}) {

    const {register, errors, control, setValue, getValues} = form
    const {data: categories} = useCategories()
    const {data: subCategories} = useSubCategories()
    const {data: brands} = useBrands()
    const {data: sources} = useSources()

    const categoriesSelect = categories.map(e => {
        return {
            value: e.id,
            label: e.title
        }
    })

    const brandsSelect = [
        { value: 0, label: 'No Choice' },
        ...brands.map(e => ({
            value: e.id,
            label: e.name
        }))
    ]

    const sourcesSelect = [
        { value: 0, label: 'No Choice' },
        ...sources.map(e => ({
            value: e.id,
            label: e.name
        }))
    ]

    const selectedCategories = form.watch('categories')


    const getSubCateogies = () => {
        if (model && selectedCategories && selectedCategories.length > 0) {
            console.log('if')
            const filtered = subCategories.filter(subCategory => selectedCategories.includes(subCategory.parent)
            ).map(e => ({
                value: e.id,
                label: e.title
            }))

            // Remove subcategories whose parent category is deselected
            // const currentSubCategories = getValues('sub_categories') || []
            // const updatedSubCategories = currentSubCategories?.filter(subCategory => selectedCategories?.includes(subCategories?.find(sc => sc.id === subCategory)?.parent))
            // setValue('sub_categories', updatedSubCategories)

            return filtered
        } else {

            return subCategories.map(e => ({
                value: e.id,
                label: e.title
            }))
        }
    }
    // console.log(form.watch('sub_categories'))
    return (
        <Card>
            <CardHeader>
                <h4>Basic Info</h4>
            </CardHeader>
            <CardBody>
                <Row>
                    <Col sm={6}>
                        <Field
                            label={'Name'}
                            name={'name'}
                            rules={{required: true}}
                            form={form}
                        />
                    </Col>
                    <Col sm={6}>
                        <Field
                            label={'SKU'}
                            name={'sku'}
                            rules={{required: true}}
                            form={form}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <Field
                            label={'Source SKU'}
                            name={'source_sku'}
                            rules={{required: false}}
                            form={form}
                        />
                    </Col>
                    <Col sm={6}>
                        <FormGroup>
                            <SelectMulti
                                label={'Categories'}
                                name={'categories'}
                                isClearable={false}
                                list={categoriesSelect}
                                form={form}
                            />
                        </FormGroup>
                    </Col>
                    <Col sm={6}>
                        <FormGroup>
                            <Select
                                label={'Brand'}
                                name={'brand_id'}
                                isClearable={true}
                                list={brandsSelect}
                                form={form}
                            />
                        </FormGroup>
                    </Col>
                    {
                        (!(selectedCategories && selectedCategories.length === 0) && (model || page === 'add')) &&
                        <Col sm={6}>
                            <FormGroup>
                                <SelectMulti
                                    label={'Sub Categories'}
                                    name={'sub_categories'}
                                    isClearable={false}
                                    list={getSubCateogies()}
                                    form={form}
                                />
                            </FormGroup>
                        </Col>
                    }

                    <Col sm={6}>
                        <FormGroup>
                            <Select
                                label={'Source'}
                                name={'source_id'}
                                isClearable={true}
                                list={sourcesSelect}
                                form={form}
                            />
                        </FormGroup>
                    </Col>
                    <Col sm={6}>
                        <FormGroup>
                            <Field
                                form={form}
                                label={'Stock'}
                                type='number'
                                name='stock'
                                rules={{required: true}}
                            />
                        </FormGroup>
                    </Col>


                    <Col sm={6}>
                        <FormGroup>
                            <Field
                                form={form}
                                label={'Min Quantity'}
                                type='number'
                                name='min_qty'
                                rules={{required: true}}
                            />
                        </FormGroup>
                    </Col>
                    <Col sm={6}>
                        <FormGroup>
                            <Field
                                form={form}
                                label={'Maximum sellable amount to single customer'}
                                type='number'
                                name='maxCartAmount'
                                rules={{required: false}}
                            />
                        </FormGroup>
                    </Col>
                </Row>

                <Field
                    label={'Short Description'}
                    name={'short_description'}
                    form={form}
                    type={'textarea'}
                />

            </CardBody>
        </Card>
    )
}

