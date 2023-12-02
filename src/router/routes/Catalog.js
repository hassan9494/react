import { lazy } from 'react'

const CatalogRoutes = [
    {
        path: '/category/list',
        component: lazy(() => import('../../views/category/List')),
        meta:{
            action:'read',
            resource:'category_list_view'
        }
    },
    {
        path: '/sub-category/list',
        component: lazy(() => import('../../views/sub-category/List')),
        meta:{
            action:'read',
            resource:'sub_category_list_view'
        }
    },
    {
        path: '/category/add',
        component: lazy(() => import('../../views/category/Add')),
        meta:{
            action:'read',
            resource:'category_add'
        }
    },
    {
        path: '/category/edit/:id',
        component: lazy(() => import('../../views/category/Edit')),
        meta:{
            action:'read',
            resource:'category_edit'
        }
    },
    {
        path: '/product/list',
        component: lazy(() => import('../../views/product/List')),
        exact: true,
        meta:{
            action:'read',
            resource:'product_list_view'
        }
    },
    {
        path: '/product/add',
        component: lazy(() => import('../../views/product/Add')),
        meta:{
            action:'read',
            resource:'product_add'
        }
    },
    {
        path: '/product/edit/:id',
        component: lazy(() => import('../../views/product/Edit')),
        meta:{
            action:'read',
            resource:'product_edit'
        }
    },
    {
        path: '/stocks',
        component: lazy(() => import('../../views/stock/List')),
        meta:{
            action:'read',
            resource:'stock_list_view'
        }
    },
    {
        path: '/stock2',
        component: lazy(() => import('../../views/stock2/List')),
        meta:{
            action:'read',
            resource:'stock2_list_view'
        }
    }
]

export default CatalogRoutes
