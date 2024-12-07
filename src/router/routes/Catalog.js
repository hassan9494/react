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
        path: '/brand/list',
        component: lazy(() => import('../../views/brand/List')),
        meta:{
            action:'read',
            resource:'brand_list_view'
        }
    },
    {
        path: '/source/list',
        component: lazy(() => import('../../views/source/List')),
        meta:{
            action:'read',
            resource:'source_list_view'
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
        path: '/sub-category/add',
        component: lazy(() => import('../../views/sub-category/Add')),
        meta:{
            action:'read',
            resource:'category_add'
        }
    },
    {
        path: '/brand/add',
        component: lazy(() => import('../../views/brand/Add')),
        meta:{
            action:'read',
            resource:'brand_add'
        }
    },
    {
        path: '/source/add',
        component: lazy(() => import('../../views/source/Add')),
        meta:{
            action:'read',
            resource:'source_add'
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
        path: '/sub-category/edit/:id',
        component: lazy(() => import('../../views/sub-category/Edit')),
        meta:{
            action:'read',
            resource:'category_edit'
        }
    },
    {
        path: '/brand/edit/:id',
        component: lazy(() => import('../../views/brand/Edit')),
        meta:{
            action:'read',
            resource:'brand_edit'
        }
    },
    {
        path: '/source/edit/:id',
        component: lazy(() => import('../../views/source/Edit')),
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
        path: '/product_variants/list',
        component: lazy(() => import('../../views/product-variants/List')),
        exact: true,
        meta:{
            action:'read',
            resource:'product_variants_list_view'
        }
    },
    {
        path: '/product_variants/show/:id',
        component: lazy(() => import('../../views/product-variants/ColorList')),
        exact: true,
        meta:{
            action:'read',
            resource:'product_variants_list_view'
        }
    },
    {
        path: '/product_variants/add/:id',
        component: lazy(() => import('../../views/product-variants/Add')),
        exact: true,
        meta:{
            action:'read',
            resource:'product_variants_list_view'
        }
    },
    {
        path: '/product_variants/edit/:product_id/:id',
        component: lazy(() => import('../../views/product-variants/Edit')),
        exact: true,
        meta:{
            action:'read',
            resource:'product_variants_list_view'
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
        path: '/stock',
        component: lazy(() => import('../../views/stock2/List')),
        meta:{
            action:'read',
            resource:'stock2_list_view'
        }
    },
    {
        path: '/stock2',
        component: lazy(() => import('../../views/stock3/List')),
        meta:{
            action:'read',
            resource:'stock2_list_view'
        }
    },
    {
        path: '/invoice/list',
        component: lazy(() => import('../../views/invoice/List')),
        meta:{
            action:'read',
            resource:'invoice_list_view'
        }
    },
    {
        path: '/invoice/create',
        component: lazy(() => import('../../views/invoice/create/index')),
        meta:{
            action:'read',
            resource:'invoice_add'
        }
    },
    {
        path: '/invoice/edit/:id',
        component: lazy(() => import('../../views/invoice/edit/index')),
        meta:{
            action:'read',
            resource:'invoice_add'
        }
    }

]

export default CatalogRoutes
