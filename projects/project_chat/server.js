//обязательно нужен npm install
const http = require('http');
const fs = require('fs');
const { Server } = require('ws');
const path = require('path');

function readBody(req) {
  return new Promise((resolve, reject) => {
    let dataRaw = '';

    req.on('data', (chunk) => (dataRaw += chunk));
    req.on('error', reject);
    req.on('end', () => resolve(JSON.parse(dataRaw)));
  });
}

const server = http.createServer(async (req, res) => {
  try {
    if (/\/photos\/.+\.png/.test(req.url)) {
      const [, imageName] = req.url.match(/\/photos\/(.+\.png)/) || [];
      const fallBackPath = path.resolve(__dirname, './no-photo.png');
      const filePath = path.resolve(__dirname, './photos', imageName);

      if (fs.existsSync(filePath)) {
        return fs.createReadStream(filePath).pipe(res);
      } else {
        return fs.createReadStream(fallBackPath).pipe(res);
      }
    } else if (req.url.endsWith('/upload-photo')) {
      const body = await readBody(req);
      const name = body.name.replace(/\.\.\/|\//, '');
      const [, content] = body.image.match(/data:image\/.+?;base64,(.+)/) || [];
      const filePath = path.resolve(__dirname, './photos', `${name}.png`);

      if (name && content) {
        fs.writeFileSync(filePath, content, 'base64');

        broadcast(connections, { type: 'photo-changed', data: { name } });
      } else {
        return res.end('fail');
      }
    }

    res.end('ok');
  } catch (e) {
    console.error(e);
    res.end('fail');
  }
});

const wss = new Server({ port: 8080, clientTracking: true });
const connections = new Map(); //каждй клиент, который подключится к веб-сокет серверу, будет помещен в карту (Map)

wss.on('connection', (socket) => {
  //каждый раз когда кто-то подключается к веб-сокет серверу
  connections.set(socket, {}); // мы создаем новую запить в карте. Сокет - это клиент, при новом подключении создаем новый обхект и помещает его в карту

  socket.on('message', (messageData) => {
    //слушаем сообщения сокета(юзера) - месседж, когда он что-то присылает, и close - когда клиент уходит
    const message = JSON.parse(messageData);
    let excludeItself = false;

    if (message.type === 'hello') {
      //сообщения с типом hello - это новый пользователь
      excludeItself = true;
      connections.get(socket).userName = message.data.name; //безем информацию о текущем соединении и присваиваем ему свойство UserName
      sendMessageTo(
        {
          type: 'user-list',
          data: [...connections.values()].map((item) => item.userName).filter(Boolean),
        },
        socket
      );
    }

    sendMessageFrom(connections, message, socket, excludeItself);
  });

  socket.on('close', () => {
    sendMessageFrom(connections, { type: 'bye-bye' }, socket);
    connections.delete(socket);
  });
});

function sendMessageTo(message, to) {
  to.send(JSON.stringify(message));
}

function broadcast(connections, message) {
  for (const connection of connections.key()) {
    connection.send(JSON.stringify(message));
  }
}

function sendMessageFrom(connections, message, from, excludeSelf) {
  const socketData = connections.get(from);

  if (!socketData) {
    return;
  }

  message.from = socketData.userName;

  for (const connection of connections.keys()) {
    if (connection === from && excludeSelf) {
      continue;
    }

    connection.send(JSON.stringify(message));
  }
}

server.listen(8080);
