import { Fragment, useEffect, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import Form from './form'
import { api } from '@data/use-project-receipt'
import { useModel } from '@data/use-transaction'
import {toast} from "react-toastify"


const Add = () => {

    const history = useHistory()
    const { id } = useParams()
    const { search }  = useLocation()
    const [model, setModel] = useState()
    const { data: transaction } = id ? useModel(id) : {}

    useEffect(() => {
        if (transaction) {
            if (transaction.receipt) {
                setModel(transaction.receipt)
                console.log('rec')
            } else {
                setModel({
                    name: transaction?.order?.customer?.name,
                    payment_method_id: transaction?.payment_method_id,
                    amount: transaction?.amount,
                    date: transaction?.created_at,
                    explanation: `order :${transaction?.order?.tax_number ?? transaction?.order?.id}`,
                    notes: `receipt for order ${transaction?.order?.tax_number ?? transaction?.order?.id}`
                })
                console.log('tra')
            }

        }
    }, [transaction])
    const [formErrors, setFormErrors] = useState(null)

    const onSubmit = async data => {
        try {
           const res = await api.create({
                transaction_id: id,
                ...data
            })
            window.open(`/receipt/print/${res.id}`, '_blank')
        } catch (e) {
            setFormErrors(e.response?.data?.errors)
        }
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Receipt' breadCrumbActive='Receipts'/>
            <Form
                model={model}
                onSubmit={onSubmit}
                formErrors={formErrors}
            />
        </Fragment>
    )
}

export default Add
