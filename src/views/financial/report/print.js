import { useLocation } from 'react-router-dom'
import { zemamApi } from '@data/use-report'
import TaxedInvoice from '@components/invoice/taxed'
import '@styles/base/pages/invoice.scss'
import { calcFinancial  } from '@helpers/Order'
import {useEffect, useState} from "react"

const Print = () => {

    const params = useLocation().search
    const [orders, setOrders] = useState([])

    const getOrders = async () => {
        const response = await zemamApi.order(params)
        console.log(response)
        if (response) {
            setOrders(response)
        }
    }

    useEffect(() => {
      getOrders()
    }, [])


    console.log(orders)

    return (
        <>
            {
                orders?.map(e => (
                    <>
                        <TaxedInvoice order={e} meta={calcFinancial(e)}/>
                        <p style={{pageBreakBefore: 'always'}} />
                    </>
                ))
            }
        </>
    )

}

export default Print
