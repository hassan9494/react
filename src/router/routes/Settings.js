import { lazy } from 'react'

export default [
    {
        path: '/settings/mailer',
        component: lazy(() => import('../../views/settings/email/mailer')),
        meta:{
            action:'read',
            resource:'mailer_setting'
        }
    },
    {
        path: '/settings/send_email',
        component: lazy(() => import('../../views/settings/email/send_email')),
        meta:{
            action:'read',
            resource:'mailer_setting'
        }
    },
    {
        path: '/settings/sms',
        component: lazy(() => import('../../views/settings/sms/sms')),
        meta:{
            action:'read',
            resource:'mailer_setting'
        }
    },
    {
        path: '/settings/send_sms',
        component: lazy(() => import('../../views/settings/sms/send_sms')),
        meta:{
            action:'read',
            resource:'mailer_setting'
        }
    },
    {
        path: '/settings/tags',
        component: lazy(() => import('../../views/settings/tags/List')),
        meta:{
            action:'read',
            resource:'mailer_setting'
        }
    },
    {
        path: '/settings/tag/add',
        component: lazy(() => import('../../views/settings/tags/Add')),
        meta:{
            action:'read',
            resource:'mailer_setting'
        }
    },
    {
        path: '/settings/tag/edit/:id',
        component: lazy(() => import('../../views/settings/tags/Edit')),
        meta:{
            action:'read',
            resource:'mailer_setting'
        }
    }
]
