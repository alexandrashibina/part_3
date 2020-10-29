export default class UserList {
  constructor(element) {
    this.element = element; //ссылка на ДОМ эл-т с которым будем производить манипуляции
    this.items = new Set(); //ссылка на сет - уникальный списк наших пользователей (сюда будут добавлятсья и удаляться эл-ты)
  }

  buildDom() {
    const fragment = document.createDocumentFragment(); //чтобы добавлять сразу несколько эл-тов исп фрагмент - улучшает производительность

    this.element.innerHTML = '';

    for (const name of this.items) {
      //set (список из имен пользователей) превращаем в ДОМ-дерево
      const element = document.createElement('div'); //для каждого эл-та в цикле создаем див, класс и добавляем текстконтент
      element.classList.add('user-list-item');
      element.textContent = name;
      fragment.append(element);
    }

    this.element.append(fragment);
  }

  add(name) {
    this.items.add(name); //добавляем эл-т в список items
    this.buildDom(); // и вызываем функцию buildDom
  }

  remove(name) {
    this.items.delete(name);
    this.buildDom();
  }
}
