const express = require("express");

const borrows = require('../controllers/borrow.controller');

const router = express.Router();



router.route("/")
    .get(borrows.findAll)
    .post(borrows.create)
    .delete(borrows.deleteAll);

router.route("/:id")
    .get(borrows.findOne)
    .put(borrows.update)
    .delete(borrows.delete);


module.exports = router;