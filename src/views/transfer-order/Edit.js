import { Fragment } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import { useParams } from 'react-router-dom'
import { useTransferOrder } from '@data/use-transfer-order'
import TransferOrderForm from './form'
import { Spinner } from 'reactstrap'
import axios from './../../utility/axiosIsntance'


const Edit = () => {
    const { id } = useParams()
    const { data: transferOrder, isLoading } = useTransferOrder(id)

    if (isLoading) {
        return (
            <Fragment>
                <Breadcrumbs breadCrumbTitle='Transfer Orders' breadCrumbActive='Edit Transfer' />
                <div className="d-flex justify-content-center my-5">
                    <Spinner color="primary" />
                </div>
            </Fragment>
        )
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Transfer Orders' breadCrumbActive='Edit Transfer' />
            <TransferOrderForm transferOrder={transferOrder} />
        </Fragment>
    )
}

export default Edit
