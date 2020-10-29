export default class WSClient {
  constructor(url, onMessage) {
    this.url = url;
    this.onMessage = onMessage;
  }

  connect() {
    return new Promise((resolve) => {
      //соединяемся с вебсокетов
      this.socket = new WebSocket(this.url);
      this.socket.addEventListener('open', resolve); //просто ждем когда он выдаст событие open
      this.socket.addEventListener('message', (e) => {
        this.onMessage(JSON.parse(e.data).slice(1, -1));
      });
    });
  }

  sendHello(name) {
    this.sendMessage('hello', { name }); //когда заходим в чат - сообщение серверу, чтобы он смог направить сообщение всем пользователям
  }

  sendTextMessage(message) {
    //вызываем когда хотим отправить какое-то текстовое сообщение
    this.sendMessage('text-message', { message });
  }

  sendMessage(type, data) {
    //универсальный метод передачи сообщения, в параметрах тип сообщения и его текст
    this.socket.send(
      JSON.stringify({
        type,
        data,
      }) //делаем через stringify так как по вебсокету можно передавать только тсроки
    );
  }
}
