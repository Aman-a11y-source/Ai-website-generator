const http = require('http');

const data = JSON.stringify({
  messages: [{ role: 'user', content: 'hi' }]
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/ai-model',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk.toString()}`);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
