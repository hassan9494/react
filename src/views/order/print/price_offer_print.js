import { useEffect } from 'react'
import '@styles/base/pages/invoice.scss'
import { useParams } from 'react-router-dom'
import { useOrder } from '@data/use-order'
import TaxedInvoice from '@components/invoice/taxed'
import DebtInvoice from '@components/invoice/debt'
import OfferInvoice from '@components/invoice/offer'
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
    return (
       <OfferInvoice order={order} meta={calcFinancial(order)}/>
    )
}

export default Print
