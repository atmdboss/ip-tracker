require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.static('./public'));
app.use(express.json());

app.post('/search', async (req, res) => {
  const { ip } = req.body;

  try {
    const { data } = await axios.get(
      `https://geo.ipify.org/api/v1?apiKey=${process.env.API_KEY}&ipAddress=${ip}`
    );
    res.status(200).send(data);
  } catch (error) {
    console.log({ error: error.message });
    res.send({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
