import { lazy } from 'react'

const OrderRoutes = [
    {
        path: '/file/list',
        component: lazy(() => import('../../views/others/file/List'))
    },
    {
        path: '/file/add',
        component: lazy(() => import('../../views/others/file/Add'))
    },
    {
        path: '/file/edit/:id',
        component: lazy(() => import('../../views/others/file/Edit'))
    },
    {
        path: '/project/list',
        component: lazy(() => import('../../views/others/project/List'))
    },
    {
        path: '/project/add',
        component: lazy(() => import('../../views/others/project/Add'))
    },
    {
        path: '/project/edit/:id',
        component: lazy(() => import('../../views/others/project/Edit'))
    },

    {
        path: '/course/list',
        component: lazy(() => import('../../views/others/course/List'))
    },
    {
        path: '/course/add',
        component: lazy(() => import('../../views/others/course/Add'))
    },
    {
        path: '/course/edit/:id',
        component: lazy(() => import('../../views/others/course/Edit'))
    },

    {
        path: '/course/:id/student/list',
        component: lazy(() => import('../../views/others/course/student/List'))
    },
    {
        path: '/course/:id/student/add',
        component: lazy(() => import('../../views/others/course/student/Add'))
    },
    {
        path: '/course/student/:id/payment/list',
        component: lazy(() => import('../../views/others/course/payment/List'))
    },
    {
        path: '/course/student/:id/student/add',
        component: lazy(() => import('../../views/others/course/student/Add'))
    },

    // {
    //     path: '/course/:id/student/:id',
    //     component: lazy(() => import('../../views/others/course/student/Edit'))
    // },

    {
        path: '/dept/list',
        component: lazy(() => import('../../views/others/dept/List'))
    },
    {
        path: '/dept/add',
        component: lazy(() => import('../../views/others/dept/Add'))
    },
    {
        path: '/dept/edit/:id',
        component: lazy(() => import('../../views/others/dept/Edit'))
    },

    {
        path: '/outlay/list',
        component: lazy(() => import('../../views/others/outlay/List'))
    },
    {
        path: '/outlay/add',
        component: lazy(() => import('../../views/others/outlay/Add'))
    },
    {
        path: '/outlay/edit/:id',
        component: lazy(() => import('../../views/others/outlay/Edit'))
    },

    {
        path: '/receipt/list',
        component: lazy(() => import('../../views/others/receipt/List'))
    },
    {
        path: '/receipt/add',
        component: lazy(() => import('../../views/others/receipt/Add'))
    },
    {
        path: '/receipt/edit/:id',
        component: lazy(() => import('../../views/others/receipt/Edit'))
    },
    {
        path: '/receipt/print/:id',
        component: lazy(() => import('../../views/others/receipt/print/index')),
        layout: 'BlankLayout'
    }
]

export default OrderRoutes
