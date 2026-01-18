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
    const air_min_qty = (Number.parseFloat(needs.air_min_qty || 0))
    const sea_min_qty = (Number.parseFloat(needs.sea_min_qty || 0))
    const local_min_qty = (Number.parseFloat(needs.local_min_qty || 0))
    const order_qty = (Number.parseFloat(needs.order_qty || 0))
    const air_order_qty = (Number.parseFloat(needs.air_order_qty || 0))
    const sea_order_qty = (Number.parseFloat(needs.sea_order_qty || 0))
    const local_order_qty = (Number.parseFloat(needs.local_order_qty || 0))
    const purchases_qty = (Number.parseFloat(needs.purchases_qty || 0))
    const source_sku = needs.source_sku
    const air_source_sku = needs.air_source_sku
    const sea_source_sku = needs.sea_source_sku
    const local_source_sku = needs.local_source_sku
    const priceAll = (Number.parseFloat(needs.priceAll || 0))
    const realPriceAll = (Number.parseFloat(needs.allRealPrice || 0))
    const link = `${REACT_APP_WEBSITE}product/${needs.sku}`
    const source = needs.source
    const air_source = needs.air_source
    const sea_source = needs.sea_source
    const local_source = needs.local_source
    const location = needs.location
    const stock_location = needs.stock_location

    return {
        product_Id: id,
        product_NAme: name,
        product_stock: stock,
        product_price: price,
        product_real_price: real_price,
        product_min_qty: min_qty.toFixed(2),
        product_air_min_qty: air_min_qty.toFixed(2),
        product_sea_min_qty: sea_min_qty.toFixed(2),
        product_local_min_qty: local_min_qty.toFixed(2),
        product_order_qty: order_qty.toFixed(2),
        product_air_order_qty: air_order_qty.toFixed(2),
        product_sea_order_qty: sea_order_qty.toFixed(2),
        product_local_order_qty: local_order_qty.toFixed(2),
        product_purchases_qty: purchases_qty.toFixed(2),
        product_priceAll: priceAll.toFixed(2),
        product_realPriceAll: realPriceAll.toFixed(2),
        product_sku: source_sku,
        product_air_sku: air_source_sku,
        product_sea_sku: sea_source_sku,
        product_local_sku: local_source_sku,
        location,
        stock_location,
        product_link: link,
        product_source: source,
        product_air_source: air_source,
        product_sea_source: sea_source,
        product_local_source: local_source
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
            air_min_qty,
            sea_min_qty,
            local_min_qty,
            order_qty,
            air_order_qty,
            sea_order_qty,
            local_order_qty,
            purchases_qty,
            priceAll,
            product_realPriceAll,
            source_sku,
            air_source_sku,
            sea_source_sku,
            local_source_sku,
            location,
            stock_location,
            link,
            source,
            air_source,
            sea_source,
            local_source
        } = calcFinancial(e)
        return {
            Id : e.id,
            NAME : e.name,
            Stock: e.stock,
            Price :e.price,
            Real_Price :e.real_price,
            Min_Quantity :e.min_qty,
            Air_Min_Quantity :e.air_min_qty,
            Sea_Min_Quantity :e.sea_min_qty,
            Local_Min_Quantity :e.local_min_qty,
            Order_Quantity :e.order_qty,
            Air_Order_Quantity :e.air_order_qty,
            Sea_Order_Quantity :e.sea_order_qty,
            Local_Order_Quantity :e.local_order_qty,
            Purchases_Quantity :e.purchases_qty,
            PriceAll : e.priceAll,
            product_realPriceAll,
            Source_Sku :e.source_sku,
            Air_Source_Sku :e.air_source_sku,
            Sea_Source_Sku :e.sea_source_sku,
            Local_Source_Sku :e.local_source_sku,
            Stock_Location :e.stock_location,
            Store_Location :e.location,
            Link : `${ REACT_APP_WEBSITE }/product/${e.sku}`,
            source :e.source,
            Air_source :e.air_source,
            Sea_source :e.sea_source,
            Local_source :e.local_source
        }
    }), name || 'outlays-report')
}