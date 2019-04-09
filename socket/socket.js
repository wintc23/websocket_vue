import { getToken } from '@/libs/tool'
import { protocol } from './protocol'
import { WS } from '@/libs/config'

export class CWebSocket {
  constructor () {
    this.sessionId = ''
    this.listenerList = {}
    this.waitingList = []
    this.socket = new WebSocket(`${WS}?token=${getToken()}`)
    this.socket.onopen = (...args) => {
      this.checkWaitingList(args)
    }
    this.socket.onmessage = (...args) => {
      this.S2CMessage(...args)
    }
    this.socket.onerror = (...args) => {
      this.onerror(args)
    }
    for (let key in protocol) {
      this[key] = protocol[key]
    }
  }
  checkWaitingList (args) {
    console.log('open', this, args)
    this.waitingList.forEach(item => {
      let protocol, data = item
      this.C2SMessage(protocol, data)
    })
  }
  addListener (protocol, func) {
    if (!this.listenerList[protocol]) {
      this.listenerList[protocol] = []
    }
    this.listenerList[protocol].push(func)
  }
  removeListener (protocol, func) {
    if (!func) {
      this.listenerList[protocol] = undefined
      return
    }
    if (!this.listenerList[protocol]) return
    let index = this.listenerList.findIndex(func)
    index !== -1 && this.listenerList[protocol].splice(index, 1)
  }
  S2CMessage (event) {
    let msg = JSON.parse(event.data)
    console.log('S2CMessage', msg)
    if (!msg) return
    if (msg.sessionId) {
      this.sessionId = msg.sessionId
      return
    }
    if (!msg.success) {
      console.log('socket错误', msg.data)
      return
    }
    let { protocol, data } = msg
    if (!this.listenerList[protocol]) return
    this.listenerList[protocol].forEach(func => func(data))
  }
  C2SMessage (protocol, data) {
    console.log(this.socket.readyState, 'C2SMessage', protocol, data)
    if (this.socket.readyState !== this.socket.OPEN) {
      this.waitingList.push([protocol, data])
      return
    }
    let msg = {
      protocol,
      token: getToken(),
      data
    }
    this.socket.send(JSON.stringify(msg))
  }
  onerror (error) { 
    console.log('error', error)
  }
  close () {
    if (this.socket) {
      for (let protocol in this.listenerList) {
        this.removeListener(protocol)
      }
      this.socket.onopen = null
      this.socket.onmessage = null
      this.socket.onerror = null
      this.socket.close()
      this.socket = null
    }
  }
}
