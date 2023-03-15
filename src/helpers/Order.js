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
        discount: totalDiscount.toFixed(2),
        total: total.toFixed(2),
        subtotal: subtotal.toFixed(2),
        subtotalDiscount: subtotalDiscount.toFixed(2),
        taxAmount: taxAmount.toFixed(2)
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
            'Invoice Number': e.tax_number,
            date: moment(e.taxed_at).format('DD/MM/Y'),
            name: e.customer?.name,
            subtotal,
            discount,
            subtotalDiscount,
            tax: taxAmount,
            total,
            'Is Returned': e.status === 'RETURNED' || e.status === 'CANCELED' ? 'مرتجع' : ''
        }
    }), name || 'orders-report')
}