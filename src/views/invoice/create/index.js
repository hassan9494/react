import {Row, Col, Form} from 'reactstrap'
import '@styles/base/pages/app-invoice.scss'
import {useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import {Controller, useForm} from 'react-hook-form'
import {useInvoice, api} from '@data/use-invoice'
import {toast} from 'react-toastify'

import InvoiceMain from '../components/InvoiceMain'
import InvoiceStatus from '../components/InvoiceStatus'
import InvoiceAttachments from "../components/InvoiceAttachments"


const fields = [
    'number',
    'note',
    'products',
    'status',
    'attachments',
    'date'
]

export default function () {

    const {id} = useParams()
    const {
        data: invoice,
        update: updateInvoice,
        updateStatus
    } = useInvoice(id)


    const form = useForm()
    const history = useHistory()

    const [loaded, setLoaded] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)

    const onSubmit = async data => {
        try {
            data.products = data.products?.map(
                ({id, price, quantity}) => ({id, price, quantity})
            ) || []
            const {id: invoiceId} = await api.create(data)
            toast.success('Invoice Created')
            history.push(`/invoice/edit/${invoiceId}`)
        } catch (e) {
            toast.error(e?.response?.data?.message)
            console.log(e)
        }
    }
    useEffect(() => {
        if (!loaded && invoice) {
            setLoaded(true)
            for (const field of fields) {
                if (field === 'note' || field === 'number' || field === 'status') {
                    form.setValue(field, null)
                }  else {
                    form.setValue(field, invoice[field])
                }

            }
            // form.setValue('has_shipping', null)
        }
        const completed = invoice?.status === 'COMPLETED'
        setIsCompleted(completed)
    }, [invoice])

    return (
        <Form onSubmit={form.handleSubmit(onSubmit)}>
            <Row>
                <Col md={9} sm={12}>
                    <InvoiceMain invoice={invoice} form={form} isCompleted={false}/>
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
                <Col md={3} sm={12}>
                    <InvoiceStatus/>
                </Col>
            </Row>
        </Form>
    )
}