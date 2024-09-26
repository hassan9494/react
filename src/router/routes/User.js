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
        path: '/employee/list',
        component: lazy(() => import('../../views/employee/List')),
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
        path: '/employee/add',
        component: lazy(() => import('../../views/employee/Add')),
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
    },
    {
        path: '/employee/edit/:id',
        component: lazy(() => import('../../views/employee/edit/index')),
        meta:{
            action:'read',
            resource:'user_edit'
        }
    }
]
