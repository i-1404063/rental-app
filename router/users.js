const auth = require('../middleware/auth');
const validateMiddleware = require('../middleware/validate');
const { validate, User } = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

router.get('/:me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.post('/', validateMiddleware(validate), async (req, res) => {
  const email = await User.findOne({ email: req.body.email });
  if (email) return res.status(400).send('User already Registered...');

  const user = new User(
    _.pick(req.body, ['name', 'email', 'password', 'isAdmin'])
  );

  ///generating salt and encrypting password with hashing
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  // generating jasonwebtoken to identify a user
  const token = user.generateAuthToken();
  res
    .header('x-auth-token', token)
    .send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;
