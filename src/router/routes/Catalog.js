import { lazy } from 'react'

const CatalogRoutes = [
    {
        path: '/category/list',
        component: lazy(() => import('../../views/category/List'))
    },
    {
        path: '/sub-category/list',
        component: lazy(() => import('../../views/sub-category/List'))
    },
    {
        path: '/category/add',
        component: lazy(() => import('../../views/category/Add'))
    },
    {
        path: '/category/edit/:id',
        component: lazy(() => import('../../views/category/Edit'))
    },
    {
        path: '/product/list',
        component: lazy(() => import('../../views/product/List')),
        exact: true
    },
    {
        path: '/product/add',
        component: lazy(() => import('../../views/product/Add'))
    },
    {
        path: '/product/edit/:id',
        component: lazy(() => import('../../views/product/Edit'))
    },
    {
        path: '/stock',
        component: lazy(() => import('../../views/stock/List'))
    }
]

export default CatalogRoutes
