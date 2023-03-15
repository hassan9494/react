import { Home, Users, Box, BookOpen, Truck, Settings, Circle, Bookmark } from 'react-feather'

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
    icon: <BookOpen size={20} />,
    badge: 'light-warning',
    children: [
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
        navLink: '/stock'
      },
      {
        id: 'category',
        title: 'Categories',
        icon: <Circle size={12} />,
        navLink: '/category/list'
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
      }
    ]
  },
  {
    id: 'others',
    title: 'Others',
    icon: <Bookmark size={20} />,
    children: [
      {
        id: 'projects',
        title: 'Projects',
        icon: <Circle size={12} />,
        navLink: '/project/list'
      },
      {
        id: 'courses',
        title: 'Courses',
        icon: <Circle size={12} />,
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
      }
    ]
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: <Truck size={20} />,
    badge: 'light-warning',
    children: [
      {
        id: 'reportsOrder',
        title: 'Orders',
        icon: <Circle size={12} />,
        navLink: '/reports/order'
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
