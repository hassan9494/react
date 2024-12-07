import { Fragment } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-links'
import actions from './actions'
import ability from "../../../configs/acl/ability"

const canAddPromotion = ability.can('read', 'promotion_add')
const Tables = () => (
    <Fragment>
        <Breadcrumbs breadCrumbTitle='Social Links' breadCrumbActive='Social Links' />
        <Datatable
            useDatatable={useDatatable}
            actions={actions}
            columns={[
                {
                    name: 'Location',
                    selector: 'location',
                    sortable: true,
                    minWidth: '225px'
                },
                {
                    name: 'Email',
                    selector: 'email',
                    sortable: true,
                    minWidth: '225px'
                },
                {
                    name: 'Facebook',
                    selector: 'facebook',
                    sortable: true,
                    minWidth: '225px'
                },
                {
                    name: 'Instagram',
                    selector: 'instagram',
                    sortable: true,
                    minWidth: '225px'
                },
                {
                    name: 'Telegram',
                    selector: 'telegram',
                    sortable: true,
                    minWidth: '225px'
                },
                {
                    name: 'Whatsapp',
                    selector: 'whatsapp',
                    sortable: true,
                    minWidth: '225px'
                },
                {
                    name: 'Youtube',
                    selector: 'youtube',
                    sortable: true,
                    minWidth: '225px'
                },
                {
                    name: 'Call',
                    selector: 'call',
                    sortable: true,
                    minWidth: '225px'
                }
            ]}
        />
    </Fragment>
)

export default Tables
