import { jsonToExcel  } from './ExcelHelper'
import moment from 'moment'

export const calcFinancial = (needs) => {
    const { REACT_APP_WEBSITE } = process.env
    const id = needs.id
    const name = needs.name
    const stock = needs.stock
    const price = (Number.parseFloat(needs.price || 0))
    const real_price = (Number.parseFloat(needs.real_price || 0))
    const min_qty = (Number.parseFloat(needs.min_qty || 0))
    const source_sku = needs.source_sku
    const priceAll = (Number.parseFloat(needs.priceAll || 0))
    const realPriceAll = (Number.parseFloat(needs.allRealPrice || 0))
    const link = `${REACT_APP_WEBSITE}product/${needs.sku}`
    const source = needs.source

    return {
        product_Id: id,
        product_NAme: name,
        product_stock: stock,
        product_price: price,
        product_real_price: real_price,
        product_min_qty: min_qty.toFixed(2),
        product_priceAll: priceAll.toFixed(2),
        product_realPriceAll: realPriceAll.toFixed(2),
        product_sku: source_sku,
        product_link: link,
        product_source: source
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
            real_price,
            min_qty,
            priceAll,
            product_realPriceAll,
            source_sku,
            link,
            source
        } = calcFinancial(e)
        return {
            Id : e.id,
            NAME : e.name,
            Stock: e.stock,
            Price :e.price,
            Real_Price :e.real_price,
            Min_Quantity :e.min_qty,
            PriceAll : e.priceAll,
            product_realPriceAll,
            Source_Sku :e.source_sku,
            Link : `${ REACT_APP_WEBSITE }/product/${e.sku}`,
            source :e.source
        }
    }), name || 'outlays-report')
}