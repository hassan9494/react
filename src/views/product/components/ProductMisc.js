import {
    Label,
    Input,
    FormGroup,
    Card,
    CardBody,
    CustomInput
} from 'reactstrap'

export default ({ form }) => {
    const {register, errors} = form
    return (
        <Card>
            <CardBody>
                <FormGroup>
                    <Input
                        type='text'
                        name='meta.title'
                        placeholder='Meta Title'
                        innerRef={register({})}
                        invalid={errors.meta?.title && true}
                    />
                </FormGroup>
                <FormGroup>
                    <Input
                        type='text'
                        name='meta.keywords'
                        placeholder='Meta Keywords'
                        innerRef={register({})}
                        invalid={errors.meta?.keywords && true}
                    />
                </FormGroup>
                <FormGroup className='mb-0'>
                    <Input
                        type='text'
                        name='meta.description'
                        placeholder='Meta Description'
                        innerRef={register({})}
                        invalid={errors.meta?.description && true}
                    />
                </FormGroup>
            </CardBody>
            <hr className='m-0'/>
            <CardBody>
                <FormGroup className='mb-0'>
                    <Label className='mb-0' for='search_factor'>
                        Search Factor
                    </Label>
                    <Input
                        type='number'
                        name='search_factor'
                        placeholder='Search Factor'
                        defaultValue={50}
                        innerRef={register({})}
                        invalid={errors.search_factor && true}
                    />
                </FormGroup>
            </CardBody>
            <hr className='m-0'/>
            <CardBody>
                <div className='d-flex justify-content-between mb-1'>
                    <Label className='mb-0' for='product-featured'>
                        Featured
                    </Label>
                    <CustomInput
                        id='product-featured'
                        type='switch'
                        name='options.featured'
                        innerRef={register()}
                    />
                </div>
                <div className='d-flex justify-content-between mb-1'>
                    <Label className='mb-0' for='product-available'>
                        Available
                    </Label>
                    <CustomInput
                        id='product-available'
                        type='switch'
                        defaultChecked={true}
                        name='options.available'
                        innerRef={register()}
                    />
                </div>
                <div className='d-flex justify-content-between mb-1'>
                    <Label className='mb-0' for='product-show'>
                        Show For Search
                    </Label>
                    <CustomInput
                        id='product-show'
                        type='switch'
                        defaultChecked={true}
                        name='is_show_for_search'
                        innerRef={register()}
                    />
                </div>
                <div className='d-flex justify-content-between mb-1'>
                    <Label className='mb-0' for='product-kit'>
                        KIT
                    </Label>
                    <CustomInput
                        id='product-kit'
                        type='switch'
                        name='options.kit'
                        innerRef={register()}
                    />
                </div>
                <div className='d-flex justify-content-between mb-1'>
                    <Label className='mb-0' for='is_retired'>
                        Retired
                    </Label>
                    <CustomInput
                        id='is_retired'
                        type='switch'
                        name='is_retired'
                        innerRef={register()}
                    />
                </div>
                <div className='d-flex justify-content-between mb-1'>
                    <Label className='mb-0' for='hasVariants'>
                        Colors Parent
                    </Label>
                    <CustomInput
                        id='hasVariants'
                        type='switch'
                        name='hasVariants'
                        innerRef={register()}
                    />
                </div>
                <div className='d-flex justify-content-between'>
                    <Label className='mb-0' for='is_color_sun'>
                        Colors Son
                    </Label>
                    <CustomInput
                        id='is_color_sun'
                        type='switch'
                        name='is_color_sun'
                        innerRef={register()}
                    />
                </div>
            </CardBody>
        </Card>
    )
}