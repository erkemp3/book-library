const express = require("express");

const bookController = require("../controllers/book.js");

const router = express.Router();

router.post("/", bookController.create);

router.get("/", bookController.findAll);

router.get("/:id", bookController.findById);

router.post("/title", bookController.findByTitle);

router.post("/author", bookController.findByAuthor);

router.post("/genre", bookController.findByGenre);

router.post("/isbn", bookController.findByISBN);

router.patch("/:id", bookController.update);

router.delete("/:id", bookController.remove);

module.exports = router;
