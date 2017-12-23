'use strict';
const Sequelize = require('sequelize');

const routes = require('./src/index');
const express = require('express');
const app = express();
const port = process.env.PORT || 80;
app.listen(port, () => console.log(`App listening on port ${port}!`));

app.get('/', (req, res) => {
    res.status(200).send(`Welcome my friend`);
});

app.get('/validate', (req, res) => {
    // this should be to validate Joi models
    routes.validate(req)
    .then(res => res.status(200).send(res))
    .catch(err => res.status(400).send(err));
});

// TODO: refactor to new style see above
app.get('/runspread', (req, res) => {
    const spreadsheet = routes.spreadsheet;
    spreadsheet.getAllUrlsFromSheet('applications.xlsx', 0)
    .then(spreadsheet.runAllPromises)
    .then(spreadsheet.writeResult)
    .then(console.log)
    .catch(eer => {
        res.status(400).send(eer);
    });
});

// TODO: refactor to new style see above
app.get('/testdb', (req, res) => {
    const postgres = routes.postgres;
    // should be from env variable
    let host = process.env.PGHOST;
    let db = process.env.PGDATABASE;
    let username = process.env.PGUSER;
    let pass = process.env.PGPASS;
    let dialect = 'postgres';
    const connection = new Sequelize(db, username, pass, {
        host: host,
        dialect: dialect
    });
    postgres.checkConnection(connection)
    .then(succes => res.status(200).send(succes))
    .catch(error => res.status(400).send(error));
});

module.exports = app;
