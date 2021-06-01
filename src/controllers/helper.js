const { Book, Reader } = require("../models");
const getModel = (model) => {
  const models = {
    reader: Reader,
    book: Book,
  };
  return models[model];
};
const readerError = { error: "The reader could not be found." };
const bookError = { error: "The book could not be found." };

const removePassword = (obj) => {
  if (obj.hasOwnProperty("password")) {
    delete obj.password;
  }
  return obj;
};

const create = async (model, req, res) => {
  const thisItem = await getModel(model).create(req.body);
  res.status(201).send(removePassword(thisItem.dataValues));
};
const findAll = async (model, req, res) => {
  const allItems = await getModel(model).findAll();
  const itemsWithoutPassword = allItems.map((item) =>
    removePassword(item.dataValues)
  );
  res.status(200).send(removePassword(itemsWithoutPassword));
};
const findById = async (model, req, res) => {
  const thisItem = await getModel(model).findByPk(req.params.id);
  if (!thisItem && model == "reader") {
    return res.status(404).send(readerError);
  }
  if (!thisItem && model == "book") {
    return res.status(404).send(bookError);
  }
  res.status(200).send(removePassword(thisItem.dataValues));
};
const update = async (model, req, res) => {
  let thisItem = await getModel(model).findByPk(req.params.id);
  if (!thisItem && model == "reader") {
    return res.status(404).send(readerError);
  }
  if (!thisItem && model == "book") {
    return res.status(404).send(bookError);
  }
  await getModel(model).update(req.body, {
    where: { id: req.params.id },
  });
  thisItem = await getModel(model).findByPk(req.params.id);
  res.status(200).json(removePassword(thisItem.dataValues));
};
const remove = async (model, req, res) => {
  const thisItem = await getModel(model).findByPk(req.params.id);
  if (!thisItem && model == "reader") {
    return res.status(404).send(readerError);
  }
  if (!thisItem && model == "book") {
    return res.status(404).send(bookError);
  }
  await getModel(model).destroy({
    where: { id: req.params.id },
  });
  res.status(204).json(removePassword(thisItem.dataValues));
};
module.exports = { create, findAll, findById, update, remove };
