import {
    Card,
    CardBody,
    Button,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap'
import ProductsTable from './ProductsTable'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { Plus, Printer, Save, Download  } from 'react-feather'
import { Link, useLocation } from 'react-router-dom'
import { getProductPrice } from "./helpers"
import OrderCustomer from './OrderCustomer'
import ExtraItems from './ExtraItems'
import OrderCalc from './OrderCalc'
import ability from "../../../../configs/acl/ability"

import { orderToExcel  } from '@helpers/SingleOrder'

const PreviewCard = ({ order, form, isCompleted, isMigrated, calculations, setCalculations }) => {
    // const [calculations, setCalculations] = useState(0)
    const [disabled, setDisabled] = useState(true)
    const [dropdownOpen, setDropdownOpen] = useState(false)

    const products = form.watch('products')

    const extraItems = form.watch('extra_items')
    const discount = form.watch('discount')
    const location = useLocation()
    const canPrintOrder = ability.can('read', 'order_print')
    const calculate = () => {
        let subtotal = 0
        for (const item of (products || [])) {
            const price = getProductPrice(item)
            subtotal += price * item.returned_quantity
        }
        for (const item of (extraItems || [])) {
            subtotal += item.returned_quantity * item.price
        }


        const total = subtotal  - Number.parseFloat(discount || 0)

        setCalculations({
            subtotal: subtotal.toFixed(2),
            total: total.toFixed(2)
        })
    }
    useEffect(() => {
        calculate()
        setDisabled(((order && order?.status !== 'DRAFT') || isCompleted))
    }, [order, products, extraItems, discount])

    // Toggle dropdown
    const toggleDropdown = () => setDropdownOpen(prevState => !prevState)

    // Handle print option selection
    const handlePrintOption = (path) => {
        if (order) {
            window.open(path.replace(':id', order.id), '_blank')
        }
    }

    const handleExport = async () => {
        const data = order
        const fileName =  `order : ${order?.id}`

        orderToExcel(data, fileName)
    }


    return (
        <Card>
            <CardBody className='px-2 pb-0'>
                {/* Header */}
                <div className='d-flex justify-content-between flex-md-row flex-column'>
                    <div>
                        <strong>{ order?.number ? `Order: #${order?.number} | ${order?.oldOrder?.completed_at ?  `Order Date :${moment(order?.oldOrder?.completed_at).format('YYYY-MM-DD HH:mm')}` : '--' } | ${(order?.migrated_at ? moment(order?.migrated_at).format('YYYY-MM-DD HH:mm') : '--')}` : 'New Order'  }</strong>
                    </div>
                    <div>
                        <strong>{ order?.is_migrated ? `Fatora Status:  ${order?.fatora_status }` : `Fatora Status:  ${order?.fatora_status ?? 'Not Sent' }`  }</strong>
                    </div>
                    <div>
                        Date: <span className='invoice-number'>{moment(order?.created_at).format('YYYY-MM-DD HH:mm')}</span>
                    </div>
                </div>
                {/* /Header */}
            </CardBody>

            <hr className='invoice-spacing'/>

            {/* Address and Contact */}
            <CardBody className='px-2 pt-0'>
                <OrderCustomer form={form} order={order} disabled={isCompleted || isMigrated} />
            </CardBody>
            {/* /Address and Contact */}

            {/* Products Table */}
            <ProductsTable form={form} disabled={disabled} isMigrated={isMigrated}/>
            {/* /Products Table */}

            {/* Extra Items */}
            <ExtraItems form={form} fieldName='extra_items' disabled={disabled} onUpdate={calculate} isMigrated={isMigrated} />
            {/* /Extra Items */}

            <hr className='m-0' />

            {/* Total */}
            <OrderCalc form={form} calculations={calculations} disabled={isCompleted}   isMigrated={isMigrated}/>

            {/* Total */}
            <hr className='invoice-spacing' />

            {/* Invoice Note */}
            <CardBody className='invoice-padding pt-0 d-flex justify-content-end'>
                <div className="mr-auto">
                    {canPrintOrder && (
                        <>

                        <div  className={'mr-auto'}>
                            <Button.Ripple
                                color={'dark'}
                                onClick={() => {
                                    handlePrintOption(`/return-order/print/:id`)
                                }}
                                className="mt-0 mr-auto"
                            >
                                Print
                            </Button.Ripple>
                        </div>
                        </>
                    )}
                </div>


                {/*<div className="mr-auto">*/}
                {/*    {*/}
                {/*        (order && location.pathname.includes('edit')) &&*/}
                {/*            <Button.Ripple color={'primary'}  onClick={handleExport}>*/}
                {/*                <Download size={14} />*/}
                {/*                <span className='align-middle ml-25'>Export</span>*/}
                {/*            </Button.Ripple>*/}
                {/*    }*/}
                {/*</div>*/}

                <Button.Ripple color='secondary' className='align-right' type='submit' >
                    <Save size={14} />
                    <span className='align-middle ml-25'>Save Changes</span>
                </Button.Ripple>
            </CardBody>
            {/* /Invoice Note */}

        </Card>
    )
}

export default PreviewCard
