import { lazy } from 'react'

export default [
    {
        path: '/coupon/list',
        component: lazy(() => import('../../views/website/coupon/List')),
        meta:{
            action:'read',
            resource:'coupon_list_view'
        }
    },
    {
        path: '/coupon/add',
        component: lazy(() => import('../../views/website/coupon/Add')),
        meta:{
            action:'read',
            resource:'coupon_add'
        }
    },
    {
        path: '/coupon/edit/:id',
        component: lazy(() => import('../../views/website/coupon/Edit')),
        meta:{
            action:'read',
            resource:'coupon_edit'
        }
    },
    {
        path: '/article/list',
        component: lazy(() => import('../../views/website/article/List')),
        meta:{
            action:'read',
            resource:'article_list_view'
        }
    },
    {
        path: '/article/add',
        component: lazy(() => import('../../views/website/article/Add')),
        meta:{
            action:'read',
            resource:'article_add'
        }
    },
    {
        path: '/article/edit/:id',
        component: lazy(() => import('../../views/website/article/Edit')),
        meta:{
            action:'read',
            resource:'article_edit'
        }
    },

    {
        path: '/slide/list',
        component: lazy(() => import('../../views/website/slide/List')),
        meta:{
            action:'read',
            resource:'slide_list_view'
        }
    },
    {
        path: '/slide/add',
        component: lazy(() => import('../../views/website/slide/Add')),
        meta:{
            action:'read',
            resource:'slide_add'
        }
    },
    {
        path: '/slide/edit/:id',
        component: lazy(() => import('../../views/website/slide/Edit')),
        meta:{
            action:'read',
            resource:'slide_edit'
        }
    },

    {
        path: '/promotion/list',
        component: lazy(() => import('../../views/website/promotion/List')),
        meta:{
            action:'read',
            resource:'promotion_list_view'
        }
    },
    {
        path: '/promotion/add',
        component: lazy(() => import('../../views/website/promotion/Add')),
        meta:{
            action:'read',
            resource:'promotion_add'
        }
    },
    {
        path: '/promotion/edit/:id',
        component: lazy(() => import('../../views/website/promotion/Edit')),
        meta:{
            action:'read',
            resource:'promotion_edit'
        }
    },

    {
        path: '/links/list',
        component: lazy(() => import('../../views/website/links/List')),
        meta:{
            action:'read',
            resource:'links_list_view'
        }
    },
    {
        path: '/links/edit/:id',
        component: lazy(() => import('../../views/website/links/Edit')),
        meta:{
            action:'read',
            resource:'links_list_view'
        }
    }
]
