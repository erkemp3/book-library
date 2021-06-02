module.exports = (connection, DataTypes) => {
  const schema = {
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Please include an author.",
        },
      },
    },
  };

  const AuthorModel = connection.define("Author", schema);
  return AuthorModel;
};
