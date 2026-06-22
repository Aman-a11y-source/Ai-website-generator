const https = require('https');

https.get('https://openrouter.ai/api/v1/models', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const models = JSON.parse(data).data;
      const freeModels = models.filter(m => m.id.includes(':free')).slice(0, 10);
      console.log('Top 10 free models:', freeModels.map(m => m.id));
    } catch (e) {
      console.error(e);
    }
  });
}).on('error', (e) => {
  console.error(e);
});
