import {Fragment, useState} from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import Datatable from '@components/datatable'
import { useSubCategoryDatatable, useParentCategories } from '@data/use-category'
import actions from './actions'
import Avatar from "../../@core/components/avatar"
import ability from "../../configs/acl/ability"
import Select from "react-select"
import { selectThemeColors } from '@utils'


const shippingStatusClasses = {
    WAITING: 'light-warning',
    SHIPPED: 'light-info',
    DELIVERED: 'light-success'
}
export default () => {
    const { data: categories } = useParentCategories()
    const categoriesSelect = categories.map(
        e => ({
            value: e.id,
            label: e.title
        })
    )
    const canAddCategory = ability.can('read', 'category_add')

    const [type, setType] = useState(false)

    const [conditions, setConditions] = useState([])

    const onFilterChange = (val, col) => {
        const updated = conditions.filter(e => e.col !== col)
        if (val !== null && val !== undefined) {
            updated.push({val, col})
            setConditions(updated)
        }
        setType(val)
    }

    const Filters = () => (
        <Select
            theme={selectThemeColors}
            classNamePrefix='select'
            className='react-select w-25'
            options={categoriesSelect}
            value={categoriesSelect.filter(list => list.value === (type))}
            onChange={(e) => onFilterChange(e?.value, 'parent')}
        />
    )
    return (
        <Fragment>
        <Breadcrumbs breadCrumbTitle='Sub Categories' breadCrumbActive='Sub Categories'/>
        <Datatable
            add={canAddCategory ? '/sub-category/add' : null}
            useDatatable={useSubCategoryDatatable}
            actions={actions}
            conditions={conditions}
            filterBar={<Filters/>}
            columns={[
                {
                    name: 'ID',
                    selector: 'id',
                    sortable: true,
                    minWidth: '100px'
                },
                {
                    name: 'Name',
                    selector: 'title',
                    sortable: true,
                    minWidth: '300px',
                    cell: row => (
                        <div>
                            <Avatar img={row.image} className={"mr-2"}/>
                            <a className='text-dark' href={``} target='_blank'>{row.title}</a>
                        </div>
                    )
                },
                {
                    name: 'Slug',
                    selector: 'slug',
                    sortable: true,
                    minWidth: '250px'
                },
                {
                    name: 'Order',
                    selector: 'order',
                    sortable: true,
                    minWidth: '100px'
                },
                {
                    name: 'Parent',
                    selector: 'parent.title',
                    sortable: true,
                    minWidth: '250px'
                }
            ]}
        />
    </Fragment>
    )


}
