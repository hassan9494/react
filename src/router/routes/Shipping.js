import { lazy } from 'react'

export default [
    {
        path: '/city/list',
        component: lazy(() => import('../../views/shipping/city/List'))
    },
    {
        path: '/city/add',
        component: lazy(() => import('../../views/shipping/city/Add'))
    },
    {
        path: '/city/edit/:id',
        component: lazy(() => import('../../views/shipping/city/Edit'))
    },
    {
        path: '/shipping-provider/list',
        component: lazy(() => import('../../views/shipping/provider/List'))
    },
    {
        path: '/shipping-provider/add',
        component: lazy(() => import('../../views/shipping/provider/Add'))
    },
    {
        path: '/shipping-provider/edit/:id',
        component: lazy(() => import('../../views/shipping/provider/Edit'))
    }

]
