import { lazy } from 'react'

const FinancialRoutes = [
    {
        path: '/payment_method/list',
        component: lazy(() => import('../../views/financial/payment_method/List')),
        meta:{
            action:'read',
            resource:'file_list_view'
        }
    },
    {
        path: '/payment_method/add',
        component: lazy(() => import('../../views/financial/payment_method/Add')),
        meta:{
            action:'read',
            resource:'file_add'
        }
    },
    {
        path: '/payment_method/edit/:id',
        component: lazy(() => import('../../views/financial/payment_method/Edit')),
        meta:{
            action:'read',
            resource:'file_edit'
        }
    },
    {
        path: '/transaction/list',
        component: lazy(() => import('../../views/financial/transaction/List')),
        meta:{
            action:'read',
            resource:'transaction_list_view'
        }
    },
    {
        path: '/refund/list',
        component: lazy(() => import('../../views/financial/refund/List')),
        meta:{
            action:'read',
            resource:'transaction_list_view'
        }
    },
    {
        path: '/deleted/list',
        component: lazy(() => import('../../views/financial/deleted/List')),
        meta:{
            action:'read',
            resource:'transaction_list_view'
        }
    },
    {
        path: '/withdraw/list',
        component: lazy(() => import('../../views/financial/withdraw/List')),
        meta:{
            action:'read',
            resource:'transaction_list_view'
        }
    },
    {
        path: '/financial/list',
        component: lazy(() => import('../../views/financial/report/index')),
        meta:{
            action:'read',
            resource:'transaction_list_view'
        }
    },

    {
        path: '/withdraw/edit/:id',
        component: lazy(() => import('../../views/financial/withdraw/Edit')),
        meta:{
            action:'read',
            resource:'category_edit'
        }
    }
]

export default FinancialRoutes
