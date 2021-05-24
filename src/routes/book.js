const express = require("express");

const bookController = require("../controllers/book");

const router = express.Router();

router.route("/books").post(bookController.create);

module.exports = router;
