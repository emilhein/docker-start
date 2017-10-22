'use strict';

const xlsx = require('node-xlsx');
const request = require('request');
const promiseParallelThrottle = require('promise-parallel-throttle');
const fs = require('fs');
const express = require('express');
const app = express();
const port = process.env.PORT || 80;

const getAllUrlsFromSheet = (name, row) => {
    return new Promise((resolve, reject) => {
        const workSheetsFromFile = xlsx.parse(`${__dirname}/spreadsheets/${name}`);
        let data = workSheetsFromFile[0].data;
        let urlAr = [];
        data.map(entry => {
            urlAr.push(`https://dr.dk${entry[row]}`);
        });
        return resolve(urlAr);
    });
};

const getStatus = url => {
    console.log(`Getting status from ${url}`);
    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            if (error) return reject(error);
            // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            let res = {
                url: url,
                status: response.statusCode
            };
            return resolve(res);
        });
    });
};

async function runAllPromises (arr) {
    const queue = arr.map(entry => () => getStatus(entry));
    // Create a (optional) Options object
    const options = {
        maxInProgress: 40,
        failFast: false
        // progressCallback: statusUpdate => console.log(statusUpdate)
    };
    // //Execute the throttle task, only the array of tasks is required, other params are optional.
    const slowly = await promiseParallelThrottle.all(queue, options);
    return slowly;
}

const writeResult = allResults => {
    return new Promise((resolve, reject) => {
        const data = allResults.map(oneSite => [oneSite.url, oneSite.status]);
        let buffer = xlsx.build([{name: 'mySheetName', data: data}]); // Returns a buffer
        fs.writeFile(`${__dirname}/results/result.xlsx`, buffer, (err) => {
            if (err) return reject(err);
            return resolve('The file was saved!');
        });
    });
};

app.get('/', (req, res) => {
    res.status(400).send(`I found this - or this - or this`);
});

app.get('/runspread', (req, res) => {
    getAllUrlsFromSheet('applications.xlsx', 0)
    .then(runAllPromises)
    .then(writeResult)
    .then(console.log)
    .catch(eer => {
        console.log('Los erroooor ', eer);
    });
    // res.status(400).send(`I found this`);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
