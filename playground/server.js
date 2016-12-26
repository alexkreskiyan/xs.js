const express = require('express');
const path = require('path');

const app = express();
const port = +process.argv[2] || 5000;

app.use(express.static(path.resolve(__dirname, '..')));
app.listen(port);