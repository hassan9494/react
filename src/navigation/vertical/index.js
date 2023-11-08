import { Home, Users, Box, Grid, Truck, Settings, Circle, Folder, Book, File, PieChart, ShoppingBag } from 'react-feather'

export default [
    {
        id: 'home',
        title: 'Home',
        icon: <Home size={20}/>,
        navLink: '/home'
    },
    {
        id: 'users',
        title: 'Users',
        icon: <Users size={20} />,
        children: [
            {
                id: 'customers',
                title: 'Customers',
                icon: <Circle size={12} />,
                navLink: '/user/list'
            }
        ]
    },
    {
        id: 'orders',
        title: 'Orders',
        icon: <Box size={20} />,
        badge: 'light-warning',
        children: [
            {
                id: 'offerOrders',
                title: 'Price Offer',
                icon: <Circle size={12} />,
                navLink: '/order/offer'
            },
            {
                id: 'pendingOrders',
                title: 'New Orders',
                icon: <Circle size={12} />,
                navLink: '/order/pending'
            },
            {
                id: 'processingOrders',
                title: 'Processing',
                icon: <Circle size={12} />,
                navLink: '/order/processing'
            },
            {
                id: 'deliveryOrders',
                title: 'Delivery',
                icon: <Circle size={12} />,
                navLink: '/order/delivery'
            },
            {
                id: 'completedOrders',
                title: 'Completed',
                icon: <Circle size={12} />,
                navLink: '/order/completed'
            },
            {
                id: 'returnedOrders',
                title: 'Returned',
                icon: <Circle size={12} />,
                navLink: '/order/returned'
            },
            {
                id: 'canceledOrders',
                title: 'Deleted',
                icon: <Circle size={12} />,
                navLink: '/order/deleted'
            }
        ]
    },
    {
        id: 'catalog',
        title: 'Catalog',
        icon: <Folder size={20} />,
        badge: 'light-warning',
        children: [
            {
                id: 'category',
                title: 'Categories',
                icon: <Circle size={12} />,
                navLink: '/category/list'
            },
            {
                id: 'product',
                title: 'Products',
                icon: <Circle size={12} />,
                navLink: '/product/list'
            },
            {
                id: 'stock',
                title: 'Stock',
                icon: <Circle size={12} />,
                navLink: '/stocks'
            },
            {
                id: 'stock2',
                title: 'Stock2',
                icon: <Circle size={12} />,
                navLink: '/stock2'
            }
        ]
    },
    {
        id: 'shipping',
        title: 'Shipping',
        icon: <Truck size={20} />,
        badge: 'light-warning',
        children: [
            {
                id: 'cities',
                title: 'Cities',
                icon: <Circle size={12} />,
                navLink: '/city/list'
            },
            {
                id: 'providers',
                title: 'Providers',
                icon: <Circle size={12} />,
                navLink: '/shipping-provider/list'
            }
        ]
    },
    {
        id: 'website',
        title: 'Website',
        icon: <ShoppingBag size={20} />,
        badge: 'light-warning',
        children: [
            {
                id: 'articles',
                title: 'Articles',
                icon: <Circle size={12} />,
                navLink: '/article/list'
            },
            {
                id: 'coupons',
                title: 'Coupons',
                icon: <Circle size={12} />,
                navLink: '/coupon/list'
            },
            {
                id: 'slides',
                title: 'Slides',
                icon: <Circle size={12} />,
                navLink: '/slide/list'
            },
            {
                id: 'promotions',
                title: 'Promotions',
                icon: <Circle size={12} />,
                navLink: '/promotion/list'
            }
        ]
    },
    {
        id: 'others',
        title: 'Others',
        icon: <Grid size={20} />,
        children: [
            {
                id: 'files',
                title: 'Files',
                icon: <File size={20} />,
                badge: 'light-warning',
                navLink: '/file/list'
            },
            {
                id: 'projects',
                title: 'Projects',
                icon: <Circle size={12} />,
                badge: 'light-warning',
                navLink: '/project/list'
            },
            {
                id: 'courses',
                title: 'Courses',
                icon: <Book size={20} />,
                badge: 'light-warning',
                navLink: '/course/list'
            },
            {
                id: 'receipts',
                title: 'Receipts',
                icon: <Circle size={12} />,
                navLink: '/receipt/list'
            },
            {
                id: 'depts',
                title: 'Depts',
                icon: <Circle size={12} />,
                navLink: '/dept/list'
            },
            {
                id: 'outlays',
                title: 'Outlays',
                icon: <Circle size={12} />,
                navLink: '/outlay/list'
            },
            {
                id: 'customsStatements',
                title: 'customs Statement',
                icon: <Circle size={12} />,
                navLink: '/customs-statement/list'
            }
        ]
    },
    {
        id: 'reports',
        title: 'Reports',
        icon: <PieChart size={20} />,
        badge: 'light-warning',
        children: [
            {
                id: 'reportsOrder',
                title: 'Orders',
                icon: <Circle size={12} />,
                navLink: '/reports/order'
            },
            {
                id: 'reportsProduct',
                title: 'Products',
                icon: <Circle size={12} />,
                navLink: '/reports/product'
            },
            // {
            //     id: 'reportsStock',
            //     title: 'stocks',
            //     icon: <Circle size={12} />,
            //     navLink: '/reports/stocks'
            // },
            {
                id: 'reportsNeed',
                title: 'needs',
                icon: <Circle size={12} />,
                navLink: '/reports/needs'
            },
            {
                id: 'reportsOutlay',
                title: 'outlays',
                icon: <Circle size={12} />,
                navLink: '/reports/outlays'
            },
            {
                id: 'reportsPurchase',
                title: 'purchases',
                icon: <Circle size={12} />,
                navLink: '/reports/purchases'
            },
            {
                id: 'reportsDept',
                title: 'depts',
                icon: <Circle size={12} />,
                navLink: '/reports/depts'
            },
            {
                id: 'zemamDept',
                title: 'zemam',
                icon: <Circle size={12} />,
                navLink: '/reports/zemam'
            },
            {
                id: 'ReportsCustomsStatement',
                title: 'Customs Statement',
                icon: <Circle size={12} />,
                navLink: '/reports/customs-statement'
            },
            // {
            //     id: 'ReportsProductSales',
            //     title: 'Product Sales',
            //     icon: <Circle size={12} />,
            //     navLink: '/reports/product-sales'
            // },
            {
                id: 'ReportsExemptInvoices',
                title: 'Exempt Invoices',
                icon: <Circle size={12} />,
                navLink: '/reports/exempt-invoices'
            },
            {
                id: 'ReportsDeliveryInvoice',
                title: 'Delivery Invoices',
                icon: <Circle size={12} />,
                navLink: '/reports/delivery-invoice'
            }
        ]
    },
    {
        id: 'settings',
        title: 'Settings',
        icon: <Settings size={20} />,
        children: [
            {
                id: 'mailer',
                title: 'Mailer',
                icon: <Circle size={12} />,
                navLink: '/settings/mailer'
            }
        ]
    }
]
