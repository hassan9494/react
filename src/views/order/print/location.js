import { useEffect } from 'react'
import '@styles/base/pages/invoice.scss'
import { useParams } from 'react-router-dom'
import { useOrder } from '@data/use-order'
import TaxedWithLocationInvoice from '@components/invoice/taxed_with_location'
import DebtWithLocationInvoice from '@components/invoice/debt_with_location'
import OfferWithLocationInvoice from '@components/invoice/offer_with_location'
import { calcFinancial  } from '@helpers/Order'

const Print = () => {

    const {id} = useParams()
    const {
        data: order
    } = useOrder(id)

    useEffect(() => {
        if (order) {
            setTimeout(() => {
                window.print()
            }, 200)
        }
    }, [order])
console.log(order?.options.dept)
    if (!order) return <></>
    else if (order?.options.dept) {
        console.log('test')
        return <DebtWithLocationInvoice order={order} meta={calcFinancial(order)}/>
    }

    return (
        order?.options.taxed ? (<TaxedWithLocationInvoice order={order} meta={calcFinancial(order)}/>) : (<OfferWithLocationInvoice order={order} meta={calcFinancial(order)}/>)
    )
}

export default Print
