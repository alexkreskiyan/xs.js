const express = require('express');

const app = express();
const port = +process.argv[2] || 4000;

app.use(express.static(__dirname));
app.listen(port);