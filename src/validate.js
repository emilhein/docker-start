const Joi = require('joi');
const {promisify} = require('util');
const validatePromise = promisify(Joi.validate);
const schema = Joi.object().options({ abortEarly: false }).keys({
    email: Joi.string().email().required().label('User Email'),
    password: Joi.string().min(8).required(),
    password_confirmation: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' }, label: 'Password Confirmation' } }).label('This label is not used because language.label takes precedence'),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    company: Joi.string().optional()
});

const validate = data => {
    return new Promise((resolve, reject) => {
        validatePromise(data, schema)
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
};

module.exports = validate;
