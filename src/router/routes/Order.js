import { lazy } from 'react'

const OrderRoutes = [
    {
        path: '/order/create/:id',
        component: lazy(() => import('../../views/order/create/index'))
    },
    {
        path: '/order/create',
        component: lazy(() => import('../../views/order/create/index'))
    },
    {
        path: '/order/offer',
        component: lazy(() => import('../../views/order/list/Offer'))
    },
    {
        path: '/order/pending',
        component: lazy(() => import('../../views/order/list/Pending'))
    },
    {
        path: '/order/processing',
        component: lazy(() => import('../../views/order/list/Processing'))
    },
    {
        path: '/order/delivery',
        component: lazy(() => import('../../views/order/list/Delivery'))
    },
    {
        path: '/order/completed',
        component: lazy(() => import('../../views/order/list/Completed'))
    },
    {
        path: '/order/returned',
        component: lazy(() => import('../../views/order/list/Returned'))
    },
    {
        path: '/order/deleted',
        component: lazy(() => import('../../views/order/list/Deleted'))
    },
    {
        path: '/order/edit/:id',
        component: lazy(() => import('../../views/order/edit/index'))
    },
    {
        path: '/order/print/:id',
        layout: 'BlankLayout',
        component: lazy(() => import('../../views/order/print/index'))
    }
]

export default OrderRoutes
