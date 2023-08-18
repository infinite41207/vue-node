import { RouteConfig } from 'vue-router'
import { INavigationItem } from '@/store/types/NavigationType'

export function getRouteFromNavItem(navigation: INavigationItem, lvl: number): RouteConfig {
  const optionNavigation: RouteConfig = {
    path: getPath(navigation, lvl),
    component: getComponent(navigation, lvl),
    name: navigation.name,
    meta: {
      title: navigation.title,
      description: navigation.description,
      icon: getIcon(navigation),
      isReadOnly: navigation.isReadOnly,
      isSubsystem: navigation.isSubsystem,
      detailPath: navigation.detailPath,
      authRequired: navigation.authRequired,
      store: navigation.store,
      model: navigation.model,
      presentation: navigation.presentation,
      viewId: navigation.viewId,
      viewType: navigation.viewType,
      hasOther: false,
      placing: navigation.placing,
      isDynamic: true,
      routerPath: getRouterPath(navigation, lvl),
      childs: [],
    },
    children: [],
  }

  let hasOther = false
  if (navigation.childs.length > 0) {
    for (const navItem of navigation.childs) {
      const childNavigation = getRouteFromNavItem(navItem, 2)
      optionNavigation.children?.push(childNavigation)

      if (navItem.placing === 'other') {
        hasOther = true
      }
    }

    if (optionNavigation.meta) {
      optionNavigation.meta.hasOther = hasOther
    }
  }

  return optionNavigation
}

export function prepareRouteForRouter(route: RouteConfig): void {
  if (route.meta?.routerPath) {
    route.path = route.meta.routerPath

    delete route.meta.routerPath
  }

  if (route.children) {
    for (const childRoute of route.children) {
      prepareRouteForRouter(childRoute)
    }
  }
}

function getPath(navItem: INavigationItem, lvl: number) {
  const slash = lvl === 1 ? '/' : ''

  let path = ''
  if (navItem.path && navItem.path !== '') {
    path = navItem.path
  } else if (navItem.id) {
    path = navItem.id
  }

  if (navItem.paramValues) {
    try {
      const params = JSON.parse(navItem.paramValues)

      for (const paramKey of Object.keys(params)) {
        path = path.replace(`:${paramKey}`, `${params[paramKey]}`)
      }
    } catch (error) {
      console.error('Error router param values', error)
    }
  }

  if (navItem.queryParam) {
    path += `?${navItem.queryParam}`
  }

  if (navItem.hashParam) {
    path += `#${navItem.hashParam}`
  }

  return `${slash}${path}`
}

function getRouterPath(navItem: INavigationItem, lvl: number) {
  const slash = lvl === 1 ? '/' : ''

  if (navItem.path && navItem.path !== '') {
    return `${slash}${navItem.path}`
  } else {
    return `${slash}${navItem.id}`
  }
}

function getIcon(navItem: INavigationItem) {
  if (navItem.icon) {
    return navItem.icon
  }

  return ''
}

function getComponent(navItem: INavigationItem, lvl: number) {
  let component

  if (navItem.isSubsystem === true) {
    if (lvl === 1) {
      component = () => lazyLoadView(import('@/views/subsystem/index.vue'))
    } else {
      component = {
        render(c: any) {
          return c('router-view')
        },
      }
    }
  } else {
    if (navItem.viewType === 'list') {
      component = () => lazyLoadView(import('@/views/common/list.vue'))
    } else if (navItem.viewType === 'detail') {
      component = () => lazyLoadView(import('@/views/dynamic-view/index.vue'))
    } else {
      component = () => lazyLoadView(import(`@/views/${navItem.component}.vue`))
    }
  }

  return component
}

// Lazy-loads view components, but with better UX. A loading view
// will be used if the component takes a while to load, falling
// back to a timeout view in case the page fails to load. You can
// use this component to lazy-load a route with:
//
// component: () => lazyLoadView(import('@/views/my-view'))
//
// NOTE: Components loaded with this strategy DO NOT have access
// to in-component guards, such as beforeRouteEnter,
// beforeRouteUpdate, and beforeRouteLeave. You must either use
// route-level guards instead or lazy-load the component directly:
//
// component: () => import('@/views/my-view')
//
export function lazyLoadView(AsyncView: any) {
  const AsyncHandler = () => ({
    component: AsyncView,
    // A component to use while the component is loading.
    // eslint-disable-next-line
    loading: require('@/views/_loading').default,
    // Delay before showing the loading component.
    // Default: 200 (milliseconds).
    delay: 400,
    // A fallback component in case the timeout is exceeded
    // when loading the component.
    // error: require('@/views/_timeout').default,
    // Time before giving up trying to load the component.
    // Default: Infinity (milliseconds).
    timeout: 10000,
  })

  return Promise.resolve({
    functional: true,
    render(h: any, { data, children }: any) {
      // Transparently pass any props or children
      // to the view component.
      return h(AsyncHandler, data, children)
    },
  })
}
