'use strict';

const spreadsheet = require('./src/spreadsheet');
const postgres = require('./src/sequelize');
const express = require('express');
const app = express();
const port = process.env.PORT || 80;

app.get('/', (req, res) => {
    res.status(200).send(`I found this - or this - or this`);
});

app.get('/runspread', (req, res) => {
    spreadsheet.getAllUrlsFromSheet('applications.xlsx', 0)
    .then(spreadsheet.runAllPromises)
    .then(spreadsheet.writeResult)
    .then(console.log)
    .catch(eer => {
        res.status(400).send(eer);
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});

app.get('/testDb', (req, res) => {
    let host = 'mbdbinstance.ca0c2jquskpr.eu-west-1.rds.amazonaws.com';
    let username = 'Master';
    let pass = 'Master123';
    let db = 'someName';
    let dialect = 'postgres';
    postgres.checkConnection(host, db, dialect, username, pass)
    .then(succes => res.status(200).send(succes))
    .catch(error => res.status(400).send(error));
});
