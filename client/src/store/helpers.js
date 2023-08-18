import { mapState, mapGetters, mapActions } from 'vuex'

export const authComputed = {
  ...mapState('auth', {
    currentUser: (state) => state.currentUser,
  }),
  ...mapGetters('auth', ['loggedIn']),
}

export const authMethods = mapActions('auth', ['logIn', 'logOut', 'register', 'resetPassword'])

export const getSavedState = (key) => {
  return JSON.parse(window.localStorage.getItem(key))
}

export const saveState = (key, state) => {
  window.localStorage.setItem(key, JSON.stringify(state))
}
