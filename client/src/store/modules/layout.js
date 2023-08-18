export const state = {
  layoutType: getSavedState('app.layoutType') || 'vertical',
  layoutWidth: getSavedState('app.layoutWidth') || 'fluid',
  leftSidebarTheme: getSavedState('app.leftSidebarTheme') || 'dark',
  leftSidebarType: getSavedState('app.leftSidebarType') || 'fixed',
}

export const getters = {
  layoutType(state) {
    return state.layoutType
  },
  layoutWidth(state) {
    return state.layoutWidth
  },
  leftSidebarTheme(state) {
    return state.leftSidebarTheme
  },
  leftSidebarType(state) {
    return state.leftSidebarType
  },
}

export const mutations = {
  CHANGE_LAYOUT(state, layoutType) {
    state.layoutType = layoutType
  },
  CHANGE_LEFT_SIDEBAR_THEME(state, leftSidebarTheme) {
    state.leftSidebarTheme = leftSidebarTheme
  },
  CHANGE_LEFT_SIDEBAR_TYPE(state, leftSidebarType) {
    state.leftSidebarType = leftSidebarType
  },
  CHANGE_LAYOUT_WIDTH(state, layoutWidth) {
    state.layoutWidth = layoutWidth
  },
}

export const actions = {
  changeLayoutType({ commit, state, rootState }, { layoutType }) {
    commit('CHANGE_LAYOUT', layoutType)
    saveState('app.layoutType', layoutType)
  },

  changeLeftSidebarTheme({ commit, state, rootState }, { leftSidebarTheme }) {
    commit('CHANGE_LEFT_SIDEBAR_THEME', leftSidebarTheme)
    saveState('app.leftSidebarTheme', leftSidebarTheme)
  },

  changeLeftSidebarType({ commit, state, rootState }, { leftSidebarType }) {
    commit('CHANGE_LEFT_SIDEBAR_TYPE', leftSidebarType)
    saveState('app.leftSidebarType', leftSidebarType)
  },

  changeLayoutWidth({ commit, state, rootState }, { layoutWidth }) {
    commit('CHANGE_LAYOUT_WIDTH', layoutWidth)
    saveState('app.layoutWidth', layoutWidth)
  },
}

// ===
// Private helpers
// ===

function getSavedState(key) {
  return JSON.parse(window.localStorage.getItem(key))
}

function saveState(key, state) {
  window.localStorage.setItem(key, JSON.stringify(state))
}
