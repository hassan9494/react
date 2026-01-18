import { Row, Col, Form } from 'reactstrap'
import '@styles/base/pages/app-invoice.scss'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import { Controller, useForm } from 'react-hook-form'
import { useInvoice } from '@data/use-invoice'
import { toast } from 'react-toastify'

import InvoiceMain from '../components/InvoiceMain'
import InvoiceStatus from '../components/InvoiceStatus'
import InvoiceOptions from '../components/InvoiceOptions'
import ShippingStatus from '../components/ShippingStatus'
import InvoiceAttachments from '../components/InvoiceAttachments'
import ability from "../../../configs/acl/ability"

const fields = [
    'number',
    'name',
    'note',
    'products',
    'attachments',
    'date',
    'exchange_factor',
    'tax_number',
    'source_id',
    'source_type'
]

export default function () {
    const history = useHistory()
    const can_complete_invoice = ability.can('read', 'invoice_complete')
    const { id } = useParams()
    const {
        data: invoice,
        update: updateInvoice,
        updateStatus,
        error
    } = useInvoice(id)
    useEffect(() => {
        if (error) {
            console.log(error)
            history.push(`/invoice/list`)
        }

    }, [error])
    const form = useForm()

    const [loaded, setLoaded] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)

    const onSubmit = async data => {
        try {
            console.log('Form data before mapping:', data)

            // Validate distribution before sending
            const distributionErrors = []
            data.products?.forEach((product, index) => {
                const stockQty = Number(product.stock_available_qty) || 0
                const storeQty = Number(product.store_available_qty) || 0
                const totalQty = Number(product.quantity) || 0

                if (stockQty + storeQty !== totalQty) {
                    distributionErrors.push(`Product "${product.name}": Stock distribution (${stockQty} + ${storeQty}) doesn't equal total quantity (${totalQty})`)
                }
            })

            if (distributionErrors.length > 0) {
                toast.error(`Distribution Errors: ${distributionErrors.join(', ')}`)
                return
            }

            data.products = data.products?.map(product => ({
                id: product.id,
                purchases_price: product.purchases_price,
                quantity: product.quantity,
                allocation: product.allocation || 'store',
                source_sku: product.source_sku,
                sale_price: product.sale_price,
                normal: product.normal,
                distributer_price: product.distributer_price,
                base_purchases_price: product.base_purchases_price,
                exchange_factor: product.exchange_factor,
                stock_available_qty: Number(product.stock_available_qty) || 0,
                store_available_qty: Number(product.store_available_qty) || 0
            })) || []

            console.log('Products data being sent:', data.products)

            await updateInvoice(data)
            toast.success('Invoice Updated')
        } catch (e) {
            console.error('Update error details:', e.response?.data || e.message)
            toast.error(e?.response?.data?.message || 'Failed to update invoice')
        }
    }

    useEffect(() => {
        if (!loaded && invoice) {
            setLoaded(true)
            for (const field of fields) {
                form.setValue(field, invoice[field])
            }
        }
        const completed = invoice?.status === 'COMPLETED'
        setIsCompleted(completed)
    }, [invoice])

    return (
        <Form onSubmit={form.handleSubmit(onSubmit)}>
            <Row>
                {
                    can_complete_invoice &&
                    <Col md={3} sm={12}>
                        <InvoiceStatus update={updateStatus} invoice={invoice} />
                    </Col>
                }

                <Col md={12} sm={12}>
                    <InvoiceMain invoice={invoice} form={form} isCompleted={false}  />
                    <Controller
                        control={form.control}
                        defaultValue={[]}
                        name={'attachments'}
                        render={({value, onChange}) => {
                            return (
                                <InvoiceAttachments
                                    onChange={onChange}
                                    files={value}
                                />
                            )
                        }}
                    />

                </Col>
            </Row>
        </Form>
    )
}