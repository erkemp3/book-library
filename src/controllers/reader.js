const { Reader } = require("../models");

exports.create = async (req, res) => {
  const newReader = await Reader.create(req.body);
  res.status(201).json(newReader);
};

exports.findAll = async (req, res) => {
  const readers = await Reader.findAll();
  res.status(200).json(readers);
};

exports.findById = async (req, res) => {
  const thisReader = await Reader.findByPk(req.params.id);
  if (!thisReader) {
    return res.status(404).send({ error: "The reader could not be found." });
  }
  res.status(200).json(thisReader);
};

exports.update = async (req, res) => {
  let thisReader = await Reader.findByPk(req.params.id);

  if (!thisReader)
    return res.status(404).send({ error: "The reader could not be found." });

  await Reader.update(req.body, {
    where: { id: req.params.id },
  });

  thisReader = await Reader.findByPk(req.params.id);
  res.status(200).json(thisReader);
};

exports.delete = async (req, res) => {
  const thisReader = await Reader.findByPk(req.params.id);
  if (!thisReader) {
    return res.status(404).send({ error: "The reader could not be found." });
  }

  await Reader.destroy({
    where: { id: req.params.id },
  });
  res.status(204).json(thisReader);
};
