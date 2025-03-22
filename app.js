const express = require("express");
const cors = require("cors");
const booksRouter = require("./app/routes/book.route");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/books", booksRouter);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to book application." });
});

module.exports = app;