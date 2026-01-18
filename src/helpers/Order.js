import { jsonToExcel  } from './ExcelHelper'
import moment from 'moment'

export const calcFinancial = (order) => {
    const discount = (Number.parseFloat(order.discount) || 0)
    const subtotal = (Number.parseFloat(order.subtotal) || 0)
    const taxAmount = (Number.parseFloat(order.tax_amount || 0))
    const subtotalDiscount = (subtotal - discount - taxAmount)
    const total = (subtotal - discount)
    const totalDiscount = (discount + taxAmount)
    return {
        fixedDiscount: discount,
        discount: totalDiscount.toFixed(3),
        total: total.toFixed(3),
        subtotal: subtotal.toFixed(3),
        subtotalDiscount: subtotalDiscount.toFixed(3),
        taxAmount: taxAmount.toFixed(3)
    }
}

export const ordersToExcel = (orders, name) => {
    jsonToExcel(orders.map(e => {
        const {
            discount,
            total,
            subtotal,
            subtotalDiscount,
            taxAmount
        } = calcFinancial(e)
        return {
            Number: e.id,
            'Invoice Number': e.tax_number,
            date: moment(e.taxed_at).format('DD/MM/Y'),
            name: e.customer?.name,
            subtotal,
            discount,
            subtotalDiscount,
            tax: taxAmount,
            total,
            'Identity Number' :e.customer_identity_number,
            'Identity Type' :(e?.identity_number_type === 'NIN' ? 'الرقم الوطني' : (e?.identity_number_type === 'PN') ? 'الرقم الشخصي لغير الاردني' : 'الرقم الضريبي'),
            'Is Returned': e.status === 'RETURNED' || e.status === 'CANCELED' ? 'مرتجع' : ''
        }
    }), name || 'orders-report')
}