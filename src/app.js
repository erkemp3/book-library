const express = require("express");
const app = express();

const readerRouter = require("./routes/reader");
const bookRouter = require("./routes/book");

app.use(express.json());

app.use(readerRouter);
app.use(bookRouter);

module.exports = app;
