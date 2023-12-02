import { lazy } from 'react'

const OrderRoutes = [
    {
        path: '/order/create/:id',
        component: lazy(() => import('../../views/order/create/index')),
        meta:{
            action:'read',
            resource:'order_reorder'
        }
    },
    {
        path: '/order/create',
        component: lazy(() => import('../../views/order/create/index')),
        meta:{
            action:'read',
            resource:'order_add'
        }
    },
    {
        path: '/order/offer',
        component: lazy(() => import('../../views/order/list/Offer')),
        meta:{
            action:'read',
            resource:'offer_order_list_view'
        }
    },
    {
        path: '/order/pending',
        component: lazy(() => import('../../views/order/list/Pending')),
        meta:{
            action:'read',
            resource:'pending_order_list_view'
        }
    },
    {
        path: '/order/processing',
        component: lazy(() => import('../../views/order/list/Processing')),
        meta:{
            action:'read',
            resource:'processing_order_list_view'
        }
    },
    {
        path: '/order/delivery',
        component: lazy(() => import('../../views/order/list/Delivery')),
        meta:{
            action:'read',
            resource:'delivery_order_list_view'
        }
    },
    {
        path: '/order/completed',
        component: lazy(() => import('../../views/order/list/Completed')),
        meta:{
            action:'read',
            resource:'completed_order_list_view'
        }
    },
    {
        path: '/order/returned',
        component: lazy(() => import('../../views/order/list/Returned')),
        meta:{
            action:'read',
            resource:'returned_order_list_view'
        }
    },
    {
        path: '/order/deleted',
        component: lazy(() => import('../../views/order/list/Deleted')),
        meta:{
            action:'read',
            resource:'deleted_order_list_view'
        }
    },
    {
        path: '/order/edit/:id',
        component: lazy(() => import('../../views/order/edit/index')),
        meta:{
            action:'read',
            resource:'order_edit'
        }
    },
    {
        path: '/order/print/:id',
        layout: 'BlankLayout',
        component: lazy(() => import('../../views/order/print/index')),
        meta:{
            action:'read',
            resource:'order_print'
        }
    }
]

export default OrderRoutes
