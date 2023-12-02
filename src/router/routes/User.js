import { lazy } from 'react'

export default [
    {
        path: '/user/list',
        component: lazy(() => import('../../views/user/List')),
        meta:{
            action:'read',
            resource:'user_list_view'
        }
    },
    {
        path: '/user/add',
        component: lazy(() => import('../../views/user/Add')),
        meta:{
            action:'read',
            resource:'user_add'
        }
    },
    {
        path: '/user/edit/:id',
        component: lazy(() => import('../../views/user/edit/index')),
        meta:{
            action:'read',
            resource:'user_edit'
        }
    }
]
