import { GetterTree } from 'vuex'
import { IState } from './state'

export const commonGetters: GetterTree<IState, any> = {
  listView(state: IState) {
    return state.listView
  },

  objectView: (state: IState) => (viewId: string) => {
    return state.objectViews.find((el) => el.viewId === viewId)
  },

  presentation: (state: IState) => (viewId: string) => {
    const objectView = state.objectViews.find((el) => el.viewId === viewId)

    let presentation = ''
    if (objectView) {
      presentation = objectView.object.name
    }

    return presentation
  },
}
