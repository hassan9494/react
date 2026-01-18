import { useEffect, useRef, useState } from 'react'
import '@styles/base/pages/invoice.scss'
import { useParams } from 'react-router-dom'
import { useOrder } from '@data/use-order'
import TaxedWithPictureInvoice from '@components/invoice/taxed_with_picture'
import DebtWithPictureInvoice from '@components/invoice/debt_with_picture'
import OfferWithPictureInvoice from '@components/invoice/offer_with_picture'
import { calcFinancial } from '@helpers/Order'
import axiosInstance from './../../../utility/axiosIsntance'

const Print = () => {
    const { id } = useParams()
    const { data: order } = useOrder(id)
    const printTriggered = useRef(false)
    const [currentPage, setCurrentPage] = useState(1)

    // Add proforma condition
    const isProforma = order?.options?.taxed &&
        !order?.is_migrated

    useEffect(() => {
        if (order && !printTriggered.current) {
            printTriggered.current = true

            const customerName = order.customer?.name || 'Invoice'
            const documentTitle = isProforma ? `${customerName} - Proforma Invoice - Mikroelektron` : `${customerName} - Mikroelektron`

            document.title = documentTitle

            axiosInstance.post(`/order/${id}/record-print`)
                .then(response => {
                    console.log('Print recorded successfully:', response.data)
                })
                .catch(error => {
                    console.error('Error recording print:', error.response?.data || error.message)
                })

            setTimeout(() => {
                window.print()

                setTimeout(() => {
                    document.title = "Mikroelektron | Portal"
                }, 1000)
            }, 200)
        }
    }, [order, id, isProforma])

    // Add page class to body based on current page
    useEffect(() => {
        if (currentPage === 1) {
            document.body.classList.add('first-page')
            document.body.classList.remove('subsequent-page')
        } else {
            document.body.classList.add('subsequent-page')
            document.body.classList.remove('first-page')
        }
    }, [currentPage])

    if (!order) return <></>

    if (order?.options.dept && order?.options.taxed) {
        return <DebtWithPictureInvoice order={order} meta={calcFinancial(order)} onPageChange={setCurrentPage} isProforma={isProforma} />
    }

    return (
        order?.options.taxed ? (
            <TaxedWithPictureInvoice order={order} meta={calcFinancial(order)} onPageChange={setCurrentPage} isProforma={isProforma} />
        ) : (
            <OfferWithPictureInvoice order={order} meta={calcFinancial(order)} onPageChange={setCurrentPage} />
        )
    )
}

export default Print