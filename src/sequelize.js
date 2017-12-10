'use strict';

const checkConnection = (connection) => {
    return new Promise((resolve, reject) => {
        connection
            .authenticate()
            .then(() => resolve('Connection has been established successfully.'))
            .catch(err => {
                let error = `Unable to connect to the database: ${err}`;
                return reject(error);
            });
    });
};

module.exports = {
    checkConnection
};
