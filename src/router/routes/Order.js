import {lazy} from 'react'

const OrderRoutes = [
    {
        path: '/order/create/:id',
        component: lazy(() => import('../../views/order/create/index')),
        meta: {
            action: 'read',
            resource: 'order_reorder'
        }
    },
    {
        path: '/order/create-price-offer',
        component: lazy(() => import('../../views/order/create_price_offer/index')),
        meta: {
            action: 'read',
            resource: 'order_add'
        }
    },
    {
        path: '/order/create',
        component: lazy(() => import('../../views/order/create/index')),
        meta: {
            action: 'read',
            resource: 'order_add'
        }
    },
    {
        path: '/return-order/create',
        component: lazy(() => import('../../views/order/create-return/index')),
        meta: {
            action: 'read',
            resource: 'order_add'
        }
    },
    {
        path: '/order/offer',
        component: lazy(() => import('../../views/order/list/Offer')),
        meta: {
            action: 'read',
            resource: 'offer_order_list_view'
        }
    },
    {
        path: '/order/all',
        component: lazy(() => import('../../views/order/list/All')),
        meta: {
            action: 'read',
            resource: 'all_order_list_view'
        }
    },
    {
        path: '/order/pending',
        component: lazy(() => import('../../views/order/list/Pending')),
        meta: {
            action: 'read',
            resource: 'pending_order_list_view'
        }
    },
    {
        path: '/order/pendings',
        component: lazy(() => import('../../views/order/list/Pendings')),
        meta: {
            action: 'read',
            resource: 'pending_order_list_view'
        }
    },
    {
        path: '/order/processing',
        component: lazy(() => import('../../views/order/list/Processing')),
        meta: {
            action: 'read',
            resource: 'processing_order_list_view'
        }
    },
    {
        path: '/order/delivery',
        component: lazy(() => import('../../views/order/list/Delivery')),
        meta: {
            action: 'read',
            resource: 'delivery_order_list_view'
        }
    },
    {
        path: '/order/fatoraPending',
        component: lazy(() => import('../../views/order/list/FatoraPending')),
        meta: {
            action: 'read',
            resource: 'migrate_completed_order'
        }
    },
    {
        path: '/order/completed',
        component: lazy(() => import('../../views/order/list/Completed')),
        meta: {
            action: 'read',
            resource: 'completed_order_list_view'
        }
    },
    {
        path: '/order/returned',
        component: lazy(() => import('../../views/order/list/Returned')),
        meta: {
            action: 'read',
            resource: 'returned_order_list_view'
        }
    },
    {
        path: '/order/deleted',
        component: lazy(() => import('../../views/order/list/Deleted')),
        meta: {
            action: 'read',
            resource: 'deleted_order_list_view'
        }
    },
    {
        path: '/order/edit/:id',
        component: lazy(() => import('../../views/order/edit/index')),
        meta: {
            action: 'read',
            resource: 'order_edit'
        }
    },
    {
        path: '/return-order/edit/:id',
        component: lazy(() => import('../../views/order/edit-return/index')),
        meta: {
            action: 'read',
            resource: 'order_edit'
        }
    },
    {
        path: '/order/print/:id',
        layout: 'BlankLayout',
        component: lazy(() => import('../../views/order/print/index')),
        meta: {
            action: 'read',
            resource: 'order_print'
        }
    },
    {
        path: '/return-order/print/:id',
        layout: 'BlankLayout',
        component: lazy(() => import('../../views/order/print/return')),
        meta: {
            action: 'read',
            resource: 'order_print'
        }
    },
    {
        path: '/order/print-price-offer/:id',
        layout: 'BlankLayout',
        component: lazy(() => import('../../views/order/print/price_offer_print')),
        meta: {
            action: 'read',
            resource: 'order_print'
        }
    },
    {
        path: '/order/print-location/:id',
        layout: 'BlankLayout',
        component: lazy(() => import('../../views/order/print/location')),
        meta: {
            action: 'read',
            resource: 'order_print'
        }
    },
    {
        path: '/order/print-picture/:id',
        layout: 'BlankLayout',
        component: lazy(() => import('../../views/order/print/picture')),
        meta: {
            action: 'read',
            resource: 'order_print'
        }
    },
    {
        path: '/order/print-prepare/:id',
        layout: 'BlankLayout',
        component: lazy(() => import('../../views/order/print/prepare')),
        meta: {
            action: 'read',
            resource: 'order_print'
        }
    },
    {
        path: '/order/print-receipt/:id',
        layout: 'BlankLayout',
        component: lazy(() => import('../../views/order/print/receipt')),
        meta: {
            action: 'read',
            resource: 'order_print'
        }
    },
    {
        path: '/order/details/:id',
        component: lazy(() => import('../../views/order/Details')),
        exact: true,
        meta: {
            resource: 'order_details',
            action: 'read'
        }

    }
]

export default OrderRoutes
