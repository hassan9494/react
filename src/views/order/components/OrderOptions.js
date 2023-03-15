import { CustomInput, Label } from 'reactstrap'
import { useEffect } from 'react'

export default function ({ form, order, isCompleted }) {

    const taxed = form.watch('options.taxed')

    useEffect(() => {
        if (!taxed) {
            form.setValue('options.tax_exempt', false)
        } else {
            form.setValue('options.price_offer', false)
        }
    }, [taxed])

    return (
        <div className='mt-1'>
            <div className='d-flex justify-content-between'>
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
            <div className='d-flex justify-content-between mt-1'>
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
                    name='options.price_offer'
                    innerRef={form.register()}
                />
                <Label className='mb-0 font-medium-1' for='order-price-offer'>
                    <strong>عرض سعر</strong>
                </Label>
            </div>
        </div>
    )

}