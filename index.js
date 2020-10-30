require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.static('./public'));
app.use(express.json());

app.post('/search', (req, res) => {
  const { name, ip } = req.body;
  res.status(200).send(Object.assign({}, { name, ip }));
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
