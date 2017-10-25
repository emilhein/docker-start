'use strict';
const Sequelize = require('sequelize');

exports.checkConnection = (host, db, dialect, username, pass) => {
    // const sequelize = new Sequelize(string);
    const sequelize = new Sequelize(db, username, pass, {
        host: host,
        dialect: dialect
    });

    return new Promise((resolve, reject) => {
        sequelize
            .authenticate()
            .then(() => {
                return resolve('Connection has been established successfully.');
            })
            .catch(err => {
                let error = `Unable to connect to the database: ${err}`;
                return reject(error);
            });
    });
};
