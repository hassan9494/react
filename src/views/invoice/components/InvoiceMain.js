import {
    Card,
    CardBody,
    Button
} from 'reactstrap'
import ProductsTable from './ProductsTable'
import moment from 'moment'
import { useEffect, useState } from 'react'
import {Plus, Printer, Save} from 'react-feather'
import { Link, useLocation } from 'react-router-dom'
import { getProductPrice } from "./helpers"
import InvoiceCustomer from './InvoiceCustomer'
import ExtraItems from './ExtraItems'
import InvoiceCalc from './InvoiceCalc'
import ability from "../../../configs/acl/ability"

const PreviewCard = ({ invoice, form, isCompleted }) => {

    const [disabled, setDisabled] = useState(true)

    const products = form.watch('products')
    const location = useLocation()

    useEffect(() => {
        setDisabled((invoice && invoice?.status === 'COMPLETED') || isCompleted)
    }, [invoice, products])

    return (
        <Card>
            <CardBody className='px-2 pb-0'>
                {/* Header */}
                <div className='d-flex justify-content-between flex-md-row flex-column'>
                    <div>
                        <strong>{ invoice?.number ? `Invoice: #${invoice?.number} ` : 'New Invoice' }</strong>
                    </div>
                    <div>
                        Date: <span className='invoice-number'>{moment().format('Y-MM-DD')}</span>
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
            <ProductsTable form={form} disabled={disabled} />
            {/* /Products Table */}

            {/* Total */}
            <hr className='invoice-spacing' />

            {/* Invoice Note */}
            <CardBody className='invoice-padding pt-0 d-flex'>

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
