const express = require("express");

const readerController = require("../controllers/reader");

const router = express.Router();

router.route("/readers").post(readerController.create);

module.exports = router;
