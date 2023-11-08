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
    },

    {
        path: '/reports/stocks',
        component: lazy(() => import('../../views/reports/stocks/index'))
    },

    {
        path: '/reports/needs',
        component: lazy(() => import('../../views/reports/needs/index'))
    },

    {
        path: '/reports/outlays/print',
        component: lazy(() => import('../../views/reports/outlays/print'))
    },

    {
        path: '/reports/outlays',
        component: lazy(() => import('../../views/reports/outlays/index'))
    },

    {
        path: '/reports/purchases',
        component: lazy(() => import('../../views/reports/purchases/index'))
    },

    {
        path: '/reports/depts',
        component: lazy(() => import('../../views/reports/depts/index'))
    },

    {
        path: '/reports/zemam',
        component: lazy(() => import('../../views/reports/zemam/index'))
    },

    {
        path: '/reports/customs-statement',
        component: lazy(() => import('../../views/reports/customs-statement/index'))
    },

    {
        path: '/reports/product-sales',
        component: lazy(() => import('../../views/reports/product-sales/index'))
    },

    {
        path: '/reports/exempt-invoices',
        component: lazy(() => import('../../views/reports/exempt-invoices/index'))
    },

    {
        path: '/reports/delivery-invoice',
        component: lazy(() => import('../../views/reports/delivery-invoice/index'))
    }

]

export default OrderRoutes
