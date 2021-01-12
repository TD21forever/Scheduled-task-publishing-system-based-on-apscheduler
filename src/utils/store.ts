import { createStore } from 'vuex'

// Create a new store instance.
const store = createStore({
  state() {
    return {
      token: ""
    }
  },
  mutations: {
    setToken(state: any, token: string) {
      state.token = token
      localStorage.token = token
    },
    delToken(state) {
      state.token = ""
      localStorage.removeItem('token')
    }
  }
})


export default store