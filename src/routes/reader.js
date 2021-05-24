const express = require("express");

const readerController = require("../controllers/reader");

const router = express.Router();

router.route("/readers").post(readerController.create);

router.route("/readers").get(readerController.findAll);

router.route("/readers/:id").get(readerController.findById);

router.route("/readers/:id").patch(readerController.update);

router.route("/readers/:id").delete(readerController.delete);

module.exports = router;
