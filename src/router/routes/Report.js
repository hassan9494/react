import { lazy } from 'react'

const OrderRoutes = [
    {
        path: '/reports/order/print',
        layout: 'BlankLayout',
        component: lazy(() => import('../../views/reports/order/print')),
        meta:{
            action:'read',
            resource:'order_report_print'
        }
    },
    {
        path: '/reports/order',
        component: lazy(() => import('../../views/reports/order/index')),
        meta:{
            action:'read',
            resource:'order_report'
        }
    },

    {
        path: '/reports/product',
        component: lazy(() => import('../../views/reports/product/index')),
        meta:{
            action:'read',
            resource:'product_report'
        }
    },

    {
        path: '/reports/stocks',
        component: lazy(() => import('../../views/reports/stocks/index')),
        meta:{
            action:'read',
            resource:'stock_report'
        }
    },

    {
        path: '/reports/needs',
        component: lazy(() => import('../../views/reports/needs/index')),
        meta:{
            action:'read',
            resource:'need_report'
        }
    },

    {
        path: '/reports/outlays/print',
        component: lazy(() => import('../../views/reports/outlays/print')),
        meta:{
            action:'read',
            resource:'outlay_report_print'
        }
    },

    {
        path: '/reports/outlays',
        component: lazy(() => import('../../views/reports/outlays/index')),
        meta:{
            action:'read',
            resource:'outlay_report'
        }
    },

    {
        path: '/reports/purchases',
        component: lazy(() => import('../../views/reports/purchases/index')),
        meta:{
            action:'read',
            resource:'purchases_report'
        }
    },

    {
        path: '/reports/depts',
        component: lazy(() => import('../../views/reports/depts/index')),
        meta:{
            action:'read',
            resource:'debts_report'
        }
    },

    {
        path: '/reports/zemam',
        component: lazy(() => import('../../views/reports/zemam/index')),
        meta:{
            action:'read',
            resource:'zemam_report'
        }
    },

    {
        path: '/reports/customs-statement',
        component: lazy(() => import('../../views/reports/customs-statement/index')),
        meta:{
            action:'read',
            resource:'custom_statement_report'
        }
    },

    {
        path: '/reports/product-sales/:id',
        component: lazy(() => import('../../views/reports/product-sales/sales')),
        meta:{
            action:'read',
            resource:'product_sale_per_product_report'
        }
    },

    {
        path: '/reports/product-sales',
        component: lazy(() => import('../../views/reports/product-sales/index')),
        meta:{
            action:'read',
            resource:'product_sale_report'
        }
    },

    {
        path: '/reports/exempt-invoices',
        component: lazy(() => import('../../views/reports/exempt-invoices/index')),
        meta:{
            action:'read',
            resource:'exempt_invoice_report'
        }
    },

    {
        path: '/reports/delivery-invoice',
        component: lazy(() => import('../../views/reports/delivery-invoice/index')),
        meta:{
            action:'read',
            resource:'delivery_invoice_report'
        }
    }

]

export default OrderRoutes
