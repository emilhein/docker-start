'use strict';

const index = require('./src/index');
const express = require('express');
const app = express();
const port = process.env.PORT || 80;

app.get('/', (req, res) => {
    res.status(200).send(`Welcome my friend`);
});

app.get('/runspread', (req, res) => {
    const spreadsheet = index.spreadsheet;
    spreadsheet.getAllUrlsFromSheet('applications.xlsx', 0)
    .then(spreadsheet.runAllPromises)
    .then(spreadsheet.writeResult)
    .then(console.log)
    .catch(eer => {
        res.status(400).send(eer);
    });
});

app.post('/buildimage', (req, res) => {
    res.status(200).send(`More will come`);
});

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});

app.get('/testdb', (req, res) => {
    const postgres = index.postgres;
    // should be from env variable
    let host = process.env.PGHOST;
    let db = process.env.PGDATABASE;
    let username = process.env.PGUSER;
    let pass = process.env.PGPASS;
    let dialect = 'postgres';

    postgres.checkConnection(host, db, dialect, username, pass)
    .then(succes => res.status(200).send(succes))
    .catch(error => res.status(400).send(error));
});
