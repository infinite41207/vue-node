import allModules from '@/store/modules'
import store from '@/store'

export default function resetStates() {
  // For every module...

  type ModuleType = {
    [key: string]: any
  }

  const modules: ModuleType = allModules

  for (const moduleName in modules) {
    const moduleDefinition = modules[moduleName]

    // If the action is defined on the module...
    if (moduleDefinition.actions && moduleDefinition.actions['resetState']) {
      // Dispatch the action if the module is namespaced. Otherwise,
      // set a flag to dispatch the action globally at the end.
      store.dispatch(`${moduleName}/resetState`)
    }
  }
}
