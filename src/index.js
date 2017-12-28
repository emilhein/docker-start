const spreadsheet = require('./spreadsheet');
const postgres = require('./sequelize');
const validate = require('./validate');

module.exports = {
    spreadsheet,
    postgres,
    validate
};
