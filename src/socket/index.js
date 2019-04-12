import { CWebSocket } from './socket'
import Vue from 'vue'

export function createSocket () {
  if (!Vue.prototype.$socket) {
    Vue.prototype.$socket = new CWebSocket()
  }
}

export function destroySocket () {
  if (Vue.prototype.$socket) {
    Vue.prototype.$socket.close()
    Vue.prototype.$socket = null
  }
}
