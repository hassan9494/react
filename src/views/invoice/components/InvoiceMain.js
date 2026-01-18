import {
    Card,
    CardBody,
    Button
} from 'reactstrap'
import ProductsTable from './ProductsTable'
import moment from 'moment'
import { useEffect, useState } from 'react'
import {Download, RefreshCw, Printer, Save} from 'react-feather'
import { Link, useLocation } from 'react-router-dom'
import { getProductPrice } from "./helpers"
import InvoiceCustomer from './InvoiceCustomer'
import ExtraItems from './ExtraItems'
import InvoiceCalc from './InvoiceCalc'
import ability from "../../../configs/acl/ability"
import { invoiceToExcel  } from '@helpers/SingleInvoice'

const PreviewCard = ({ invoice, form, isCompleted }) => {
    const [total, setTotal] = useState(0)
    const [disabled, setDisabled] = useState(true)

    const products = form.watch('products')
    const exchange_factor = form.watch('exchange_factor')
    const location = useLocation()
    const handleExport = async () => {
        const data = invoice
        const fileName =  `invoice : ${invoice?.id}`

        invoiceToExcel(data, fileName, total)
    }

    const handleCalc = async () => {
        if (exchange_factor) {
            products.map((item, index) => {
                item.purchases_price = item.base_purchases_price * exchange_factor
                item.exchange_factor = exchange_factor
            })
        } else {
            products.map((item, index) => {
                item.purchases_price = item.base_purchases_price * item.exchange_factor
            })
        }

        form.setValue('products', products)
    }


    useEffect(() => {
        setDisabled((invoice && invoice?.status === 'COMPLETED') || isCompleted)
    }, [invoice, products])

    return (
        <Card>
            <CardBody className='px-2 pb-0'>
                {/* Header */}
                <div className='d-flex justify-content-between flex-md-row flex-column'>
                    <div>
                        <strong>{ invoice?.number ? `Purchase: #${invoice?.number} ` : 'New Purchase' }</strong>
                    </div>
                    <div>
                        Created Date: <span className='invoice-number'>{moment().format('Y-MM-DD')}</span>
                    </div>
                </div>
                {/* /Header */}
            </CardBody>

            <hr className='invoice-spacing'/>

            {/* Address and Contact */}
            <CardBody className='px-2 pt-0'>
                <InvoiceCustomer form={form} invoice={invoice} disabled={isCompleted} />
            </CardBody>
            {/* /Address and Contact */}

            {/* Products Table */}
            <ProductsTable form={form} disabled={disabled} total={total} setTotal={setTotal}/>
            {/* /Products Table */}

            {/* Total */}
            <hr className='invoice-spacing' />

            {/* Invoice Note */}
            <CardBody className='invoice-padding pt-0 d-flex'>
                <div className="mr-auto">
                    {
                        (invoice && location.pathname.includes('edit')) &&
                        <Button.Ripple color={'primary'}  onClick={handleExport}>
                            <Download size={14} />
                            <span className='align-middle ml-25'>Export</span>
                        </Button.Ripple>
                    }
                </div>
                <div className="mr-auto">
                    <Button.Ripple color={'primary'}  onClick={handleCalc}>
                        <RefreshCw size={14} />
                        <span className='align-middle ml-25'>Calculate</span>
                    </Button.Ripple>
                </div>


                <Button.Ripple color='secondary' type='submit' >
                    <Save size={14} />
                    <span className='align-middle ml-25'>Save Changes</span>
                </Button.Ripple>
            </CardBody>
            {/* /Invoice Note */}

        </Card>
    )
}

export default PreviewCard
