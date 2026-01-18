// src/views/transfer-order/helpers.js
export const calculateStockValidation = (product) => {
    const validation = {
        canProceed: true,
        warnings: []
    }

    if (product.from_location === 'stock_available' &&
        product.quantity > (product.current_stock_available || 0)) {
        validation.canProceed = false
        validation.warnings.push(`Insufficient stock available. Required: ${product.quantity}, Available: ${product.current_stock_available}`)
    }

    if (product.from_location === 'store_available' &&
        product.quantity > (product.current_store_available || 0)) {
        validation.canProceed = false
        validation.warnings.push(`Insufficient store available. Required: ${product.quantity}, Available: ${product.current_store_available}`)
    }

    return validation
}

export const calculateExpectedStock = (product) => {
    let stockAvailAfter = product.current_stock_available || 0
    let storeAvailAfter = product.current_store_available || 0

    if (product.from_location === 'stock_available') {
        stockAvailAfter -= product.quantity
    } else {
        storeAvailAfter -= product.quantity
    }

    if (product.to_location === 'stock_available') {
        stockAvailAfter += product.quantity
    } else {
        storeAvailAfter += product.quantity
    }

    const totalAfter = stockAvailAfter + storeAvailAfter

    return {
        stockAvailAfter,
        storeAvailAfter,
        totalAfter
    }
}