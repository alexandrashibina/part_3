import { loadAndSortTowns } from './functions';
/*
 Страница должна предварительно загрузить список городов из
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 и отсортировать в алфавитном порядке.

 При вводе в текстовое поле, под ним должен появляться список тех городов,
 в названии которых, хотя бы частично, есть введенное значение.
 Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

 Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

 Разметку смотрите в файле towns.html

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

 *** Часть со звездочкой ***
 Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 При клике на кнопку, процесс загрузки повторяется заново
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */

import './towns.html';

const homeworkContainer = document.querySelector('#homework-container');

/*
 Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

 Массив городов пожно получить отправив асинхронный запрос по адресу
 https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 */
function loadTowns() {
  return loadAndSortTowns(); //переиспользуем функцию из предыдущего задания по загрузке и сортировке списка городов
}

/*
 Функция должна проверять встречается ли подстрока chunk в строке full
 Проверка должна происходить без учета регистра символов

 Пример:
   isMatching('Moscow', 'moscow') // true
   isMatching('Moscow', 'mosc') // true
   isMatching('Moscow', 'cow') // true
   isMatching('Moscow', 'SCO') // true
   isMatching('Moscow', 'Moscov') // false
 */
function isMatching(full, chunk) {
  //(целое, часть от целого)
  return full.toLowerCase().includes(chunk.toLowerCase()); //проверяет какие названия городов совпадают с кусочками текста который будет вводиться в инпут на странице. Все приводим к нижнему регистру, чтобы сравнивать одно с другим
}

/* Блок с надписью "Загрузка" */
const loadingBlock = homeworkContainer.querySelector('#loading-block');
/* Блок с надписью "Не удалось загрузить города" и кнопкой "Повторить" */
const loadingFailedBlock = homeworkContainer.querySelector('#loading-failed');
/* Кнопка "Повторить" */
const retryButton = homeworkContainer.querySelector('#retry-button');
/* Блок с текстовым полем и результатом поиска */
const filterBlock = homeworkContainer.querySelector('#filter-block');
/* Текстовое поле для поиска по городам */
const filterInput = homeworkContainer.querySelector('#filter-input');
/* Блок с результатами поиска */
const filterResult = homeworkContainer.querySelector('#filter-result');

let towns = [];

retryButton.addEventListener('click', () => {
  tryToLoad();
});

filterInput.addEventListener('input', function () {
  updateFilter(this.value);
});

loadingFailedBlock.classList.add('hidden');
filterBlock.classList.add('hidden');

async function tryToLoad() {
  try {
    towns = await loadTowns(); //загружает города через await.
    loadingBlock.classList.add('hidden'); //если все загрузилось хорошо, скрываем блок с "Загрузка..."
    loadingFailedBlock.classList.add('hidden'); //+ скрываем блок с ошибкой
    filterBlock.classList.remove('hidden'); //+ показываем блок с фильтрами по городам
  } catch (e) {
    //Если в момент загрузки городов возникла ошибка - все переходит в catch
    loadingBlock.classList.add('hidden'); //скрываем блок с "Загрузка..."
    loadingFailedBlock.classList.remove('hidden'); //показываем блок с ошибкой
  }
}

function updateFilter(filterValue) {
  //перебирает города которые показаны и обновляет список выведенных на странице городов
  filterResult.innerHTML = ''; //изначально пустой фильтр

  const fragment = document.createDocumentFragment(); //создаем новый фрагмент, куда все будем складывать отфильтрованные города

  for (const town of towns) {
    //перебираем все города из загруженного списка
    if (filterValue && isMatching(town.name, filterValue)) {
      //для каждого города проверяем совпадает ли он с фильтром (включен ли введенный в инпуте chunk в текущий город)
      const townDiv = document.createElement('div'); //если включен - создаем новый див, заводим туда назание города и добавляем во фрагмент
      townDiv.textContent = town.name;
      fragment.append(townDiv);
    }
  }
  filterResult.append(fragment); //как только фрагмент готов (наполнен нужными данными, добавляем его на страницу)
}

tryToLoad();

export { loadTowns, isMatching };
