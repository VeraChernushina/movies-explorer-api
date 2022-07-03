const router = require('express').Router();
const { NotFoundError } = require('../errors/NotFoundError');
const { createUser, login, logout } = require('../controllers/users');
const {
  signUp,
  signIn,
} = require('../middlewares/validations');
const auth = require('../middlewares/auth');

// crash-test route
router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// auth routes
router.post('/signup', signUp, createUser);
router.post('/signin', signIn, login);
router.post('/signout', logout);

// protected routes
router.use(auth);
router.use('/', require('./users'));
router.use('/', require('./movies'));

// if request route does not exist
router.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
