const express = require("express");
const cors = require("cors");
const booksRouter = require("./app/routes/book.route");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/books", booksRouter);

app.use((req, res, next) => {
    return next(new ApiError (404, "Resource not found"));
});

app.use((err, req, res, next) => {
    return res.status(error.statusCode || 500).json({
     message: error.message || "Internal Server Error",
    });
});


app.get("/", (req, res) => {
    res.json({ message: "Welcome to book application." });
});

module.exports = app;