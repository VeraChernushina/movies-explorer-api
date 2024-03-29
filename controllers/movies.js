const Movie = require('../models/movie');
const { BadRequestError } = require('../errors/BadRequestError');
const { NotFoundError } = require('../errors/NotFoundError');
const { ForbiddenError } = require('../errors/ForbiddenError');

module.exports.getMovies = async (req, res, next) => {
  const owner = req.user._id;
  try {
    const movies = await Movie.find({ owner });
    if (!movies || movies.length === 0) {
      res.send('Сохраненных фильмов не найдено.');
    }
    return res.status(200).send(movies);
  } catch (err) {
    return next(err);
  }
};

module.exports.addMovie = async (req, res, next) => {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
    } = req.body;
    const newMovie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner: req.user._id,
    });
    return res.status(200).send(newMovie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы неверные данные.'));
    }
    return next(err);
  }
};

module.exports.deleteMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const userId = req.user._id;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return next(new NotFoundError('Фильм не найден.'));
    }
    const movieOwnerId = movie.owner.valueOf();
    if (movieOwnerId !== userId) {
      return next(new ForbiddenError('Вы не можете удалить чужой фильм!'));
    }
    const deletedMovie = await Movie.findByIdAndRemove(movieId);
    if (!deletedMovie) {
      return next(new NotFoundError('Фильм не найден.'));
    }
    return res.status(200).send('Фильм успешно удален!');
  } catch (err) {
    return next(err);
  }
};
