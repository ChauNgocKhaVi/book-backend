const express = require("express");

const books = require('../controllers/book.controller');

const router = express.Router();

router.route("/")
    .get(books.findAll)
    .post(books.create)
    .delete(books.deleteAll);
    
router.route("/:id")
    .get(books.findOne)
    .put(books.update)
    .delete(books.delete);

// cập nhật số quyển bị trừ    
router.route("/borrow/:id").put(books.borrowBook); 

router.patch("/:id/returnBook", books.returnBook);

module.exports = router;