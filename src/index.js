const express = require('express');
const router = require('./router.js');

const app = express();
const port = 7010;

app.use(express.json());
app.use((_, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/api/v1', router);

const startApp = () => {
  try {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startApp();
