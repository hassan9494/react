import { lazy } from 'react'

const UiElementRoutes = [
  {
    path: '/ui-element/typography',
    component: lazy(() => import('../../views/ui-elements/typography')),
    meta:{
      action:'read',
      resource:'ui_element_typography_list_view'
    }
  },
  {
    path: '/colors/colors',
    component: lazy(() => import('../../views/ui-elements/colors')),
    meta:{
      action:'read',
      resource:'color_list_view'
    }
  },
  {
    path: '/icons/reactfeather',
    component: lazy(() => import('../../views/ui-elements/icons')),
    meta:{
      action:'read',
      resource:'icons_react_feather_list_view'
    }
  },
  {
    path: '/cards/statistics',
    component: lazy(() => import('../../views/ui-elements/cards/statistics')),
    meta:{
      action:'read',
      resource:'cards_statistics_list_view'
    }
  },
  {
    path: '/cards/analytics',
    component: lazy(() => import('../../views/ui-elements/cards/analytics')),
    meta:{
      action:'read',
      resource:'cards_analytics_list_view'
    }
  },
  {
    path: '/cards/action',
    component: lazy(() => import('../../views/ui-elements/cards/actions')),
    meta:{
      action:'read',
      resource:'cards_action_list_view'
    }
  }
  // {
  //   path: '/components/alerts',
  //   component: lazy(() => import('../../views/components/alerts')),
  //         meta:{
  //             action:'read',
  //             resource:'components_alerts_list_view'
  //         }
  // },
  // {
  //   path: '/components/auto-complete',
  //   component: lazy(() => import('../../views/components/autocomplete')),
  //         meta:{
  //             action:'read',
  //             resource:'components_auto_complete_list_view'
  //         }
  // },
  // {
  //   path: '/components/avatar',
  //   component: lazy(() => import('../../views/components/avatar')),
  //         meta:{
  //             action:'read',
  //             resource:'components_avatar_list_view'
  //         }
  // },
  // {
  //   path: '/components/badges',
  //   component: lazy(() => import('../../views/components/badge')),
  //         meta:{
  //             action:'read',
  //             resource:'components_badges_list_view'
  //         }
  // },
  // {
  //   path: '/components/blockui',
  //   component: lazy(() => import('../../views/components/block-ui')),
  //         meta:{
  //             action:'read',
  //             resource:'components_block_ui_list_view'
  //         }
  // },
  // {
  //   path: '/components/breadcrumbs',
  //   component: lazy(() => import('../../views/components/breadcrumbs')),
  //         meta:{
  //             action:'read',
  //             resource:'components_breadcrumbs_list_view'
  //         }
  // },
  // {
  //   path: '/components/buttons',
  //   component: lazy(() => import('../../views/components/buttons')),
  //         meta:{
  //             action:'read',
  //             resource:'components_buttons_list_view'
  //         }
  // },
  // {
  //   path: '/components/carousel',
  //   component: lazy(() => import('../../views/components/carousel')),
  //         meta:{
  //             action:'read',
  //             resource:'components_carousel_list_view'
  //         }
  // },
  // {
  //   path: '/components/collapse',
  //   component: lazy(() => import('../../views/components/collapse')),
  //         meta:{
  //             action:'read',
  //             resource:'components_collapse_list_view'
  //         }
  // },
  // {
  //   path: '/components/divider',
  //   component: lazy(() => import('../../views/components/divider')),
  //         meta:{
  //             action:'read',
  //             resource:'components_divider_list_view'
  //         }
  // },
  // {
  //   path: '/components/dropdowns',
  //   component: lazy(() => import('../../views/components/dropdowns')),
  //         meta:{
  //             action:'read',
  //             resource:'components_dropdowns_list_view'
  //         }
  // },
  // {
  //   path: '/components/list-group',
  //   component: lazy(() => import('../../views/components/listGroup')),
  //         meta:{
  //             action:'read',
  //             resource:'components_list_group_list_view'
  //         }
  // },
  // {
  //   path: '/components/media-objects',
  //   component: lazy(() => import('../../views/components/media')),
  //         meta:{
  //             action:'read',
  //             resource:'components_media_objects_list_view'
  //         }
  // },
  // {
  //   path: '/components/modals',
  //   component: lazy(() => import('../../views/components/modal')),
  //         meta:{
  //             action:'read',
  //             resource:'components_modals_list_view'
  //         }
  // },
  // {
  //   path: '/components/nav-component',
  //   component: lazy(() => import('../../views/components/navComponent')),
  //         meta:{
  //             action:'read',
  //             resource:'components_nav_component_list_view'
  //         }
  // },
  // {
  //   path: '/components/pagination',
  //   component: lazy(() => import('../../views/components/pagination')),
  //         meta:{
  //             action:'read',
  //             resource:'components_pagination_list_view'
  //         }
  // },
  // {
  //   path: '/components/pill-badges',
  //   component: lazy(() => import('../../views/components/badgePills')),
  //         meta:{
  //             action:'read',
  //             resource:'components_pill_badges_list_view'
  //         }
  // },
  // {
  //   path: '/components/pills-component',
  //   component: lazy(() => import('../../views/components/tabPills')),
  //         meta:{
  //             action:'read',
  //             resource:'components_pills_component_list_view'
  //         }
  // },
  // {
  //   path: '/components/popovers',
  //   component: lazy(() => import('../../views/components/popovers')),
  //         meta:{
  //             action:'read',
  //             resource:'components_popovers_list_view'
  //         }
  // },
  // {
  //   path: '/components/progress',
  //   component: lazy(() => import('../../views/components/progress')),
  //         meta:{
  //             action:'read',
  //             resource:'components_progress_list_view'
  //         }
  // },
  // {
  //   path: '/components/spinners',
  //   component: lazy(() => import('../../views/components/spinners')),
  //         meta:{
  //             action:'read',
  //             resource:'components_spinners_list_view'
  //         }
  // },
  // {
  //   path: '/components/tabs-component',
  //   component: lazy(() => import('../../views/components/tabs')),
  //         meta:{
  //             action:'read',
  //             resource:'components_tabs_component_list_view'
  //         }
  // },
  // {
  //   path: '/components/timeline',
  //   component: lazy(() => import('../../views/components/timeline')),
  //         meta:{
  //             action:'read',
  //             resource:'components_timeline_list_view'
  //         }
  // },
  // {
  //   path: '/components/toasts',
  //   component: lazy(() => import('../../views/components/toasts')),
  //         meta:{
  //             action:'read',
  //             resource:'components_toasts_list_view'
  //         }
  // },
  // {
  //   path: '/components/tooltips',
  //   component: lazy(() => import('../../views/components/tooltips')),
  //         meta:{
  //             action:'read',
  //             resource:'components_tooltips_list_view'
  //         }
  // }
]

export default UiElementRoutes
