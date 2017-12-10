'use strict';
const Sequelize = require('sequelize');

const routes = require('./src/routes');
const express = require('express');
const app = express();
const port = process.env.PORT || 80;

app.get('/', (req, res) => {
    res.status(200).send(`Welcome my friend`);
});

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

app.listen(port, () => console.log(`App listening on port ${port}!`));

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
