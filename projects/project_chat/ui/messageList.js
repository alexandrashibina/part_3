import { sanitize } from '../utils.js';

export default class MessageList {
  constructor(element) {
    this.element = element; //эл-т с которым мы работаем (ссылка ведет на querySelectorтв chat.js, где указан метод MessageList)
  }

  add(from, text) {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, 0);
    const minutes = String(date.getMinutes()).padStart(2, 0);
    const time = `${hours}:${minutes}`;
    const item = document.createElement('div');

    item.classList.add('message-item');
    item.innerHTML = `
        <div class="message-item-left">
            <div class="message-item-photo" data-role="user-avatar" data-user=${sanitize(
              from
            )}></div>
        </div>
        <div class="message-item-right">
            <div class="message-item-header">
                <div class="message-item-header-name">${sanitize(from)}</div>
                <div class="message-item-header-time">${time}</div>
            </div>
            <div class="message-item-text">${sanitize(text)}</div>
        </div>
        `;

    this.element.append(item);
    this.element.scrollTop = this.element.scrollHeight;
  }

  addSystemMessage(message) {
    const item = document.createElement('div'); //создает див, добавляет классы, добавляет месседж

    item.classList.add('message-item', 'message-item-system');
    item.textContent = message;

    this.element.append(item); //добавляет текст сообщения в список сообщений
    this.element.scrollTop = this.element.scrollHeight; //изменяем скролл - прибиваем список к низу, чтобы каждый раз не скроллить
  }
}
