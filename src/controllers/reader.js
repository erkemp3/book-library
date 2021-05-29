const { Reader } = require("../models");

exports.create = async (req, res) => {
  const checkPassword = req.body.password;
  const checkEmail = req.body.email;
  const checkName = req.body.name;
  if (checkPassword == null || checkEmail == null || checkName == null) {
    return res
      .status(400)
      .send({ error: `Please ensure all fields are completed.` });
  }

  const checkExisting = await Reader.findAll({
    where: {
      email: req.body.email,
    },
  });
  if (checkExisting[0]) {
    return res
      .status(409)
      .send({ error: `User with email ${req.body.email} already exists.` });
  }

  if (checkPassword.length < 8 || checkPassword.length > 16) {
    return res
      .status(422)
      .send({
        error: `Password must be between 8 and 16 characters in length.`,
      });
  }

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
