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
        path: '/location/list',
        component: lazy(() => import('../../views/location/List')),
        meta:{
            action:'read',
            resource:'location_list_view'
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
        path: '/location/add',
        component: lazy(() => import('../../views/location/Add')),
        meta:{
            action:'read',
            resource:'location_add'
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
        path: '/location/edit/:id',
        component: lazy(() => import('../../views/location/Edit')),
        meta:{
            action:'read',
            resource:'location_edit'
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
        path: '/kit_product/list',
        component: lazy(() => import('../../views/product/kit')),
        exact: true,
        meta:{
            action:'read',
            resource:'product_list_view'
        }
    },
    {
        path: '/delete-product/list',
        component: lazy(() => import('../../views/product/Deleted')),
        exact: true,
        meta:{
            action:'read',
            resource:'deleted_product_list_view'
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
        path: '/product_variants_sun/list',
        component: lazy(() => import('../../views/product-variants/Sun')),
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
        path: '/transfer-order/list',
        component: lazy(() => import('../../views/transfer-order/List')),
        meta:{
            action:'read',
            resource:'transfer_order_list_view'
        }
    },
    {
        path: '/transfer-order/create',
        component: lazy(() => import('../../views/transfer-order/create/index')),
        meta:{
            action:'read',
            resource:'transfer_order_create'
        }
    },
    {
        path: '/transfer-order/edit/:id',
        component: lazy(() => import('../../views/transfer-order/edit/index')),
        meta:{
            action:'read',
            resource:'transfer_order_edit'
        }
    },
    {
        path: '/transfer-order/details/:id',
        component: lazy(() => import('../../views/transfer-order/Details')),
        meta:{
            action:'read',
            resource:'transfer_order_details'
        }
    },
    {
        path: '/transfer-order/print/:id',
        component: lazy(() => import('../../views/transfer-order/PrintTransferOrder')),
        layout: 'BlankLayout',
        meta:{
            action:'read',
            resource:'transfer_order_print'
        }
    },
    {
        path: '/stock-adjustment/approve',
        component: lazy(() => import('../../views/stock-adjustment/Approve')),
        meta: {
            action: 'read',
            resource: 'stock_adjustment_approve'
        }
    },
    {
        path: '/stock-adjustment/history',
        component: lazy(() => import('../../views/stock-adjustment/History')),
        meta: {
            action: 'read',
            resource: 'stock_adjustment_history_view'
        }
    },
    {
        path: '/stock-adjustment',
        component: lazy(() => import('../../views/stock-adjustment/Request')),
        meta: {
            action: 'read',
            resource: 'stock_adjustment_request'
        }
    },
    {
        path: '/stock1',
        component: lazy(() => import('../../views/stock1/List')),
        meta:{
            action:'read',
            resource:'stock_list_view'
        }
    },
    {
        path: '/stock',
        component: lazy(() => import('../../views/stock/List')),
        meta:{
            action:'read',
            resource:'stock2_list_view'
        }
    },
    {
        path: '/stock2',
        component: lazy(() => import('../../views/stock2/List')),
        meta:{
            action:'read',
            resource:'stock2_list_view'
        }
    },
    {
        path: '/stock3',
        component: lazy(() => import('../../views/stock3/List')),
        meta:{
            action:'read',
            resource:'stock3_list_view'
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
