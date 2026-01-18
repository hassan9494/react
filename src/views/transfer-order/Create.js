// src/views/transfer-order/Create.js
import { Fragment } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import CreateTransferOrder from './create/index'

const Create = () => {
    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Transfer Orders' breadCrumbActive='Create Transfer' />
            <CreateTransferOrder />
        </Fragment>
    )
}

export default Create