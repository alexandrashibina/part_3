// const http = require('http');
// const fs = require('fs');
// const path = require('path');
// const dataPath = path.join(__dirname, 'data.json');

// createServer();

// function readBody(req) {
//   return new Promise((resolve, reject) => {
//     let dataRaw = '';

//     req.on('data', (chunk) => (dataRaw += chunk));
//     req.on('error', reject);
//     req.on('end', () => resolve(JSON.parse(dataRaw)));
//   });
// }

// function end(res, data, statusCode = 200) {
//   res.statusCode = statusCode;
//   res.end(JSON.stringify(data));
// }

// function createServer() {
//   const storage = new Storage();

//   http.createServer(async (req, res) => {
//       res.setHeader('content-type', 'application/json');

//       console.log('>', req.method, req.url);

//       if (req.method !== 'post') {
//         end(res, {});
//         return;
//       }

//       try {const body = await readBody(req);
//         if (req.url === '/coords') {
//           end(res, storage.getCoords());

//         } else if (req.url === '/add') {
//           storage.add(body);
//           end(res, { ok: true });

//         } else if (req.url === '/list') {
//           end(res, storage.getByCoords(body.coords));

//         } else {
//           end(res, {});
//         }
//       } 
      
//       catch (e) {
//         end(res, { error: { message: e.message } }, 500);
//       }
//     })
// }

// class Storage {
//   constructor() {
//     if (!fs.existsSync(dataPath)) {
//       fs.writeFileSync(dataPath, '{}');
//       this.data = {};
//     } else {
//       this.data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
//     }
//   }

//   validateReview(review) {
//     if (!review || !review.name || !review.place || !review.text) {
//       throw new Error('Invalid review data');
//     }
//   }

//   getIndex(coords) {
//     return `${coords[0]}_${coords[1]}`;
//   }

//   getCoords() {
//     const coords = [];

//     for (const item in this.data) {
//       coords.push({
//         coords: item.split('_'),
//         total: this.data[item].length,
//       });
//     }

//     return coords;
//   }
  
//   add(data) {
//     this.validateReview(data.review);
//     const index = this.getIndex(data.coords);
//     this.data[index] = this.data[index] || [];
//     this.data[index].push(data.review);
//     this.updateStorage();
//   }


//   getByCoords(coords) {
//     this.validateCoords(coords);
//     const index = this.getIndex(coords);
//     return this.data[index] || [];
//   }

//   updateStorage() {
//     fs.writeFile(dataPath, JSON.stringify(this.data), () => {});
//   }
// }
