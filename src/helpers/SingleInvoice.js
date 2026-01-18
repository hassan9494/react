import {jsonToExcel} from './ExcelHelper'
import moment from 'moment'
import ability from "../configs/acl/ability"

export const invoiceToExcel = (invoice, fileName, total) => {
    if (!invoice) return
    const is_show_real_price = ability.can('read', 'show_real_price_for_product_in_order')
    const safeValue = (val) => val || ''

    const excelData = []

    // // Header: Business information
    // excelData.push(["Business Information"])
    // excelData.push(["Company", "Muntasir and Mahmoud Electronics"])
    // excelData.push(["Tax Number", "013461320"])
    // excelData.push(["Address", "Amman - Queen Rania Street"])
    // excelData.push(["", "Nivin Ascent - Khalifa Complex"])
    // excelData.push(["Email", "info@mikroelectron.com"])
    //
    // excelData.push([]) // Empty row
    //
    // // Invoice details
    // excelData.push(["Invoice Details"])
    // excelData.push(["Date", moment(order?.taxed_at).format('DD/MM/Y')])
    // excelData.push(["Invoice Number", order?.tax_number])
    // excelData.push(["Customer", order?.customer?.name])
    // excelData.push(["Customer Phone", order?.customer?.phone])
    // excelData.push(["Shipping Address", order?.shipping?.address])

    // excelData.push([]) // Empty row

    // Table Header
    is_show_real_price ? excelData.push(
        [
            "Number",
            "Product Name",
            "Quantity",
            "Purchases Price",
            "Exchange Factor",
            "Real Price",
            "Distributer Price",
            "Price",
            "Sale Price",
            "Location",
            "Stock Location",
            "Total"
        ]) : excelData.push(
        [
            "Number",
            "Product Name",
            "Quantity",
            "Purchases Price",
            "Exchange Factor",
            "Distributer Price",
            "Price",
            "Sale Price",
            "Location",
            "Stock Location",
            "Total"
        ])


    // Items: Combine products and extra items
    const allItems = [...(invoice?.products || []), ...(invoice?.extra_items || [])]
        .sort((a, b) => a.number - b.number) // Sort by id, ascending

    let runningTotal = 0

    allItems.forEach((item, i) => {
        const price = Number.parseFloat(item.normal).toFixed(3)
        const sale_price = Number.parseFloat(item.sale_price).toFixed(3)
        const purchases_price = Number.parseFloat(item.purchases_price).toFixed(3)
        const base_purchases_price = Number.parseFloat(item.base_purchases_price).toFixed(3)
        const exchange_factor = Number.parseFloat(item.exchange_factor).toFixed(3)
        const distributer_price = Number.parseFloat(item.distributer_price).toFixed(3)
        const quantity = Number.parseFloat(item.quantity)
        const itemTotal = (quantity * price).toFixed(3)

        is_show_real_price ? excelData.push([
                i + 1,
                item.name,
                safeValue(item.quantity),
                base_purchases_price,
                exchange_factor,
                purchases_price,
                distributer_price,
                price,
                sale_price,
                item.location,
                item.stock_location,
                total
            ]) : excelData.push([
                i + 1,
                item.name,
                safeValue(item.quantity),
                base_purchases_price,
                exchange_factor,
                distributer_price,
                price,
                sale_price,
                item.location,
                item.stock_location,
                total
            ])

        runningTotal += Number(itemTotal)
    })

    // Footer with totals
    excelData.push([]) // Empty row

    excelData.push(["", "", "", "Total", safeValue(total)])

    // Footer information
    excelData.push([]) // Empty row

    // excelData.push(["", "Recipient Signature", "Seller Name", "Muntasir"])

    jsonToExcel(excelData, fileName || 'invoice-export')
}
