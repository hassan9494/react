import { useEffect } from 'react'
import '@styles/base/pages/invoice.scss'
import { useParams } from 'react-router-dom'
import { useModel } from '@data/use-receipt'
import ReceiptTaxed from '@components/invoice/receipt-taxed'

const Print = () => {

    const {id} = useParams()
    const {
        data: model
    } = useModel(id)

    useEffect(() => {
        if (model) {
            setTimeout(() => {
                window.print()
            }, 200)
        }
    }, [model])

    // if (!order) return <></>

    return (
        model?.taxed ? (<ReceiptTaxed receipt={model} />) : (<ReceiptTaxed receipt={model} />)
    )
}

export default Print
