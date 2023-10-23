import { useLocation } from 'react-router-dom'
import { useStock } from '@data/use-report'
import TaxedInvoice from '@components/invoice/taxed'
import '@styles/base/pages/invoice.scss'
import { calcFinancial  } from '@helpers/Order'

const Print = () => {

    const params = useLocation().search

    const { data: orders } = useStock({ params })

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
