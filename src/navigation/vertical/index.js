import {
    Home,
    Users,
    Box,
    Grid,
    Truck,
    Settings,
    Circle,
    Folder,
    Book,
    File,
    PieChart,
    ShoppingBag,
    DollarSign,
    Clipboard
} from 'react-feather'
import {useContext} from "react"
import {AbilityContext} from "../../utility/context/Can"
import ability from "../../configs/acl/ability"
import CardTransactions from "../../views/ui-elements/cards/advance/CardTransactions"

const navItems = [
    {
        id: 'home',
        title: 'Home',
        icon: <Home size={20}/>,
        navLink: '/home',
        action: 'read',
        resource: 'home'
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
                navLink: '/user/list',
                action: 'read',
                resource: 'user_list_view'
            },
            {
                id: 'employee',
                title: 'Employee',
                icon: <Circle size={12} />,
                navLink: '/employee/list',
                action: 'read',
                resource: 'employee_list_view'
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
                id: 'allOrders',
                title: 'All Orders',
                icon: <Circle size={12} />,
                navLink: '/order/all',
                action: 'read',
                resource: 'all_order_list_view'
            },
            {
                id: 'offerOrders',
                title: 'Price Offer',
                icon: <Circle size={12} />,
                navLink: '/order/offer',
                action: 'read',
                resource: 'offer_order_list_view'
            },
            {
                id: 'pendingOrders',
                title: 'New Orders',
                icon: <Circle size={12} />,
                navLink: '/order/pending',
                action: 'read',
                resource: 'pending_order_list_view'
            },
            {
                id: 'processingOrders',
                title: 'Processing',
                icon: <Circle size={12} />,
                navLink: '/order/processing',
                action: 'read',
                resource: 'processing_order_list_view'
            },
            {
                id: 'deliveryOrders',
                title: 'Delivery',
                icon: <Circle size={12} />,
                navLink: '/order/delivery',
                action: 'read',
                resource: 'delivery_order_list_view'
            },
            {
                id: 'fatoraPendingOrders',
                title: 'Fatora Pending',
                icon: <Circle size={12} />,
                navLink: '/order/fatoraPending',
                action: 'read',
                resource: 'migrate_completed_order'
            },
            {
                id: 'pendingsOrders',
                title: 'Pending',
                icon: <Circle size={12} />,
                navLink: '/order/pendings',
                action: 'read',
                resource: 'pending_order_list_view'
            },
            {
                id: 'completedOrders',
                title: 'Completed',
                icon: <Circle size={12} />,
                navLink: '/order/completed',
                action: 'read',
                resource: 'completed_order_list_view'
            },
            {
                id: 'returnedOrders',
                title: 'Returned',
                icon: <Circle size={12} />,
                navLink: '/order/returned',
                action: 'read',
                resource: 'returned_order_list_view'
            },
            {
                id: 'canceledOrders',
                title: 'Deleted',
                icon: <Circle size={12} />,
                navLink: '/order/deleted',
                action: 'read',
                resource: 'deleted_order_list_view'
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
                navLink: '/category/list',
                action: 'read',
                resource: 'category_list_view'
            },
            {
                id: 'sub_category',
                title: 'Sub Categories',
                icon: <Circle size={12} />,
                navLink: '/sub-category/list',
                action: 'read',
                resource: 'sub_category_list_view'
            },
            {
                id: 'product',
                title: 'Products',
                icon: <Circle size={12} />,
                navLink: '/product/list',
                action: 'read',
                resource: 'product_list_view'
            },
            {
                id: 'kit_product',
                title: 'Kit Products',
                icon: <Circle size={12} />,
                navLink: '/kit_product/list',
                action: 'read',
                resource: 'product_list_view'
            },
            {
                id: 'deleted_product',
                title: 'Deleted Products',
                icon: <Circle size={12} />,
                navLink: '/delete-product/list',
                action: 'read',
                resource: 'deleted_product_list_view'
            },
            // {
            //     id: 'location',
            //     title: 'Locations',
            //     icon: <Circle size={12} />,
            //     navLink: '/location/list',
            //     action: 'read',
            //     resource: 'location_list_view'
            // },
            {
                id: 'product_variants',
                title: 'Colors Parent',
                icon: <Circle size={12} />,
                navLink: '/product_variants/list',
                action: 'read',
                resource: 'product_variants_list_view'
            },
            {
                id: 'product_colors',
                title: 'Colors Son',
                icon: <Circle size={12} />,
                navLink: '/product_variants_sun/list',
                action: 'read',
                resource: 'product_variants_list_view'
            },
            {
                id: 'transfer_order_list',
                title: 'Transfer Orders',
                icon: <Circle size={12} />,
                navLink: '/transfer-order/list',
                action: 'read',
                resource: 'transfer_order_list_view'
            },
            {
                id: 'stock_adjustment',
                title: 'Stock Adjustment',
                icon: <Circle size={12} />,
                navLink: '/stock-adjustment',
                action: 'read',
                resource: 'stock_adjustment_request'
            },
            {
                id: 'stock_adjustment_approve',
                title: 'Approve Adjustments',
                icon: <Circle size={12} />,
                navLink: '/stock-adjustment/approve',
                action: 'read',
                resource: 'stock_adjustment_approve'
            },
            {
                id: 'stock',
                title: 'Stock',
                icon: <Circle size={12} />,
                navLink: '/stock',
                action: 'read',
                resource: 'stock2_list_view'
            },
            {
                id: 'stock1',
                title: 'Stock1',
                icon: <Circle size={12} />,
                navLink: '/stock1',
                action: 'read',
                resource: 'stock_list_view'
            },
            {
                id: 'stock2',
                title: 'Stock2',
                icon: <Circle size={12} />,
                navLink: '/stock2',
                action: 'read',
                resource: 'stock2_list_view'
            },
            {
                id: 'stock3',
                title: 'Stock3',
                icon: <Circle size={12} />,
                navLink: '/stock3',
                action: 'read',
                resource: 'stock2_list_view'
            },
            {
                id: 'invoice',
                title: 'Purchases',
                icon: <Circle size={12} />,
                navLink: '/invoice/list',
                action: 'read',
                resource: 'invoice_list_view'
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
                navLink: '/city/list',
                action: 'read',
                resource: 'city_list_view'
            },
            {
                id: 'providers',
                title: 'Providers',
                icon: <Circle size={12} />,
                navLink: '/shipping-provider/list',
                action: 'read',
                resource: 'shipping_provider_list_view'
            },
            {
                id: 'setting',
                title: 'Setting',
                icon: <Circle size={12} />,
                navLink: '/shipping/setting',
                action: 'read',
                resource: 'shipping_setting'
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
                id: 'brand',
                title: 'Brands',
                icon: <Circle size={12} />,
                navLink: '/brand/list',
                action: 'read',
                resource: 'brand_list_view'
            },
            {
                id: 'source',
                title: 'Sources',
                icon: <Circle size={12} />,
                navLink: '/source/list',
                action: 'read',
                resource: 'source_list_view'
            },
            {
                id: 'tax_exempt',
                title: 'Tax Exempt',
                icon: <Circle size={12} />,
                navLink: '/tax_exempt/list',
                action: 'read',
                resource: 'tax_exempt_list_view'
            },
            {
                id: 'articles',
                title: 'Articles',
                icon: <Circle size={12} />,
                navLink: '/article/list',
                action: 'read',
                resource: 'article_list_view'
            },
            {
                id: 'coupons',
                title: 'Coupons',
                icon: <Circle size={12} />,
                navLink: '/coupon/list',
                action: 'read',
                resource: 'coupon_list_view'
            },
            {
                id: 'slides',
                title: 'Slides',
                icon: <Circle size={12} />,
                navLink: '/slide/list',
                action: 'read',
                resource: 'slide_list_view'
            },
            {
                id: 'promotions',
                title: 'Promotions',
                icon: <Circle size={12} />,
                navLink: '/promotion/list',
                action: 'read',
                resource: 'promotion_list_view'
            },
            {
                id: 'links',
                title: 'Links',
                icon: <Circle size={12} />,
                navLink: '/links/list',
                action: 'read',
                resource: 'links_list_view'
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
                navLink: '/file/list',
                action: 'read',
                resource: 'file_list_view'
            },
            {
                id: 'projects',
                title: 'Projects',
                icon: <Circle size={12} />,
                badge: 'light-warning',
                navLink: '/project/list',
                action: 'read',
                resource: 'project_list_view'
            },
            {
                id: 'courses',
                title: 'Courses',
                icon: <Book size={20} />,
                badge: 'light-warning',
                navLink: '/course/list',
                action: 'read',
                resource: 'course_list_view'
            },
            {
                id: 'project-receipt',
                title: 'Project Receipts',
                icon: <Circle size={12} />,
                navLink: '/project-receipt/list',
                action: 'read',
                resource: 'receipt_list_view'
            },
            {
                id: 'receipts',
                title: 'Receipts',
                icon: <Circle size={12} />,
                navLink: '/receipt/list',
                action: 'read',
                resource: 'receipt_list_view'
            },
            {
                id: 'depts',
                title: 'Depts',
                icon: <Circle size={12} />,
                navLink: '/dept/list',
                action: 'read',
                resource: 'dept_list_view'
            },
            {
                id: 'outlays',
                title: 'Outlays',
                icon: <Circle size={12} />,
                navLink: '/outlay/list',
                action: 'read',
                resource: 'outlay_list_view'
            },
            {
                id: 'customsStatements',
                title: 'customs Statement',
                icon: <Circle size={12} />,
                navLink: '/customs-statement/list',
                action: 'read',
                resource: 'customs_statement_list_view'
            }
        ]
    },
    {
        id: 'financial',
        title: 'Financial',
        icon: <DollarSign size={20} />,
        children: [
            {
                id: 'withdraw',
                title: 'Withdraws',
                icon: <Clipboard size={20} />,
                badge: 'light-warning',
                navLink: '/withdraw/list',
                action: 'read',
                resource: 'transaction_list_view'
            },
            {
                id: 'transactions',
                title: 'Transactions',
                icon: <Clipboard size={20} />,
                badge: 'light-warning',
                navLink: '/transaction/list',
                action: 'read',
                resource: 'transaction_list_view'
            },
            {
                id: 'refunds',
                title: 'Refunds',
                icon: <Clipboard size={20} />,
                badge: 'light-warning',
                navLink: '/refund/list',
                action: 'read',
                resource: 'transaction_list_view'
            },
            {
                id: 'transaction',
                title: 'Report',
                icon: <Clipboard size={20} />,
                badge: 'light-warning',
                navLink: '/financial/list',
                action: 'read',
                resource: 'transaction_list_view'
            },
            {
                id: 'payment_method',
                title: 'Payment Method',
                icon: <Box size={20} />,
                badge: 'light-warning',
                navLink: '/payment_method/list',
                action: 'read',
                resource: 'payment_method_list_view'
            },
            {
                id: 'deleted',
                title: 'Deleted',
                icon: <Clipboard size={20} />,
                badge: 'light-warning',
                navLink: '/deleted/list',
                action: 'read',
                resource: 'transaction_list_view'
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
                navLink: '/reports/order',
                action: 'read',
                resource: 'order_report'
            },
            {
                id: 'reportsReturnOrder',
                title: 'Return Orders',
                icon: <Circle size={12} />,
                navLink: '/reports/return-order',
                action: 'read',
                resource: 'order_report'
            },
            {
                id: 'reportsProduct',
                title: 'Products',
                icon: <Circle size={12} />,
                navLink: '/reports/product',
                action: 'read',
                resource: 'product_report'
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
                navLink: '/reports/needs',
                action: 'read',
                resource: 'need_report'
            },
            {
                id: 'reportsOutlay',
                title: 'outlays',
                icon: <Circle size={12} />,
                navLink: '/reports/outlays',
                action: 'read',
                resource: 'outlay_report'
            },

            {
                id: 'reportsPurchase',
                title: 'purchases',
                icon: <Circle size={12} />,
                navLink: '/reports/purchases',
                action: 'read',
                resource: 'purchases_report'
            },
            {
                id: 'reportsproductPurchase',
                title: 'product purchases',
                icon: <Circle size={12} />,
                navLink: '/reports/product-purchases',
                action: 'read',
                resource: 'purchases_report'
            },

            {
                id: 'reportsDept',
                title: 'depts',
                icon: <Circle size={12} />,
                navLink: '/reports/depts',
                action: 'read',
                resource: 'debts_report'
            },
            {
                id: 'zemamDept',
                title: 'zemam',
                icon: <Circle size={12} />,
                navLink: '/reports/zemam',
                action: 'read',
                resource: 'zemam_report'
            },
            {
                id: 'ReportsCustomsStatement',
                title: 'Customs Statement',
                icon: <Circle size={12} />,
                navLink: '/reports/customs-statement',
                action: 'read',
                resource: 'custom_statement_report'
            },
            {
                id: 'ReportsProductSales',
                title: 'Product Sales',
                icon: <Circle size={12} />,
                navLink: '/reports/product-sales',
                action: 'read',
                resource: 'product_sale_report'
            },
            {
                id: 'ReportsExemptInvoices',
                title: 'Exempt Invoices',
                icon: <Circle size={12} />,
                navLink: '/reports/exempt-invoices',
                action: 'read',
                resource: 'exempt_invoice_report'
            },
            {
                id: 'ReportsDeliveryInvoice',
                title: 'Delivery Invoices',
                icon: <Circle size={12} />,
                navLink: '/reports/delivery-invoice',
                action: 'read',
                resource: 'delivery_invoice_report'
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
                navLink: '/settings/mailer',
                action: 'read',
                resource: 'mailer_setting'
            },
            {
                id: 'send_mail',
                title: 'Send Email',
                icon: <Circle size={12} />,
                navLink: '/settings/send_email',
                action: 'read',
                resource: 'send_mails'
            },
            {
                id: 'sms',
                title: 'SMS',
                icon: <Circle size={12} />,
                navLink: '/settings/sms',
                action: 'read',
                resource: 'sms_setting'
            },
            {
                id: 'send_sms',
                title: 'Send Sms',
                icon: <Circle size={12} />,
                navLink: '/settings/send_sms',
                action: 'read',
                resource: 'send_sms'
            },
            {
                id: 'tags',
                title: 'Tags',
                icon: <Circle size={12} />,
                navLink: '/settings/tags',
                action: 'read',
                resource: 'tags_setting'
            },
            {
                id: 'elastic',
                title: 'Search Setting',
                icon: <Circle size={12} />,
                navLink: '/settings/search',
                action: 'read',
                resource: 'tags_setting'
            },
            {
                id: 'fatora',
                title: 'Fatora Setting',
                icon: <Circle size={12} />,
                navLink: '/settings/fatora',
                action: 'read',
                resource: 'fatora_setting'
            }
        ]
    }
]

export default navItems
