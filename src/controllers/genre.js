const { Genre } = require("../models");
const helper = require("./helper");

const create = async (req, res) => {
  const checkGenre = req.body.genre;
  if (checkGenre == null) {
    return res
      .status(400)
      .send({ error: `Please ensure all fields are completed.` });
  }

  const checkExisting = await Genre.findAll({
    where: {
      genre: req.body.genre,
    },
  });
  if (checkExisting[0]) {
    return res
      .status(409)
      .send({ error: `The genre ${req.body.genre} already exists.` });
  }

  helper.create("genre", req, res);
};

const findAll = async (req, res) => {
  helper.findAll("genre", req, res);
};

const findById = async (req, res) => {
  helper.findById("genre", req, res);
};

const update = async (req, res) => {
  helper.update("genre", req, res);
};

const remove = async (req, res) => {
  helper.remove("genre", req, res);
};

module.exports = { create, findAll, findById, update, remove };
