import { lazy } from 'react'

export default [
    {
        path: '/city/list',
        component: lazy(() => import('../../views/shipping/city/List')),
        meta:{
            action:'read',
            resource:'city_list_view'
        }
    },
    {
        path: '/city/add',
        component: lazy(() => import('../../views/shipping/city/Add')),
        meta:{
            action:'read',
            resource:'city_add'
        }
    },
    {
        path: '/city/edit/:id',
        component: lazy(() => import('../../views/shipping/city/Edit')),
        meta:{
            action:'read',
            resource:'city_edit'
        }
    },
    {
        path: '/shipping-provider/list',
        component: lazy(() => import('../../views/shipping/provider/List')),
        meta:{
            action:'read',
            resource:'shipping_provider_list_view'
        }
    },
    {
        path: '/shipping-provider/add',
        component: lazy(() => import('../../views/shipping/provider/Add')),
        meta:{
            action:'read',
            resource:'shipping_provider_add'
        }
    },
    {
        path: '/shipping-provider/edit/:id',
        component: lazy(() => import('../../views/shipping/provider/Edit')),
        meta:{
            action:'read',
            resource:'shipping_provider_edit'
        }
    }

]
