import { Card, CardBody, Button, FormGroup } from 'reactstrap'
import Select from 'react-select'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { confirm, confirmDelete } from '@components/sweetalert'

const InvoiceStatus = ({ update, invoice }) => {

    const [status, setStatus] = useState(null)

    useEffect(() => {
        if (!status) setStatus(invoice?.status)
    }, [invoice])
    const list = [
        {
            label: 'New Invoice',
            value: 'DRAFT'
        },
        {
            label: 'Canceled',
            value: 'CANCELED'
        },
        {
            label: 'Completed',
            value: 'COMPLETED'
        }
    ]

    const onSubmit = async () => {
        confirm(async () => {
            try {
                await update({status})
                toast.success('Success')
            } catch (e) {
                toast.error(e.response?.data?.message)
            }
        })
    }

    const onCancel = async () => {
        confirmDelete(async () => {
            try {
                await update({status: 'CANCELED'})
                setStatus('CANCELED')
                toast.success('Success')
            } catch (e) {
                toast.error(e.response?.data?.message)
            }
        })
    }

    return (
        <Card className='invoice-action-wrapper'>
            <CardBody>
                <FormGroup>
                    <Select
                        className='react-select'
                        classNamePrefix='select'
                        value={list.filter(list => list.value === (status || invoice?.status))}
                        options={list}
                        onChange={val => setStatus(val?.value)}
                    />
                </FormGroup>
                <Button.Ripple color='primary' block onClick={onSubmit} >
                    Update Status
                </Button.Ripple>
                {
                    invoice?.status === 'PENDING' &&
                    <Button.Ripple color='danger' outline className='mt-1' block onClick={onCancel}>
                        Delete Invoice
                    </Button.Ripple>
                }
            </CardBody>
        </Card>
    )
}

export default InvoiceStatus
