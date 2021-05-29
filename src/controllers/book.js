const { Book } = require("../models");

exports.create = async (req, res) => {
  const checkTitle = req.body.title;
  const checkAuthor = req.body.author;

  if (checkTitle == null || checkAuthor == null) {
    return res
      .status(400)
      .send({ error: `Please ensure all fields are completed.` });
  }

  const newBook = await Book.create(req.body);
  res.status(201).json(newBook);
};
