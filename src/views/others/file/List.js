import { Fragment } from 'react'
import { Button } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-file'
import actions from './actions'
import { toast } from "react-toastify"
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Copy as CopyIcon, Link as LinkIcon } from 'react-feather'
import ability from "../../../configs/acl/ability"

const canAddFile = ability.can('read', 'file_add')
const Tables = () => (
    <Fragment>
        <Breadcrumbs breadCrumbTitle='Files' breadCrumbActive='Files' />
        <Datatable
            add={canAddFile ? '/file/add' : null}
            useDatatable={useDatatable}
            actions={actions}
            columns={[
                {
                    name: 'ID',
                    selector: 'id',
                    sortable: true,
                    width: '150px'
                },
                {
                    name: 'Name',
                    selector: 'name',
                    sortable: true,
                    width: '350px'
                },
                {
                    name: 'Link',
                    selector: 'link',
                    sortable: false,
                    minWidth: '225px',
                    cell: row => (
                        <>
                            <CopyToClipboard text={row.link} onCopy={() => toast.success(row.link)}>
                                <CopyIcon className='cursor-pointer' size={20} />
                            </CopyToClipboard>
                            <a href={row.link} target='_blank' className='text-dark'>
                                <LinkIcon className='cursor-pointer mx-1' size={20} />
                            </a>
                            { row.link }
                        </>
                    )
                }
            ]}
        />
    </Fragment>
)

export default Tables
