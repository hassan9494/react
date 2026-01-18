import { jsonToExcel } from './ExcelHelper'
import moment from 'moment'

export const orderToExcel = (order, fileName) => {
    if (!order) return

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
    excelData.push(["Number", "Product Name", "Quantity", "Price", "Total"])

    // Items: Combine products and extra items
    const allItems = [...(order?.products || []), ...(order?.extra_items || [])]
        .sort((a, b) => a.number - b.number) // Sort by id, ascending

    let runningTotal = 0

    allItems.forEach((item, i) => {
        const price = Number.parseFloat(item.price).toFixed(2)
        const quantity = Number.parseFloat(item.quantity)
        const itemTotal = (quantity * price).toFixed(2)

        excelData.push([
            i + 1,
            item.name,
            safeValue(item.quantity),
            price,
            itemTotal
        ])
        runningTotal += Number(itemTotal)
    })

    // Footer with totals
    excelData.push([]) // Empty row

    excelData.push(["", "", "", "Sub Total", safeValue(order?.subtotal)])
    excelData.push(["", "", "", "Discount", safeValue(order?.discount)])
    excelData.push(["", "", "", "Total", safeValue(order?.total)])

    // Footer information
    excelData.push([]) // Empty row

    // excelData.push(["", "Recipient Signature", "Seller Name", "Muntasir"])

    jsonToExcel(excelData, fileName || 'invoice-export')
}
