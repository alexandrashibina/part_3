//управляет окном для логина
export default class LoginWindow {
  constructor(element, onLogin) {
    //когда создаем экземпляр класса LoginWindow, мы передаем в параметры функцию onLogin, которая должна быть вызвана, когда пользователь введет логин и нажмет на кнопку войти
    this.element = element;
    this.onLogin = onLogin;

    const loginNameInput = element.querySelector('[data-role=login-name-input]'); //ищет любой эл-т у которого есть указанный в скобках селектор
    const submitButton = element.querySelector('[data-role=login-submit]');
    const loginError = element.querySelector('[data-role=login-error]'); //див где будем писать сообщение об ошибки если вдруг не ввели логин и нажали на кнопку

    submitButton.addEventListener('click', () => {
      loginError.textContent = '';

      const name = loginNameInput.value.trim(); //берем текущее значение текстового поля, куда мы вводим никнейм. The trim() method removes whitespace from both ends of a string

      if (!name) {
        //если ничего не ввели - ошибка
        loginError.textContent = 'Insert Nickname';
      } else {
        //если ввели - вызываем метод onLogin и передаем туда то что ввели
        this.onLogin(name);
      }
    });
  }

  show() {
    //метод, убирает класс hidden с эл-та
    this.element.classList.remove('hidden');
  }

  hide() {
    //метод, добавляет класс hidden в эл-т
    this.element.classList.add('hidden');
  }
}
