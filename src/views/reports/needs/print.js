import { useLocation } from 'react-router-dom'
import { useNeeds } from '@data/use-report'
import Need from '@components/need/need'
import '@styles/base/pages/needs.scss'
import {identity, pickBy} from "lodash"
import {useEffect} from "react"

const Print = () => {

    const params = useLocation().search.toString()

    const { data: products } = useNeeds({ params })
    useEffect(() => {
        if (products) {
            setTimeout(() => {
                window.print()
            }, 200)
        }
    }, [products])
    return (
        <>
            {
                // orders?.map(e => (
                    <>
                        <Need products={products}/>
                        <p style={{pageBreakBefore: 'always'}} />
                    </>
                // ))
            }
        </>
    )

}

export default Print
