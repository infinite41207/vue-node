import { lazyLoadView } from '@/utils/routes-service'
import { RouteConfig, Route } from 'vue-router'

// auth related routes
const authRoutes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: 'login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => lazyLoadView(import('@/views/account/login.vue')),
    meta: {
      beforeResolve(params: any, next: any) {
        // If the user is already logged in
        if (params.loggedIn === true) {
          // Redirect to the home page instead
          if (params.desktopMode === true && params.desktopName) {
            next({ name: params.desktopName })
          } else {
            next({ path: '/main' })
          }
        } else {
          // Continue to the login page
          next()
        }
      },
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => lazyLoadView(import('@/views/account/register.vue')),
    meta: {
      beforeResolve(params: any, next: any) {
        // If the user is already logged in
        if (params.loggedIn === true) {
          // Redirect to the home page instead
          next({ path: '/main' })
        } else {
          // Continue to the login page
          next()
        }
      },
    },
  },
  {
    path: '/confirm-account',
    name: 'confirm-account',
    component: () => lazyLoadView(import('@/views/account/confirm.vue')),
    meta: {
      beforeResolve(params: any, next: any) {
        // If the user is already logged in
        if (params.loggedIn === true) {
          // Redirect to the home page instead
          next({ path: '/main' })
        } else {
          // Continue to the login page
          next()
        }
      },
    },
  },
  {
    path: '/forget-password',
    name: 'forget-password',
    component: () => lazyLoadView(import('@/views/account/forget-password.vue')),
    meta: {
      beforeResolve(params: any, next: any) {
        // If the user is already logged in
        if (params.loggedIn === true) {
          // Redirect to the home page instead
          next({ path: '/main' })
        } else {
          // Continue to the login page
          next()
        }
      },
    },
  },
  {
    path: '/email-confirmation/:token',
    name: 'email-confirmation',
    props: true,
    component: () => import('@/views/account/email-confirmation.vue'),
  },

  {
    path: '/password-reset/:token',
    name: '/password-reset',
    props: true,
    component: () => import('@/views/account/password-confirmation.vue'),
  },
]

// error pages
const errorPagesRoutes: Array<RouteConfig> = [
  {
    path: '/404',
    name: '404',
    // eslint-disable-next-line
    component: require('@/views/error-pages/error-404').default,
    // Allows props to be passed to the 404 page through route
    // params, such as `resource` to define what wasn't found.
    props: true,
  },
  {
    path: '/500',
    name: '500',
    // eslint-disable-next-line
    component: require('@/views/error-pages/error-500').default,
    props: true,
  },
  // Redirect any unmatched routes to the 404 page. This may
  // require some server configuration to work in production:
  // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
  {
    path: '*',
    redirect: '404',
  },
]

// home view
const mainRoutes: Array<RouteConfig> = [
  {
    path: '/main',
    name: 'main',
    meta: { icon: 'ri-home-8-line', title: 'main', authRequired: true, affix: true },
    component: () => lazyLoadView(import('@/views/tasks/list.vue')),
  },
]

export const navRoutes: Array<RouteConfig> = [...mainRoutes]
export const allRoutes: Array<RouteConfig> = [...authRoutes, ...navRoutes, ...errorPagesRoutes]
