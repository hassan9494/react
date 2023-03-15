import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-user'
import actions from './actions'
import { Badge } from 'reactstrap'

const List = () => (
    <>
        <Breadcrumbs breadCrumbTitle='Users' breadCrumbActive='Users' />
        <Datatable
            useDatatable={useDatatable}
            actions={actions}
            columns={[
                {
                    name: 'ID',
                    selector: 'id',
                    sortable: true,
                    width: '100px'
                },
                {
                    name: 'Name',
                    selector: 'name',
                    sortable: true,
                    minWidth: '225px'
                },
                {
                    name: 'Status',
                    selector: 'status',
                    sortable: true,
                    minWidth: '225px',
                    cell: row => (
                        <Badge className='text-capitalize' color={row.status ? 'light-success' : 'light-warning'} pill>
                            {row.status ? 'active' : 'inactive'}
                        </Badge>
                    )
                },
                {
                    name: 'Roles',
                    selector: 'role',
                    sortable: false,
                    cell: row => (
                        <>
                            {
                                row.roles.map(e => (
                                        <Badge className='text-capitalize light-success' pill key={e.id}>
                                            { e.name }
                                        </Badge>
                                    )
                                )

                            }
                        </>

                    )
                }
            ]}
        />
    </>
)

export default List
