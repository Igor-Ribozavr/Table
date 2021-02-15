const express = require('express');
const data = require('./data');
const cors = require('cors');
const app = express();
const PORT = '4000';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000'],
    optionsSuccessStatus: 200,
  })
);

app.get('/', (req, res) => {
  res.status(200).json(data);
});

async function start() {
  try {
    app.listen(PORT, () => {
      console.log(`Listening port ${PORT}!`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
