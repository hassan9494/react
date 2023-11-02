import { jsonToExcel  } from './ExcelHelper'
import moment from 'moment'

export const calcFinancial = (needs) => {
    const { REACT_APP_WEBSITE } = process.env
    const id = needs.id
    const name = needs.name
    const stock = needs.stock
    const price = (Number.parseFloat(needs.price || 0))
    const min_qty = (Number.parseFloat(needs.min_qty || 0))
    const sku = needs.sku
    const priceAll = (Number.parseFloat(needs.priceAll || 0))
    const link = `${REACT_APP_WEBSITE}product/${needs.sku}`

    return {
        product_Id: id,
        product_NAme: name,
        product_stock: stock,
        product_price: price,
        product_min_qty: min_qty.toFixed(2),
        product_priceAll: priceAll.toFixed(2),
        product_sku: sku,
        product_link: link
    }
}

export const needsToExcel = (needs, name) => {
    const { REACT_APP_WEBSITE } = process.env
    jsonToExcel(needs.map(e => {
        const {
            id,
            name,
            stock,
            price,
            min_qty,
            priceAll,
            sku,
            link
        } = calcFinancial(e)
        return {
            Id : e.id,
            NAME : e.name,
            Stock: e.stock,
            Price :e.price,
            Min_Quantity :e.min_qty,
            PriceAll : e.priceAll,
            Sku :e.sku,
            Link : `${ REACT_APP_WEBSITE }product/${e.sku}`
        }
    }), name || 'outlays-report')
}