require('dotenv').config();
const express = require('express');
const cors = require('cors');
const IPData = require('ipdata').default;
// const nodeIP = require('ip');
const requestIP = require('request-ip');

const app = express();
const ipdata = new IPData(process.env.API_KEY);

app.use(cors());
app.use(express.static('./public'));
app.use(express.json());

app.post('/search', async (req, res) => {
  const { ip } = req.body;
  // console.log({ req });
  let ipToLookUp;

  if (!ip) {
    ipToLookUp = requestIP.getClientIp(req);
  } else {
    ipToLookUp = ip;
  }

  try {
    const info = await ipdata.lookup(ip);
    res.status(200).send(info);
  } catch (error) {
    console.log({ error: error.message });
    res.send({ error: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port on ${process.env.PORT}`);
});
