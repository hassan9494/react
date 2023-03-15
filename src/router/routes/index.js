import { lazy } from 'react'
import CatalogRoutes from './Catalog'
import OrderRoutes from './Order'
import ShippingRoutes from './Shipping'
import UserRoutes from './User'
import SettingsRoutes from './Settings'
import ReportRoutes from './Report'
import OthersRoutes from './Others'
import UiElements from './UiElements'
import WebsiteRoutes from './Website'
import ShopRoutes from './Shop'

// ** Document title
const TemplateTitle = '%s - Mikroelektron | Portal'

// ** Default Route
const DefaultRoute = '/home'

// ** Merge Routes
const Routes = [
  ...UserRoutes,
  ...CatalogRoutes,
  ...OrderRoutes,
  ...ShippingRoutes,
  ...SettingsRoutes,
  ...ReportRoutes,
  ...OthersRoutes,
  ...UiElements,
  ...WebsiteRoutes,
  ...ShopRoutes,
  {
    path: '/home',
    component: lazy(() => import('../../views/dashboard/index'))
  },
  {
    path: '/second-page',
    component: lazy(() => import('../../views/SecondPage'))
  },
  {
    path: '/login',
    component: lazy(() => import('../../views/Login')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/error',
    component: lazy(() => import('../../views/error/Error')),
    layout: 'BlankLayout'
  },
  {
    path: '/401',
    component: lazy(() => import('../../views/error/NotAuthorized')),
    layout: 'BlankLayout'
  }
]

export { DefaultRoute, TemplateTitle, Routes }
