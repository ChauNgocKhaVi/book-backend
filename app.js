const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error");
const app = express();

const booksRouter = require("./app/routes/book.route");
const readersRouter = require("./app/routes/reader.route");
const publishersRouter = require("./app/routes/publisher.route");
const staffsRouter = require("./app/routes/staff.route");
const borrowsRouter = require("./app/routes/borrow.route");

app.use(cors());
app.use(express.json());
app.use("/api/books", booksRouter);
app.use("/api/readers", readersRouter);
app.use("/api/publishers", publishersRouter);
app.use("/api/staffs", staffsRouter);
app.use("/api/borrows", borrowsRouter);

app.use((req, res, next) => {
    return next(new ApiError (404, "Resource not found"));
});

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
     message: err.message || "Internal Server Error",
    });
});


app.get("/", (req, res) => {
    res.json({ message: "Welcome to book application." });
});

module.exports = app;