import {
    Col,
    FormGroup,
    Card,
    CardBody,
    Row,
    Button,
    Tooltip,
    CardHeader,
    Collapse // Add this import
} from 'reactstrap'
import {Field, SelectMulti, Select} from '@components/form/fields'
import {useCategories, useSubCategories} from '@data/use-category'
import {useBrands} from '@data/use-brand'
import {useSources} from "@data/use-source"
import {useEffect, useMemo, useState} from "react"
import ability from "../../../configs/acl/ability"
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useHistory } from 'react-router-dom'
import { BarChart2, ShoppingCart, ChevronDown, ChevronUp } from 'react-feather' // Add Chevron icons

export default function Basic({form, model, from}) {
    const {register, errors, control, setValue, getValues, watch} = form
    const {data: categories} = useCategories()
    const {data: subCategories} = useSubCategories()
    const {data: brands} = useBrands()
    const {data: sources} = useSources()
    const canEditStock = ability.can('read', 'edit_stock')
    const history = useHistory()

    // Tooltip states
    const [tooltipOpenSales, setTooltipOpenSales] = useState(false)
    const [tooltipOpenPurchases, setTooltipOpenPurchases] = useState(false)
    const [filteredSubCategories, setFilteredSubCategories] = useState([])

    // Add state for collapse
    const [isAdditionalInfoOpen, setIsAdditionalInfoOpen] = useState(false)

    const canViewSalesReport = ability.can('read', 'order_details')
    const canViewPurchasesReport = ability.can('read', 'order_details')

    const selectedCategories = watch('categories')

    const categoriesSelect = categories?.map(e => {
        return {
            value: e.id,
            label: e.title
        }
    }) || []

    const brandsSelect = [
        { value: 0, label: 'No Choice' },
        ...(brands?.map(e => ({
            value: e.id,
            label: e.name
        })) || [])
    ]

    const sourcesSelect = [
        { value: 0, label: 'No Choice' },
        ...(sources?.map(e => ({
            value: e.id,
            label: e.name
        })) || [])
    ]

    // Effect to filter subcategories based on selected categories
    useEffect(() => {
        if (!selectedCategories || selectedCategories.length === 0 || !subCategories) {
            setFilteredSubCategories([])
            // Only clear sub_categories if we're not in the middle of setting up from model
            if (!model?.id) {
                setValue('sub_categories', [])
            }
            return
        }

        // Filter subcategories that belong to selected categories
        const filtered = subCategories.filter(subCategory => selectedCategories.includes(subCategory.parent)
        ).map(e => ({
            value: e.id,
            label: e.title
        }))

        setFilteredSubCategories(filtered)

        // Update form: remove subcategories that no longer belong to selected categories
        const currentSubCategories = getValues('sub_categories') || []
        const validSubCategories = currentSubCategories.filter(subCatId => filtered.some(item => item.value === subCatId)
        )

        if (JSON.stringify(validSubCategories) !== JSON.stringify(currentSubCategories)) {
            setValue('sub_categories', validSubCategories)
        }
    }, [selectedCategories, subCategories, setValue, getValues, model])

    // Set default category for add mode
    useEffect(() => {
        if (from === 'add' && categories && categories.length > 0 && !getValues('categories')) {
            const allProductsCategory = categories.find(cat => cat.id === 70)
            if (allProductsCategory) {
                setValue('categories', [70])
            }
        }
    }, [categories, from, setValue, getValues])

    // Initialize form values if model exists
    useEffect(() => {
        if (model?.id && subCategories && categories) {
            // Set categories and sub_categories from model
            if (model.categories && JSON.stringify(getValues('categories')) !== JSON.stringify(model.categories)) {
                setValue('categories', model.categories)
            }
            if (model.sub_categories && JSON.stringify(getValues('sub_categories')) !== JSON.stringify(model.sub_categories)) {
                setValue('sub_categories', model.sub_categories)
            }
        }
    }, [model, categories, subCategories, setValue, getValues])

    const [description, setDescription] = useState(watch('short_description') || '')
    const [descriptionAr, setDescriptionAr] = useState(watch('short_description_ar') || '')
    const [casherNote, setCasherNote] = useState(watch('casher_note') || '')

    const handleCasherNoteChange = (value) => {
        setCasherNote(value)
        setValue('casher_note', value, { shouldDirty: true })
    }

    // Add this useEffect to initialize casher note when model loads
    useEffect(() => {
        if (model?.id) {
            // Check if both stock_available and store_available are 0 but stock has value
            const stockValue = model.stock || 0
            const stockAvailableValue = model.stock_available || 0
            const storeAvailableValue = model.store_available || 0

            // SPECIAL CASE: If both available are 0 but stock has value
            if (stockAvailableValue === 0 && storeAvailableValue === 0 && stockValue > 0) {
                // Put all stock in store_available
                form.setValue('store_available', stockValue)
                form.setValue('stock_available', 0)
                form.setValue('stock', stockValue)
            } else {
                // Normal initialization
                if (model.stock !== undefined) form.setValue('stock', model.stock)
                if (model.stock_available !== undefined) form.setValue('stock_available', model.stock_available)
                if (model.store_available !== undefined) form.setValue('store_available', model.store_available)
            }

            if (model.short_description) {
                setDescription(model.short_description)
            }
            if (model.short_description_ar) {
                setDescriptionAr(model.short_description_ar)
            }
            if (model.casher_note) {
                setCasherNote(model.casher_note)
            }
        }
    }, [model])

    // Quill modules and formats configuration
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['blockquote', 'link'],
            ['clean']
        ]
    }

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'blockquote', 'link',
        'color', 'background'
    ]

    // Handle description changes
    const handleDescriptionChange = (value) => {
        setDescription(value)
        setValue('short_description', value, { shouldDirty: true })
    }

    const handleDescriptionArChange = (value) => {
        setDescriptionAr(value)
        setValue('short_description_ar', value, { shouldDirty: true })
    }

    const navigateToSales = () => {
        if (model?.id) {
            history.push(`/reports/product-sales/${model.id}`)
        }
    }

    const navigateToPurchases = () => {
        if (model?.id) {
            history.push(`/reports/product-purchases/${model.id}`)
        }
    }

    // Initialize descriptions when model loads
    useEffect(() => {
        if (model?.id) {
            if (model.short_description) {
                setDescription(model.short_description)
            }
            if (model.short_description_ar) {
                setDescriptionAr(model.short_description_ar)
            }
        }
    }, [model])

    return (
        <Card>
            <CardHeader>
                <div className="d-flex justify-content-between align-items-center w-100">
                    <h4 className="mb-0">Basic Info</h4>
                    {from === 'edit' && model?.id && (
                        <div className="d-flex align-items-center">
                            {/* Sales Report Button - Conditionally rendered */}
                            {canViewSalesReport && (
                                <div className="mr-1" id="salesReportTooltip">
                                    <Button
                                        color="secondary"
                                        className="btn-icon"
                                        onClick={navigateToSales}
                                        size="sm"
                                    >
                                        <BarChart2 size={14} />
                                        <span className="ml-50 d-none d-md-inline">Sales Report</span>
                                    </Button>
                                    <Tooltip
                                        placement="top"
                                        isOpen={tooltipOpenSales}
                                        target="salesReportTooltip"
                                        toggle={() => setTooltipOpenSales(!tooltipOpenSales)}
                                    >
                                        View Sales Report for this Product
                                    </Tooltip>
                                </div>
                            )}

                            {/* Purchases Report Button - Conditionally rendered */}
                            {canViewPurchasesReport && (
                                <div id="purchasesReportTooltip">
                                    <Button
                                        color="primary"
                                        className="btn-icon"
                                        onClick={navigateToPurchases}
                                        size="sm"
                                    >
                                        <ShoppingCart size={14} />
                                        <span className="ml-50 d-none d-md-inline">Purchases Report</span>
                                    </Button>
                                    <Tooltip
                                        placement="top"
                                        isOpen={tooltipOpenPurchases}
                                        target="purchasesReportTooltip"
                                        toggle={() => setTooltipOpenPurchases(!tooltipOpenPurchases)}
                                    >
                                        View Purchases Report for this Product
                                    </Tooltip>
                                </div>
                            )}
                        </div>
                    )}
                </div>
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
                    <Col sm={6} className={'d-none'}>
                        <Field
                            name={'sku'}
                            rules={{required: false}}
                            form={form}
                            type={'hidden'}
                        />
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
                </Row>
                <Row>
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
                            <SelectMulti
                                label={'Sub Categories'}
                                name={'sub_categories'}
                                isClearable={false}
                                list={filteredSubCategories}
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
                                defaultValue={0}
                                readOnly={!((from === 'edit' && canEditStock) || from === 'add')}
                                rules={{required: true}}
                                onChange={(e) => {
                                    const stockValue = parseInt(e.target.value) || 0
                                    const currentStockAvailable = parseInt(form.getValues('stock_available') || 0)
                                    // If stock_available is more than new total, cap it
                                    const stockAvailable = Math.min(currentStockAvailable, stockValue)
                                    const storeAvailable = stockValue - stockAvailable
                                    form.setValue('stock_available', stockAvailable)
                                    form.setValue('store_available', Math.max(0, storeAvailable))
                                }}
                            />
                        </FormGroup>
                    </Col>

                    <Col sm={6}>
                        <FormGroup>
                            <Field
                                form={form}
                                label={'Stock Available'}
                                type='number'
                                name='stock_available'
                                defaultValue={0}
                                readOnly={!((from === 'edit' && canEditStock) || from === 'add')}
                                rules={{required: true, min: 0}}
                                onChange={(e) => {
                                    const stockAvailableValue = parseInt(e.target.value) || 0
                                    const totalStock = parseInt(form.getValues('stock') || 0)
                                    // Cap stock_available at total stock
                                    const stockAvailable = Math.min(stockAvailableValue, totalStock)
                                    const storeAvailable = totalStock - stockAvailable
                                    form.setValue('stock_available', stockAvailable)
                                    form.setValue('store_available', Math.max(0, storeAvailable))
                                }}
                            />
                        </FormGroup>
                    </Col>

                    <Col sm={6}>
                        <FormGroup>
                            <Field
                                form={form}
                                label={'Store Available'}
                                type='number'
                                name='store_available'
                                defaultValue={0}
                                readOnly={true} // This is calculated automatically
                                rules={{required: true, min: 0}}
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
                                defaultValue={20}
                                rules={{required: false}}
                            />
                        </FormGroup>
                    </Col>
                    <Col sm={6}>
                        <FormGroup>
                            <Field
                                form={form}
                                label={'Store Location'}
                                type='text'
                                name='location'
                                rules={{required: false}}
                            />
                        </FormGroup>
                    </Col>
                    <Col sm={6}>
                        <FormGroup>
                            <Field
                                form={form}
                                label={'Stock Location'}
                                type='text'
                                name='stock_location'
                                rules={{required: false}}
                            />
                        </FormGroup>
                    </Col>
                </Row>

                {/* Additional Information Collapsible Section */}
                <div className="mt-4 mb-4 border rounded p-2 mt-2">
                    <Button
                        color="link"
                        style={{width:'100%', justifyContent:'space-between'}}
                        className="p-0 d-flex align-items-center"
                        onClick={() => setIsAdditionalInfoOpen(!isAdditionalInfoOpen)}
                    >
                        <h5 className="mb-0 ml-2">Source Information</h5>
                        {isAdditionalInfoOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}

                    </Button>
                    <Collapse isOpen={isAdditionalInfoOpen}>
                        <div className="rounded mt-2">
                            <Row>
                                <Col sm={3}>
                                    <FormGroup>
                                        <Select
                                            label={'Sea Source'}
                                            name={'sea_source_id'}
                                            isClearable={true}
                                            list={sourcesSelect}
                                            form={form}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col sm={3}>
                                    <Field
                                        label={'Sea Source SKU'}
                                        name={'sea_source_sku'}
                                        rules={{required: false}}
                                        form={form}
                                    />
                                </Col>

                                <Col sm={3}>
                                    <FormGroup>
                                        <Field
                                            form={form}
                                            label={'Sea Min Quantity'}
                                            type='number'
                                            name='sea_min_qty'
                                            defaultValue={1}
                                            rules={{required: true}}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col sm={3}>
                                    <FormGroup>
                                        <Field
                                            form={form}
                                            label={'Sea Order quantity'}
                                            type='text'
                                            name='sea_order_qty'
                                            defaultValue={0}
                                            rules={{required: false}}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={3}>
                                    <FormGroup>
                                        <Select
                                            label={'Air Source'}
                                            name={'air_source_id'}
                                            isClearable={true}
                                            list={sourcesSelect}
                                            form={form}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col sm={3}>
                                    <Field
                                        label={'Air Source SKU'}
                                        name={'air_source_sku'}
                                        rules={{required: false}}
                                        form={form}
                                    />
                                </Col>

                                <Col sm={3}>
                                    <FormGroup>
                                        <Field
                                            form={form}
                                            label={'Air Min Quantity'}
                                            type='number'
                                            name='air_min_qty'
                                            defaultValue={1}
                                            rules={{required: true}}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col sm={3}>
                                    <FormGroup>
                                        <Field
                                            form={form}
                                            label={'Air Order quantity'}
                                            type='text'
                                            name='air_order_qty'
                                            defaultValue={0}
                                            rules={{required: false}}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={3}>
                                    <FormGroup>
                                        <Select
                                            label={'Local Source'}
                                            name={'local_source_id'}
                                            isClearable={true}
                                            list={sourcesSelect}
                                            form={form}
                                            styles={{zInex:999999999999}}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col sm={3}>
                                    <Field
                                        label={'Local Source SKU'}
                                        name={'local_source_sku'}
                                        rules={{required: false}}
                                        form={form}
                                    />
                                </Col>

                                <Col sm={3}>
                                    <FormGroup>
                                        <Field
                                            form={form}
                                            label={'Local Min Quantity'}
                                            type='number'
                                            name='local_min_qty'
                                            defaultValue={1}
                                            rules={{required: true}}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col sm={3}>
                                    <FormGroup>
                                        <Field
                                            form={form}
                                            label={'Local Order quantity'}
                                            type='text'
                                            name='local_order_qty'
                                            defaultValue={0}
                                            rules={{required: false}}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </div>
                    </Collapse>
                </div>

                <Row className="g-4">
                    <FormGroup className="mb-3 w-100 mx-1">
                        <label className="d-block fw-semibold mb-2 text-gray-700">Short Description (English)</label>
                        <div
                            className="border border-gray-300 rounded-lg bg-white shadow-sm overflow-hidden"
                            style={{
                                height: '250px',
                                display: 'flex',
                                flexDirection: 'column',
                                overflowY: 'auto'
                            }}
                        >
                            <ReactQuill
                                theme="snow"
                                value={description}
                                onChange={handleDescriptionChange}
                                modules={modules}
                                formats={formats}
                                style={{
                                    flex: 1,
                                    border: 'none',
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '0.925rem',
                                    height: '100%'
                                }}
                                className="english-editor w-100"
                                placeholder="Write your description here..."
                            />
                        </div>
                        <input
                            type="hidden"
                            name="short_description"
                            ref={register}
                            value={description}
                        />
                    </FormGroup>
                </Row>

                <Row className="g-4">
                    <FormGroup className="mb-3 w-100 mx-1">
                        <label className="d-block fw-semibold mb-2 text-gray-700">Short Description (Arabic)</label>
                        <div
                            className="border border-gray-300 rounded-lg bg-white shadow-sm overflow-hidden"
                            style={{
                                height: '250px',
                                display: 'flex',
                                flexDirection: 'column',
                                overflowY: 'auto'
                            }}
                        >
                            <ReactQuill
                                theme="snow"
                                value={descriptionAr}
                                onChange={handleDescriptionArChange}
                                modules={modules}
                                formats={formats}
                                style={{
                                    flex: 1,
                                    border: 'none',
                                    fontFamily: "'Tajawal', sans-serif",
                                    fontSize: '0.925rem',
                                    height: '100%'
                                }}
                                className="arabic-editor w-100"
                                placeholder="اكتب الوصف هنا..."
                                dir="rtl"
                            />
                        </div>
                        <input
                            type="hidden"
                            name="short_description_ar"
                            ref={register}
                            value={descriptionAr}
                            dir="rtl"
                        />
                    </FormGroup>
                </Row>
                <Row className="g-4">
                    <FormGroup className="mb-2 w-100 mx-1">
                        <label className="d-block fw-semibold" style={{ color: '#fe5e00', fontWeight:'bold'}}>Casher Note</label>
                        <div
                            className=" border border-gray-300 rounded-lg bg-white  overflow-hidden"
                            style={{
                                height: '120px',
                                display: 'flex',
                                flexDirection: 'column',
                                overflowY: 'auto',
                                boxShadow: '0 0 10px rgba(249, 105, 14, 0.1)' // Red shadow effect
                                // border: '1px solid #fe5e00 ' // Red border
                            }}
                        >
                            <ReactQuill
                                theme="snow"
                                value={casherNote}
                                onChange={handleCasherNoteChange}
                                modules={modules}
                                formats={formats}
                                style={{
                                    flex: 1,
                                    border: 'none',
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: '0.925rem',
                                    height: '100%',
                                    color: '#fe5e00' // Red text color
                                }}
                                className="casher-note-editor w-100"
                                placeholder="Add casher note here..."
                            />
                        </div>
                        <input
                            type="hidden"
                            name="casher_note"
                            ref={register}
                            value={casherNote}
                        />
                    </FormGroup>
                </Row>

                <style>{`
  /* Adjust editor heights to account for toolbar */
  .english-editor .ql-container,
  .arabic-editor .ql-container,
  .casher-note-editor .ql-container {
    height: 100% !important;
  }
  .ql-editor {
    padding-bottom: 20px !important;
  }
  .ql-toolbar {
    position: sticky;
    top: 0;
    background: white;
    z-index: 1;
    border-top-left-radius: 0.5rem !important;
    border-top-right-radius: 0.5rem !important;
  }
  /* Responsive adjustments for buttons */
  @media (max-width: 768px) {
    .btn-icon span {
      display: none !important;
    }
    .btn-icon {
      padding: 0.375rem 0.5rem !important;
    }
  }
`}</style>
            </CardBody>
        </Card>
    )
}