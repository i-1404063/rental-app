const Joi = require('joi');
const {
    GenreSchema
} = require('./genre');
const mongoose = require('mongoose');

const Movies = mongoose.model('Movies', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5
    },
    genre: {
        type: GenreSchema,
        required: true
    },
    dailyRentalRate: {
        type: Number,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true
    }
}))

function validate(objectBody) {
    const schema = {
        title: Joi.string().min(5).required(),
        dailyRentalRate: Joi.number().required(),
        numberInStock: Joi.number().min(1).max(10).required(),
        genreId: Joi.objectId().required()
    }
    return Joi.validate(objectBody, schema);
}

module.exports.Movies = Movies;
module.exports.validate = validate;