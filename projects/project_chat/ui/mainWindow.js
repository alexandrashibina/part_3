export default class MainWindow {
  constructor(element) {
    this.element = element;
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
