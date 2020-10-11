/* Задание со звездочкой */

/*
 Создайте страницу с кнопкой.
 При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией на экране
 Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
import './dnd.html';

const homeworkContainer = document.querySelector('#app');

function random(from, to) {
  // генерим рандомное число от from до to
  return parseInt(from + Math.random() * to - from); //генерит случайное число через Math.random() от 0 до 1, прибавив в этому 100 получим диапозон случайных чисел от 0 до 100, Math.random.toFixed() или Math.round(100 + Math.random()) убирает дробную часть, осатвляя только целое
}

//эти переменные нужны для реализации drag and drop
let currentDrag; //текущее положение элемента
let startX = 0;
let startY = 0;

document.addEventListener('mousemove', (e) => {
  if (currentDrag) {
    //на каждое событие mousemove проверяем есть ли что-то в переменной currentDrag, если есть то меняем css свойства эл-та из currentDrag
    currentDrag.style.top = e.clientY - startY + 'px'; //св-во top меняем на текущее по Y (e.clientY) - само смещение
    currentDrag.style.left = e.clientX - startX + 'px'; //св-во left меняем на текущее по X (e.clientX) - само смещение
  }
});

export function createDiv() {
  //создает новый div с три переменные (диапозон размеров эл-тов)
  const div = document.createElement('div');
  const minSize = 20;
  const maxSize = 200;
  const maxColor = 0xffffff; //максимальное число в 10тичной системе которое может принимать цвет

  div.className = 'draggable-div';
  div.style.background = '#' + random(0, maxColor).toString(16); //задаем рандомный цвет фона от 0 до максимума, переводя его из 10тичной систему в 16тиричную через toString(16)
  div.style.top = random(0, window.innerHeight) + 'px'; //задаем рандомную координату top и left (от 0 до текущей высоты/ширины окна)
  div.style.left = random(0, window.innerWidth) + 'px';
  div.style.width = random(minSize, maxSize) + 'px'; //задаем рандомный размер по height и width (от 20 до 200px)
  div.style.height = random(minSize, maxSize) + 'px';

  div.addEventListener('mousedown', (e) => {
    //при наступлении события mousedown в currentDrag записывается текущий div (чтобы потом при событии mousemove в переменной currentDrag проверять есть ли там что-то и менять позицию этого div)
    currentDrag = div;
    startX = e.offsetX;
    startY = e.offsetY;
  });
  div.addEventListener('mouseup', () => (currentDrag = false)); //при наступлении события mouseup присваиваем currentDrag = false, говоря что нам больше ничего немы боль ничего не тащим
  return div;
}

const addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function () {
  const div = createDiv();
  homeworkContainer.appendChild(div);
});
