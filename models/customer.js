const Joi = require('joi');
const mongoose = require('mongoose');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 25
    },
    phone: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 11
    },
    isGold: Boolean
}))

function validateCustomer(reqBody) {
    const schema = {
        name: Joi.string().min(3).required(),
        phone: Joi.string().min(3).max(11).required(),
        isGold: Joi.boolean()
    }
    return Joi.validate(reqBody, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;