import LoginWindow from './ui/loginWindow.js';
import MainWindow from './ui/mainWindow.js';
import UserName from './ui/userName.js';
import UserList from './ui/userList.js';
import UserPhoto from './ui/userPhoto.js';
import MessageList from './ui/messageList.js';
import MessageSender from './ui/messageSender.js';
import WSClient from './wsClient.js';

//здесь каждый эл-т интерфейчас оборачиваем в отдельный класс
export default class Chat {
  constructor() {
    this.wsClient = new WSClient(
      `ws://${location.host}/ws`, //говорим куда подключаемся
      this.onMessage.bind(this) //когда с сервера будут приходить какие-то сообщения по вебсокету, мы выполняем функцию onMessage
    );

    this.ui = {
      //св-во ui - обычный объект, в него сложили три объекта наших классов (отдельная папка)
      loginWindow: new LoginWindow( //окошко для логина
        document.querySelector('#login'), //передаем эл-т где окно логина находится
        this.onLogin.bind(this) //передаем метод onLogin - когда пользователь нажмет на кнопку войти, нужно вызвать метод onLogin
      ),
      mainWindow: new MainWindow(document.querySelector('#main')), //главное окно - чат и юзеры
      userName: new UserName(document.querySelector('[data-role=user-name]')), //левая чать главного окна где имя юзера (меня)
      userList: new UserList(document.querySelector('[data-role=user-list]')),
      messageList: new MessageList(document.querySelector('[data-role=message-list]')),
      messageSender: new MessageSender(
        document.querySelector('[data-role=message-sender]'),
        this.onSend.bind(this)
      ),
      userPhoto: new UserPhoto(
        document.querySelector('[data-role=user-photo]'),
        this.onUpload.bind(this)
      ),
    };
    this.ui.loginWindow.show(); //в самом начале, как только загрузилась страница - запускаем метод show для loginWindow
  }

  onUpload(data) {
    this.ui.userPhoto.set(data);

    fetch('/upload-photo', {
      method: 'post',
      body: JSON.stringify({
        name: this.ui.userName.get(),
        image: data,
      }),
    });
  }

  onSend(message) {
    this.wsClient.sendTextMessage(message);
    this.ui.messageSender.clear();
  }

  async onLogin(name) {
    await this.wsClient.connect(); //соединяемся с сервером
    this.wsClient.sendHello(name); //тут же отправляем ему hello
    this.ui.loginWindow.hide(); //скрывает див класса с окошком логина
    this.ui.mainWindow.show(); //показывает див класса с основным окном
    this.ui.userName.set(name); //записывает введение в поле логина имя и показывает его в основном окне в поле data-role=user-name
    this.ui.userPhoto.set(`/photos/${name}.png?t=${Date.now()}`);
  }

  onMessage({ type, from, data }) {
    if (type === 'hello') {
      //каждый раз когда приходит сообщение с типом hello - в чат добавлися новый юзер
      this.ui.userList.add(from); //нужно добавить имя юзера в список слева
      this.ui.messageList.addSystemMessage(`${from} вошел в чат`); //показать надпись в чате
    } else if (type === 'user-list') {
      //присылается новому зарегистрированному пользователю, чтобы определить какие пользователи сейчас находятся в чате
      for (const item of data) {
        //преебираем список с уже существующими юзерами и для каждого юзера добавляем нового
        this.ui.userList.add(item);
      }
    } else if (type === 'bye-bye') {
      this.ui.userList.remove(from);
      this.ui.messageList.addSystemMessage(`${from} вышел из чата`);
    } else if (type === 'text-message') {
      this.ui.messageList.add(from, data.message);
    } else if (type === 'photo-changed') {
      const avatars = document.querySelectorAll(
        `[data-role=user-avatar][data-user=${data.name}]`
      );

      for (const avatar of avatars) {
        avatar.style.backgroundImage = `url(/photos/${data.name}.png?t=${Date.now()})`;
      }
    }
  }
}
