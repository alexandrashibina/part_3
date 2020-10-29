export default class UserName {
  constructor(element) {
    //запоминаем эл-т с которым работаем
    this.element = element;
  }

  set(name) {
    this.name = name; //запоминем имя пользователя
    this.element.textContent = name; //обновляем textContent у того самого эл-та
  }

  get() {
    return this.name; //если захотим извлечь имя пользователя из этого эл-та (для чата)
  }
}
