const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const PasswordComplexity = require('joi-password-complexity');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 4,
    max: 20,
  },
  isAdmin: Boolean,
  // we can add more complex object like below according to our application
  // roles: [],
  // operations: [//complex object]
});

// Encapsulating logic in model
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get('jwtPrivateKey')
  );
  return token;
};
const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    isAdmin: Joi.boolean(),
    name: Joi.string().min(4).max(50).required(),
    email: Joi.string().email({
      minDomainAtoms: 2,
      tlds: { allow: ['com', 'net'] },
    }),
    password: new PasswordComplexity({
      min: 4,
      max: 20,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
      requirementCount: 2,
    }),
  };

  return Joi.validate(user, schema);
}

module.exports.validate = validateUser;
module.exports.User = User;
