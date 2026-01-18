import { lazy } from 'react'

const OrderRoutes = [
    {
        path: '/file/list',
        component: lazy(() => import('../../views/others/file/List')),
        meta:{
            action:'read',
            resource:'file_list_view'
        }
    },
    {
        path: '/file/add',
        component: lazy(() => import('../../views/others/file/Add')),
        meta:{
            action:'read',
            resource:'file_add'
        }
    },
    {
        path: '/file/edit/:id',
        component: lazy(() => import('../../views/others/file/Edit')),
        meta:{
            action:'read',
            resource:'file_edit'
        }
    },
    {
        path: '/project/list',
        component: lazy(() => import('../../views/others/project/List')),
        meta:{
            action:'read',
            resource:'project_list_view'
        }
    },
    {
        path: '/project/add',
        component: lazy(() => import('../../views/others/project/Add')),
        meta:{
            action:'read',
            resource:'project_add'
        }
    },
    {
        path: '/project/edit/:id',
        component: lazy(() => import('../../views/others/project/Edit')),
        meta:{
            action:'read',
            resource:'project_edit'
        }
    },

    {
        path: '/project/print/:id',
        layout: 'BlankLayout',
        component: lazy(() => import('../../views/others/project/print/index')),
        meta: {
            action: 'read',
            resource: 'project_edit'
        }
    },
    {
        path: '/course/list',
        component: lazy(() => import('../../views/others/course/List')),
        meta:{
            action:'read',
            resource:'course_list_view'
        }
    },
    {
        path: '/course/add',
        component: lazy(() => import('../../views/others/course/Add')),
        meta:{
            action:'read',
            resource:'course_add'
        }
    },
    {
        path: '/course/edit/:id',
        component: lazy(() => import('../../views/others/course/Edit')),
        meta:{
            action:'read',
            resource:'course_edit'
        }
    },

    {
        path: '/course/:id/student/list',
        component: lazy(() => import('../../views/others/course/student/List')),
        meta:{
            action:'read',
            resource:'course_student_list_view'
        }
    },
    {
        path: '/course/:id/student/add',
        component: lazy(() => import('../../views/others/course/student/Add')),
        meta:{
            action:'read',
            resource:'course_student_add'
        }
    },
    {
        path: '/course/student/:id/payment/list',
        component: lazy(() => import('../../views/others/course/payment/List')),
        meta:{
            action:'read',
            resource:'course_student_payment_list_view'
        }
    },
    {
        path: '/course/student/:id/student/add',
        component: lazy(() => import('../../views/others/course/student/Add')),
        meta:{
            action:'read',
            resource:'course_add_student'
        }
    },

    // {
    //     path: '/course/:id/student/:id',
    //     component: lazy(() => import('../../views/others/course/student/Edit')),
    //         meta:{
    //             action:'read',
    //             resource:'course_student_edit'
    //         }
    // },

    {
        path: '/dept/list',
        component: lazy(() => import('../../views/others/dept/List')),
        meta:{
            action:'read',
            resource:'dept_list_view'
        }
    },
    {
        path: '/dept/add',
        component: lazy(() => import('../../views/others/dept/Add')),
        meta:{
            action:'read',
            resource:'dept_add'
        }
    },
    {
        path: '/dept/edit/:id',
        component: lazy(() => import('../../views/others/dept/Edit')),
        meta:{
            action:'read',
            resource:'dept_edit'
        }
    },

    {
        path: '/outlay/list',
        component: lazy(() => import('../../views/others/outlay/List')),
        meta:{
            action:'read',
            resource:'outlay_list_view'
        }
    },
    {
        path: '/outlay/add',
        component: lazy(() => import('../../views/others/outlay/Add')),
        meta:{
            action:'read',
            resource:'outlay_add'
        }
    },
    {
        path: '/outlay/edit/:id',
        component: lazy(() => import('../../views/others/outlay/Edit')),
        meta:{
            action:'read',
            resource:'outlay_edit'
        }
    },

    {
        path: '/customs-statement/list',
        component: lazy(() => import('../../views/others/customs-statement/List')),
        meta:{
            action:'read',
            resource:'customs_statement_list_view'
        }
    },
    {
        path: '/customs-statement/add',
        component: lazy(() => import('../../views/others/customs-statement/Add')),
        meta:{
            action:'read',
            resource:'customs_statement_add'
        }
    },
    {
        path: '/customs-statement/edit/:id',
        component: lazy(() => import('../../views/others/customs-statement/Edit')),
        meta:{
            action:'read',
            resource:'customs_statement_edit'
        }
    },

    {
        path: '/receipt/list',
        component: lazy(() => import('../../views/others/receipt/List')),
        meta:{
            action:'read',
            resource:'receipt_list_view'
        }
    },
    {
        path: '/receipt/add',
        component: lazy(() => import('../../views/others/receipt/Add')),
        meta:{
            action:'read',
            resource:'receipt_add'
        }
    },
    {
        path: '/receipt/create/:id',
        component: lazy(() => import('../../views/others/receipt/CreateFromTransaction')),
        meta:{
            action:'read',
            resource:'receipt_add'
        }
    },
    {
        path: '/receipt/edit/:id',
        component: lazy(() => import('../../views/others/receipt/Edit')),
        meta:{
            action:'read',
            resource:'receipt_edit'
        }
    },
    {
        path: '/receipt/print/:id',
        component: lazy(() => import('../../views/others/receipt/print/index')),
        layout: 'BlankLayout',
        meta:{
            action:'read',
            resource:'receipt_print'
        }
    },

    {
        path: '/project-receipt/list',
        component: lazy(() => import('../../views/others/project-receipt/List')),
        meta:{
            action:'read',
            resource:'receipt_list_view'
        }
    },
    {
        path: '/project-receipt/add',
        component: lazy(() => import('../../views/others/project-receipt/Add')),
        meta:{
            action:'read',
            resource:'receipt_add'
        }
    },
    {
        path: '/project-receipt/create/:id',
        component: lazy(() => import('../../views/others/project-receipt/CreateFromTransaction')),
        meta:{
            action:'read',
            resource:'receipt_add'
        }
    },
    {
        path: '/project-receipt/edit/:id',
        component: lazy(() => import('../../views/others/project-receipt/Edit')),
        meta:{
            action:'read',
            resource:'receipt_edit'
        }
    },
    {
        path: '/project-receipt/print/:id',
        component: lazy(() => import('../../views/others/project-receipt/print/index')),
        layout: 'BlankLayout',
        meta:{
            action:'read',
            resource:'receipt_print'
        }
    }
]

export default OrderRoutes
