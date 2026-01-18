import { jsonToExcel  } from './ExcelHelper'
import moment from 'moment'

export const calcFinancial = (product) => {
    const discount = (Number.parseFloat(product.discount) || 0)
    const subtotal = (Number.parseFloat(product.subtotal) || 0)
    const taxAmount = (Number.parseFloat(product.tax_amount || 0))
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

export const productsToExcel = (products, name) => {
    jsonToExcel(products.map(e => {

        return {
            Number: e.id,
            sku: e.sku,
            name: e.name,
            quantity:e.quantity,
            price : e.price?.normal_price,
            sales :e.sales,
            'Untaxed sales': e.untaxed_sales,
            'taxed sales': e.taxed_sales
        }
    }), name || 'products-report')
}