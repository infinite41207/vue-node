import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'

// Adds a loading bar at the top during page loads.
import NProgress from 'nprogress/nprogress'
import store from '@/store'
import { allRoutes } from './staticRoutes'

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    page?: any
  }
}

Vue.use(VueRouter)
Vue.use(VueMeta, {
  // The component option name that vue-meta looks for meta info on.
  keyName: 'page',
})

const createRouter = () =>
  new VueRouter({
    routes: allRoutes,
    // Use the HTML5 history API (i.e. normal-looking routes)
    // instead of routes with hashes (e.g. example.com/#/about).
    // This may require some server configuration in production:
    // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
    mode: process.env.IS_ELECTRON ? 'hash' : 'history',
    // Simulate native-like scroll behavior when navigating to a new
    // route and using back/forward buttons.
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } else {
        return { x: 0, y: 0 }
      }
    },
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  ;(router as any).matcher = (newRouter as any).matcher // reset router
}

// Before each route evaluates...
router.beforeEach(async (routeTo, routeFrom, next) => {
  // If this isn't an initial page load...
  if (routeFrom.name !== null) {
    // Start the route progress bar.
    NProgress.start()
  }

  if (routeFrom.name === null && routeTo.name === '404') {
    // If reload page we redirect to main page
    next({ name: 'main' })
  }

  // Check if auth is required on this route
  // (including nested routes).

  const authRequired = routeTo.matched.some((route) => route.meta.authRequired)
  // If auth isn't required for the route, just continue.

  if (!authRequired) return next()
  // If auth is required and the user is logged in...

  if (store.getters['auth/loggedIn']) {
    return store.dispatch('auth/validate').then(async (validUser) => {
      // Then continue if the token still represents a valid user,
      // otherwise redirect to login.

      if (validUser) {
        next()
      } else {
        redirectToLogin()
      }
    })
  }

  // If auth is required and the user is NOT currently logged in,
  // redirect to login.
  redirectToLogin()

  function redirectToLogin() {
    // Pass the original route to the login component
    next({ name: 'login', query: { redirectFrom: routeTo.fullPath } })
  }
})

router.beforeResolve(async (routeTo, routeFrom, next) => {
  // Create a `beforeResolve` hook, which fires whenever
  // `beforeRouteEnter` and `beforeRouteUpdate` would. This
  // allows us to ensure data is fetched even when params change,
  // but the resolved route does not. We put it in `meta` to
  // indicate that it's a hook we created, rather than part of
  // Vue Router (yet?).
  try {
    // For each matched route...
    for (const route of routeTo.matched) {
      await new Promise<void>((resolve, reject) => {
        // If a `beforeResolve` hook is defined, call it with
        // the same arguments as the `beforeEnter` hook.
        if (route.meta && route.meta.beforeResolve) {
          const params = {
            routeTo,
            routeFrom,
            loggedIn: store.getters['auth/loggedIn'],
            desktopMode: store.getters['app/desktopMode'],
            desktopName: store.getters['app/desktopName'],
          }

          route.meta.beforeResolve(params, (...args: any) => {
            // If the user chose to redirect...
            if (args.length) {
              // If redirecting to the same route we're coming from...
              if (routeFrom.name === args[0].name) {
                // Complete the animation of the route progress bar.
                NProgress.done()
              }
              // Complete the redirect.
              next(...args)
              reject(new Error('Redirected'))
            } else {
              resolve()
            }
          })
        } else {
          // Otherwise, continue resolving the route.
          resolve()
        }
      })
    }
    // If a `beforeResolve` hook chose to redirect, just return.
  } catch (error) {
    return
  }

  // If we reach this point, continue resolving the route.
  next()
})

// When each route is finished evaluating...
router.afterEach((routeTo, routeFrom) => {
  // Complete the animation of the route progress bar.
  NProgress.done()
})

export default router
