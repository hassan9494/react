import { lazy } from 'react'

const OrderRoutes = [
    {
        path: '/reports/order/print',
        layout: 'BlankLayout',
        component: lazy(() => import('../../views/reports/order/print'))
    },
    {
        path: '/reports/order',
        component: lazy(() => import('../../views/reports/order/index'))
    },

    {
        path: '/reports/product',
        component: lazy(() => import('../../views/reports/product/index'))
    }

]

export default OrderRoutes
