const app = new Vue({
    el: '#app',
    data: {
      title: 'Nestjs Websockets Chat',
      name: '',
      text: '',
      messages: [],
      socket: null,
    },
    methods: {
      sendMessage() {
        if (this.validateInput()) {
          const message = {
            name: this.name,
            text: this.text,
          };
          this.socket.emit('msgToServer', message);
          this.text = '';
        }
      },
      receivedMessage(message) {
        this.messages.push(message);
      },
      validateInput() {
        return this.name.length > 0 && this.text.length > 0;
      },
    },
    created() {
      this.socket = io('http://localhost:3000/chat'); // assets/3001 폴더에서 3001 포트로 수정해줍니다.
      this.socket.on('msgToClient', (message) => {
        this.receivedMessage(message);
      });
    },
  });
  