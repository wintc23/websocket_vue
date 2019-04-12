<template>
  <div id="app">
    <div class="title">简易websocket聊天室({{ userId }})</div>
    <div class="message-list">
      <div class="message" v-for="(data, idx) of messageList" :key="idx">
        <div class="user-id">{{ data.userId }}<template v-if="data.userId == userId">(我)</template>:</div>
        <div class="msg">{{ data.msg }}</div>
      </div>
    </div>
    <div class="msg-send">
      <textarea placeholder="输入消息开始聊天吧" @keypress.ctrl.enter.stop="C2SMessage" v-model="message" cols="30" rows="5"></textarea>
      <button @click.stop="C2SMessage">发送</button>
    </div>
  </div>
</template>

<script>
import { createSocket, destroySocket } from '@/socket'
import uuidv4 from 'uuid/v4'

export default {
  name: 'app',
  data () {
    return {
      messageList: [],
      message: '',
      userId: uuidv4(),
    }
  },
  created () {
    createSocket()
    this.$socket.addListener(this.$socket.S2C_MESSAGE, (...args) => {
      this.S2CMessage(...args)
    })
  },
  beforeDestroy () {
    this.timerIndex && clearInterval(this.timerIndex)
    this.$socket.removeListener(this.$socket.S2C_MESSAGE)
    destroySocket()
    console.log('destroy')
  },
  methods: {
    S2CMessage (data) {
      this.messageList.push(data)
    },
    C2SMessage () {
      console.log(!this.message.replace(/s/gm, ''))
      if (!this.message) return
      this.$socket && this.$socket.C2SMessage(this.$socket.C2S_MESSAGE, {
        msg: this.message,
        userId: this.userId
      })
      this.message = ''
    }
  }
}
</script>

<style>
body {
  background: #FAFBFC
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  box-shadow: 0 0 3px 0 #3361d8;
  width: 50rem;
  max-width: 100%;
  background: #ECF5FD;
  position: fixed;
  border-radius: 4px;
  transform: translate(-50%, 0);
  left: 50%;
  display: flex;
  flex-direction: column;
  top: 5rem;
  bottom: 5rem;
}
.title {
  flex-shrink: 0;
  padding: .5rem;
}
.message-list {
  flex: auto;
  background: white;
  overflow: auto
}

.message-list .message {
  text-align: left;
  padding: .5rem;
}
.message-list .message .user-id {
  color: blue;
}

.message-list .message .msg {
  margin: 0 1rem;
  padding: 8px;
  background: #ECF2FC;
  border-radius: 4px;
}

.msg-send {
  flex-shrink: 0;
  display: flex;
  padding: 4px;
}
.msg-send textarea {
  flex: auto;
  border-radius: 4px;
  resize: none;
  padding: 8px 4px;
}
.msg-send button {
  float: right;
  margin: 4px;
  align-self: flex-end;
  border-radius: 4px;
  border: none;
  background: #57a3f3;
  color: white;
  height: 2rem;
  padding: 0 1rem;
  line-height: 2rem;
}

</style>
