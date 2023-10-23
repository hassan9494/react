import { useLocation } from 'react-router-dom'
import { useOutlays } from '@data/use-report'
import OutlaysList from '@components/outlay/outlay'
import '@styles/base/pages/invoice.scss'
import { calcFinancial  } from '@helpers/Outlay'

const Print = () => {

    const params = useLocation().search

    const { data: outlays } = useOutlays({ params })

    return (
        <>
            {
                outlays?.map(e => (
                    <>
                        <OutlaysList outlay={e} meta={calcFinancial(e)}/>
                        <p style={{pageBreakBefore: 'always'}} />
                    </>
                ))
            }
        </>
    )

}

export default Print
