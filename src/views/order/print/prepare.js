import { useEffect, useRef, useState } from 'react'
import '@styles/base/pages/invoice.scss'
import { useParams } from 'react-router-dom'
import { useOrder } from '@data/use-order'
import TaxedWithPictureInvoice from '@components/invoice/taxed_with_picture'
import DebtWithPictureInvoice from '@components/invoice/debt_with_picture'
import OfferWithPictureAndLocationInvoice from '@components/invoice/offer_with_picture_and_location'
import { calcFinancial  } from '@helpers/Order'
import axiosInstance from './../../../utility/axiosIsntance'

const Print = () => {
    const { id } = useParams()
    const { data: order } = useOrder(id)
    const printTriggered = useRef(false)
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        if (order && !printTriggered.current) {
            printTriggered.current = true

            const customerName = order.customer?.name || 'Preparation'
            document.title = ` ${customerName} - Mikroelektron`

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
    }, [order, id])

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

    // Add conditional rendering similar to index.js if needed
    // For now, keeping your original component
    return (
        <OfferWithPictureAndLocationInvoice order={order} meta={calcFinancial(order)} onPageChange={setCurrentPage} />
    )
}

export default Print