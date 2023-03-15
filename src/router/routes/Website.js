import { lazy } from 'react'

export default [
    {
        path: '/coupon/list',
        component: lazy(() => import('../../views/website/coupon/List'))
    },
    {
        path: '/coupon/add',
        component: lazy(() => import('../../views/website/coupon/Add'))
    },
    {
        path: '/coupon/edit/:id',
        component: lazy(() => import('../../views/website/coupon/Edit'))
    },
    {
        path: '/article/list',
        component: lazy(() => import('../../views/website/article/List'))
    },
    {
        path: '/article/add',
        component: lazy(() => import('../../views/website/article/Add'))
    },
    {
        path: '/article/edit/:id',
        component: lazy(() => import('../../views/website/article/Edit'))
    },

    {
        path: '/slide/list',
        component: lazy(() => import('../../views/website/slide/List'))
    },
    {
        path: '/slide/add',
        component: lazy(() => import('../../views/website/slide/Add'))
    },
    {
        path: '/slide/edit/:id',
        component: lazy(() => import('../../views/website/slide/Edit'))
    },

    {
        path: '/promotion/list',
        component: lazy(() => import('../../views/website/promotion/List'))
    },
    {
        path: '/promotion/add',
        component: lazy(() => import('../../views/website/promotion/Add'))
    },
    {
        path: '/promotion/edit/:id',
        component: lazy(() => import('../../views/website/promotion/Edit'))
    }
]
