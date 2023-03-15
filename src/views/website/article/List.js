import { Fragment, useState } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useDatatable } from '@data/use-article'
import actions from './actions'
import Select from 'react-select'

const types = [
    {label: 'Service', value: 'SERVICE'},
    {label: 'Course', value: 'COURSE'},
    {label: 'Tutorial', value: 'TUTORIAL'}
]

const Articles = () => {

    const [type, setType] = useState()
    const [conditions, setConditions] = useState([])

    const onFilterChange = (val, col) => {
        setConditions(val ? [{ val, col }] : [])
        setType(val)
    }

    const Filters = () => (
        <Select
            isClearable={true}
            placeholder={'Type'}
            classNamePrefix='select'
            className='react-select w-25'
            options={types}
            value={types.filter(list => list?.value === (type))}
            onChange={(e) => onFilterChange(e?.value, 'type')}
        />
    )

    return (
        <Fragment>
            <Breadcrumbs breadCrumbTitle='Articles' breadCrumbActive='Articles' />
            <Datatable
                add='/article/add'
                useDatatable={useDatatable}
                actions={actions}
                filterBar={<Filters />}
                conditions={conditions}
                columns={[
                    {
                        name: 'Order',
                        selector: 'order',
                        sortable: true
                    },
                    {
                        name: 'Title',
                        selector: 'title',
                        sortable: true,
                        minWidth: '225px'
                    },
                    {
                        name: 'Type',
                        selector: 'type',
                        sortable: true
                    }
                ]}
            />
        </Fragment>
    )
}

export default Articles
