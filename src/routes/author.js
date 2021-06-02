const express = require("express");

const authorController = require("../controllers/author.js");

const router = express.Router();

router.post("/", authorController.create);

router.get("/", authorController.findAll);

router.get("/:id", authorController.findById);

router.patch("/:id", authorController.update);

router.delete("/:id", authorController.remove);

module.exports = router;
