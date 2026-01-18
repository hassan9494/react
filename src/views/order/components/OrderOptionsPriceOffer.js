import { CustomInput, Label } from 'reactstrap'
import { useEffect } from 'react'

export default function ({ form, order, isCompleted}) {

    const taxed = form.watch('options.taxed')
    const tax_exempt = form.watch('options.tax_exempt')

    useEffect(() => {
        if (!taxed) {
            form.setValue('options.tax_exempt', false)
            form.setValue('options.tax_zero', false)
        } else {
            form.setValue('options.price_offer', false)
        }
        if (!tax_exempt) {
            form.setValue('options.tax_zero', false)
        }
    }, [taxed, tax_exempt])

    return (
        <div className='mt-1'>
            <div className='d-flex justify-content-between mt-1'>
                <CustomInput
                    disabled={isCompleted}
                    id='order-dept'
                    type='switch'
                    name='options.dept'
                    innerRef={form.register()}
                />
                <Label className='mb-0 font-medium-1' for='order-dept'>
                    <strong>فاتورة ذمم</strong>
                </Label>
            </div>
            <div className='d-flex justify-content-between mt-1'>
                <CustomInput
                    disabled={taxed || isCompleted}
                    id='order-price-offer'
                    type='switch'
                    defaultChecked={true}
                    name='options.price_offer'
                    innerRef={form.register()}
                />
                <Label className='mb-0 font-medium-1' for='order-price-offer'>
                    <strong>عرض سعر</strong>
                </Label>
            </div>

            <div className='d-flex justify-content-between hidden'>
                <CustomInput
                    id='order-taxed'
                    type='switch'
                    disabled={!!order?.tax_number || isCompleted}
                    name='options.taxed'
                    innerRef={form.register()}
                />
                <Label className='mb-0 font-medium-1' for='order-taxed'>
                    <strong>فاتورة ضريبية</strong>
                </Label>
            </div>
            <div className='d-flex justify-content-between mt-1 hidden'>
                <CustomInput
                    disabled={!taxed || isCompleted}
                    id='order-tax-exempt'
                    type='switch'
                    name='options.tax_exempt'
                    innerRef={form.register()}
                />
                <Label className='mb-0 font-medium-1' for='order-tax-exempt'>
                    <strong>معفي من الضريبة</strong>
                </Label>
            </div>
            <div className='d-flex justify-content-between mt-1 hidden'>

                <CustomInput
                    disabled={!taxed || isCompleted || !tax_exempt}
                    id='order-tax-zero'
                    type='switch'
                    name='options.tax_zero'
                    innerRef={form.register()}
                />
                <Label className='mb-0 font-medium-1' for='order-tax-exempt'>
                    <strong>معفي بنسبة الصفر</strong>
                </Label>

            </div>
        </div>
    )

}