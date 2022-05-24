const User = require('../models/user');
const { BadRequestError } = require('../errors/BadRequestError');
const { NotFoundError } = require('../errors/NotFoundError');

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id).then((user) => {
    if (!user) {
      return next(new NotFoundError('Пользователь не найден.'));
    }

    return res.status(200).send(user.name, user.email);
  }).catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send(user.name, user.email))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Неверный тип данных.'));
      }
      return next(err);
    });
};
