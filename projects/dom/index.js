/* ДЗ 4 - работа с DOM */

/*
 Задание 1:

 1.1: Функция должна создать элемент с тегом DIV

 1.2: В созданный элемент необходимо поместить текст, переданный в параметр text

 Пример:
   createDivWithText('loftschool') // создаст элемент div, поместит в него 'loftschool' и вернет созданный элемент
 */
function createDivWithText(text) {
  const element = document.createElement('div');
  element.textContent = text;
  return element;
}

/*
 Задание 2:

 Функция должна вставлять элемент, переданный в параметре what в начало элемента, переданного в параметре where

 Пример:
   prepend(document.querySelector('#one'), document.querySelector('#two')) // добавит элемент переданный первым аргументом в начало элемента переданного вторым аргументом
 */
function prepend(what, where) {
  where.insertBefore(what, where.firstElementChild); //или через where.prepend(what)
}

/*
 Задание 3:

 3.1: Функция должна перебрать все дочерние элементы узла, переданного в параметре where

 3.2: Функция должна вернуть массив, состоящий из тех дочерних элементов следующим соседом которых является элемент с тегом P

 Пример:
   Представим, что есть разметка:
   <body>
      <div></div>
      <p></p>
      <a></a>
      <span></span>
      <p></p>
   </body>

   findAllPSiblings(document.body) // функция должна вернуть массив с элементами div и span т.к. следующим соседом этих элементов является элемент с тегом P
 */
function findAllPSiblings(where) {
  const newarr = [];

  for (const el of where.children) {
    if (el.nextElementSibling && el.nextElementSibling.tagName === 'p') {
      newarr.push(el);
    }
  }
}

/*
 Задание 4:

 Функция представленная ниже, перебирает все дочерние узлы типа "элемент" внутри узла переданного в параметре where и возвращает массив из текстового содержимого найденных элементов
 Но похоже, что в код функции закралась ошибка и она работает не так, как описано.

 Необходимо найти и исправить ошибку в коде так, чтобы функция работала так, как описано выше.

 Пример:
   Представим, что есть разметка:
   <body>
      <div>привет</div>
      <div>loftschool</div>
   </body>

   findError(document.body) // функция должна вернуть массив с элементами 'привет' и 'loftschool'
 */
function findError(where) {
  const result = [];

  for (const child of where.children) {
    result.push(child.textContent);
  }

  return result;
}

/*
 Задание 5:

 Функция должна перебрать все дочерние узлы элемента переданного в параметре where и удалить из него все текстовые узлы

 Задачу необходимо решить без использования рекурсии, то есть можно не уходить вглубь дерева.
 Так же будьте внимательны при удалении узлов, т.к. можно получить неожиданное поведение при переборе узлов

 Пример:
   После выполнения функции, дерево <div></div>привет<p></p>loftchool!!!
   должно быть преобразовано в <div></div><p></p>
 */
function deleteTextNodes(where) {
  for (let i = 0; i < where.childNodes.length; i++) {
    const el = where.childNodes[i];

    if (el.nodeType === Element.TEXT_NODE) {
      //ищет в элементе el текстовый узел
      where.removeChild(el);
      i--; //удаляет текстовый узел, смещает всё на -1, так как при удалении элемента изменяется порядок
    }
  }
}

/*
 Задание 6:

 Выполнить предыдущее задание с использование рекурсии - то есть необходимо заходить внутрь каждого дочернего элемента (углубляться в дерево)

 Будьте внимательны при удалении узлов, т.к. можно получить неожиданное поведение при переборе узлов

 Пример:
   После выполнения функции, дерево <span> <div> <b>привет</b> </div> <p>loftchool</p> !!!</span>
   должно быть преобразовано в <span><div><b></b></div><p></p></span>
 */
function deleteTextNodesRecursive(where) {
  for (let i = 0; i < where.childNodes.length; i++) {
    const el = where.childNodes[i];

    if (el.nodeType === Element.TEXT_NODE) {
      where.removeChild(el);
      i--;
    } else if (el.nodeType === Element.ELEMENT_NODE) {
      // если по предыдущему условию перебираемый элемент - не текстовый узел,
      deleteTextNodesRecursive(el); //то идем во внутрь этого элемента и перебираем там элементы точно также (удаляя текстовые узлы)
    }
  }
}

