import { lazy } from 'react'

export default [
    {
        path: '/user/list',
        component: lazy(() => import('../../views/user/List'))
    },
    {
        path: '/user/add',
        component: lazy(() => import('../../views/user/Add'))
    },
    {
        path: '/user/edit/:id',
        component: lazy(() => import('../../views/user/edit/index'))
    }
]
