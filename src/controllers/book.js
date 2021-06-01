const { Book } = require("../models");
const helper = require("./helper");

const create = async (req, res) => {
  const checkTitle = req.body.title;
  const checkISBN = req.body.ISBN;
  if (
    checkTitle == null ||
    checkISBN == null ||
    checkTitle == "" ||
    checkISBN == ""
  ) {
    return res
      .status(400)
      .send({ error: `Please ensure all fields are completed.` });
  }

  const checkExisting = await Book.findAll({
    where: {
      title: req.body.title,
      ISBN: req.body.ISBN,
    },
  });
  if (checkExisting[0]) {
    return res
      .status(409)
      .send({
        error: `The book ${req.body.title} is already in this library.`,
      });
  }

  helper.create("book", req, res);
};

const findAll = async (req, res) => {
  helper.findAll("book", req, res);
};

const findById = async (req, res) => {
  helper.findById("book", req, res);
};

const findByTitle = async (req, res) => {
  const thisBook = await Book.findAll({
    where: {
      title: req.body.title,
    },
  });
  if (!thisBook) {
    return res.status(404).send({ error: "The book could not be found." });
  }
  res.status(200).json(thisBook);
};

const findByAuthor = async (req, res) => {
  const books = await Book.findAll({
    where: {
      author: req.body.author,
    },
  });
  if (!books) {
    return res.status(404).send({ error: "No books by this author." });
  }
  res.status(200).json(books);
};

const findByGenre = async (req, res) => {
  const books = await Book.findAll({
    where: {
      genre: req.body.genre,
    },
  });
  if (!books) {
    return res.status(404).send({ error: "No books in this genre." });
  }
  res.status(200).json(books);
};

const findByISBN = async (req, res) => {
  const books = await Book.findAll({
    where: {
      ISBN: req.body.ISBN,
    },
  });
  if (!books) {
    return res.status(404).send({ error: "No books in this genre." });
  }
  res.status(200).json(books);
};

const update = async (req, res) => {
  helper.update("book", req, res);
};

const remove = async (req, res) => {
  helper.remove("book", req, res);
};

module.exports = {
  create,
  findAll,
  findById,
  findByTitle,
  findByAuthor,
  findByGenre,
  findByISBN,
  update,
  remove,
};