/*
 Задание 7 *:

 Необходимо собрать статистику по всем узлам внутри элемента переданного в параметре root и вернуть ее в виде объекта
 Статистика должна содержать:
 - количество текстовых узлов
 - количество элементов каждого класса
 - количество элементов каждого тега
 Для работы с классами рекомендуется использовать classList
 Постарайтесь не создавать глобальных переменных

 Пример:
   Для дерева <div class="some-class-1"><b>привет!</b> <b class="some-class-1 some-class-2">loftschool</b></div>
   должен быть возвращен такой объект:
   {
     tags: { DIV: 1, B: 2},
     classes: { "some-class-1": 2, "some-class-2": 1 },
     texts: 3
   }
 */
function collectDOMStat(root) {
  const newobj = {
    tags: {},
    classes: {},
    texts: 0,
  };

  function scan(root) {
    for (const child of root.childNodes) {
      //перебираем все узлы root дерева
      if (child.nodeType === Node.TEXT_NODE) {
        //если это текстовый узел
        newobj.texts++; //то увеличиваем количество texts в newobj на +1 каждый раз
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        //если узел типа элемент то мы собираем статистику по классам по каждому элементу
        if (child.tagName in newobj.tags) {
          //если статистика (tagName) по этому эл-ту уже есть,
          newobj.tags[child.tagName]++; // то мы просто увеличиваем его количество на +1
        } else {
          newobj.tags[child.tagName] = 1; //если такого элементна еще нет в newobj, то добавляем его туда
        }

        for (const className of child.classList) {
          //собираем статистику по классам через ClassList
          if (className in newobj.classes) {
            newobj.classes[className]++; //если такой класс уже есть в newobj, то увеличиваем его на 1
          } else {
            newobj.classes[className] = 1; //если нет, то добавляем его в newobj
          }
        }
        scan(child); //если в стуктуре есть узел типа элемент, то мы уходим в глубь него, рекурсивно вызывая функцию scan и проходя тот же процесс уже по узлам внутри элемента
      }
    }
  }

  scan(root); //вызываем функцию с запрашиваемым параметром root

  return newobj; //возвращаем новый объект со статистикой
}

/*
 Задание 8 *:

 8.1: Функция должна отслеживать добавление и удаление элементов внутри элемента переданного в параметре where
 Как только в where добавляются или удаляются элементы,
 необходимо сообщать об этом при помощи вызова функции переданной в параметре fn

 8.2: При вызове fn необходимо передавать ей в качестве аргумента объект с двумя свойствами:
   - type: типа события (insert или remove)
   - nodes: массив из удаленных или добавленных элементов (в зависимости от события)

 8.3: Отслеживание должно работать вне зависимости от глубины создаваемых/удаляемых элементов

 Рекомендуется использовать MutationObserver

 Пример:
   Если в where или в одного из его детей добавляется элемент div
   то fn должна быть вызвана с аргументом:
   {
     type: 'insert',
     nodes: [div]
   }

   ------

   Если из where или из одного из его детей удаляется элемент div
   то fn должна быть вызвана с аргументом:
   {
     type: 'remove',
     nodes: [div]
   }
 */
function observeChildNodes(where, fn) {
  //MutationObserver - следит за изменениями в DOM дереве. 2 шага - настройка обзервера и старт отслеживания изменений - observer.observe

  const observer = new MutationObserver((mutations) => {
    //первый шаг, настройка обзервера. Принимает параметр mutations и в качестве аргумента туда передаются изменения произошедшие в ДОМ дереве
    mutations.forEach((mutation) => {
      //перебираем все изменения, которые произошли в ДОМ дереве
      if (mutation.type === 'childList') {
        //если изменение с типом chilList то выполняем функцию fn. В этих изменениях есть специальное св-во addNodes/removeNodes (добавление/удаление узлов)
        fn({
          type: mutation.addNodes.length ? 'insert' : 'remove', //если в addNodes что-то есть - это insert, если нет - remove
          nodes: [
            ...(mutation.addNodes.length ? mutation.addNodes : mutation.removeNodes), //определяем из какого эл-та нужно эти изменения достать
          ],
        });
      }
    });
  });
  observer.observe(where, {
    //второй шаг, старт отслеживания изменений observer.observe в where, вторым аргументом передаем усолвие в каких случаях будет сигнализироваться что что-то произошло
    childList: true, //childtree = true - регирует на любые изменения в дереве (удаления, добавления),
    subtree: true,
  }); //subtree == true - вне зависимости от глубины этих изменений
}

export {
  createDivWithText,
  prepend,
  findAllPSiblings,
  findError,
  deleteTextNodes,
  deleteTextNodesRecursive,
  collectDOMStat,
  observeChildNodes,
};
