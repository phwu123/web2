const express = require('express');
const parser = require('body-parser');
const path = require('path');

const app = express();

app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

app.use(express.static(path.join(__dirname, '/public')));

const port = 3000;

app.listen(port, () => {
  console.log('server connected to ', port);
})