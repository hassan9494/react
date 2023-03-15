import { Card, CardBody, Button, FormGroup } from 'reactstrap'
import Select from 'react-select'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { confirm, confirmDelete } from '@components/sweetalert'

const OrderStatus = ({ update, order }) => {

    const [status, setStatus] = useState(null)

    useEffect(() => {
        if (!status) setStatus(order?.status)
    }, [order])
    const list = [
        {
            label: 'New Order',
            value: 'PENDING'
        },
        {
            label: 'Processing',
            value: 'PROCESSING'
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
                        value={list.filter(list => list.value === (status || order?.status))}
                        options={list}
                        onChange={val => setStatus(val?.value)}
                    />
                </FormGroup>
                <Button.Ripple color='primary' block onClick={onSubmit}>
                    Update Status
                </Button.Ripple>
                {
                    order?.status === 'PENDING' &&
                    <Button.Ripple color='danger' outline className='mt-1' block onClick={onCancel}>
                        Delete Order
                    </Button.Ripple>
                }
            </CardBody>
        </Card>
    )
}

export default OrderStatus
