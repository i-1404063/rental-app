const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});
const Genre = mongoose.model('Genre', genreSchema);

function genreValidate(reqObject) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
  };
  return Joi.validate(reqObject, schema);
}

exports.GenreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = genreValidate;
