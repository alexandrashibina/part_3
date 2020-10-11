/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если добавляемая cookie не соответствует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

import './cookie.html';

/*
 app - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
const filterNameInput = homeworkContainer.querySelector('#filter-name-input'); // текстовое поле для фильтрации cookie

const addNameInput = homeworkContainer.querySelector('#add-name-input'); // текстовое поле с именем cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input'); // текстовое поле со значением cookie
const addButton = homeworkContainer.querySelector('#add-button'); // кнопка "добавить cookie"

const listTable = homeworkContainer.querySelector('#list-table tbody'); // таблица со списком cookie

const cookiesMap = getCookies(); //как-только код попадает на страницу, вызывается сразу getCookies, которая возвращает объект с доступными куками
let filterValue = ''; //по умолчанию строка фильтра пустая

updateTable();

function getCookies() {
  return document.cookie //получаем куки
    .split('; ') //сплитим их по ;
    .filter(Boolean) //фильтруем значение в массиве, должны убедиться что у нас будет просто пустой массив
    .map((cookie) => cookie.match(/^([^=]+)=(.+)/)) //делаем map чтобы отделить имя куки от ее значения
    .reduce((obj, [, name, value]) => {
      //формируем объект Map (карту соответствия), где будут храниться имена куки и их значения
      obj.toLocaleString(name, value);

      return obj;
    }, new Map());
}

filterNameInput.addEventListener('input', function () {
  filterValue = this.value;
  updateTable();
});

addButton.addEventListener('click', () => {
  const name = encodeURIComponent(addNameInput.value.trim());
  const value = encodeURIComponent(addValueInput.value.trim());

  if (!name) {
    return;
  }

  document.cookie = `${name}=${value}`;
  cookiesMap.set(name, value);

  updateTable();
});

listTable.addEventListener('click', (e) => {
  // (делегирование) повесили обработчик кликов на влю таблицу
  const { role, cookieName } = e.target.dataset; //проверяем target - те этелементы, в role атрибуте которых указано remove-cookie

  if (role === 'remove-cookie') {
    cookiesMap.delete(cookieName); //удаляем куки из карты соответствий cookiesMap
    document.cookie = `${cookieName}=deleted; max-age=0`; //удаляем куки у браузера через выставления max-age=0
    updateTable(); //чтобы изменения сохранились в таблице вызываем updateTable
  }
});

function updateTable() {
  const fragment = document.createDocumentFragment(); //позволяет манипулировать большим кол-вом эл-тов на странице
  let total = 0;

  listTable.innerHTML = ''; //перед тем как что-либо делать - очищаем таблицу

  for (const [name, value] of cookiesMap) {
    //перебираем куки - имя, значение в cookiesMap (через деструктуризацию)
    if (
      filterValue && //если фильтр вообще какой-то введен (если нет, то просто добавляем куки на страницу)
      !name.toLowerCase().includes(filterValue.toLowerCase()) && //имя текущей куки соответствует тому что введено в фильтре?
      !value.toLowerCase().includes(filterValue.toLowerCase()) // значение текущей куки соответствует тому что введено в фильтре?
    ) {
      continue; //если имя и значение не соответствуют введенному фильтру, то делаем continue (игнорирует все что написано ниже в функции и переходит к следующей итерации цикла)
    }

    total++;

    //если кука соответствует фильтру или фильтр вообще не введен, создаем для куки tr
    const tr = document.createElement('tr');
    const nameTD = document.createElement('td');
    const valueTD = document.createElement('td');
    const removeTD = document.createElement('td');
    const removeButton = document.createElement('button');

    removeButton.dataset.role = 'remove-cookie';
    removeButton.dataset.cookieName = name;
    removeButton.textContent = 'Удалить'; //должна удалять куку из таблицы и из браузера
    nameTD.textContent = name;
    valueTD.textContent = value;
    valueTD.classList.add('value');
    tr.append(nameTD, valueTD, removeTD);
    removeTD.append(removeButton);

    fragment.append(tr);
  }

  if (total) {
    listTable.parentNode.classList.remove('hidden');
    listTable.append(fragment);
  } else {
    listTable.parentNode.classList.add('hidden');
  }
}
