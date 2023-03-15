import { lazy } from 'react'

export default [
    {
        path: '/settings/mailer',
        component: lazy(() => import('../../views/settings/mailer'))
    }
]
