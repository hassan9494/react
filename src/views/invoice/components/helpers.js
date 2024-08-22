export const getProductPrice = (
    {price, min_price, normal_price},
    pricing
) => {
    if (pricing === 'min') return min_price
    else if (pricing === 'normal') return normal_price
    else return price
}