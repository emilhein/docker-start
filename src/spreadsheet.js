'use strict';

const xlsx = require('node-xlsx');
const request = require('request');
const promiseParallelThrottle = require('promise-parallel-throttle');
const fs = require('fs');

exports.getAllUrlsFromSheet = (name, row) => {
    let workSheetsFromFile;
    return new Promise((resolve, reject) => {
        try {
            workSheetsFromFile = xlsx.parse(`${__dirname}/spreadsheets/${name}`);
        } catch (error) {
            return reject(error);
        }
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
exports.runAllPromises = async arr => {
// async function runAllPromises (arr) {
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
};

exports.writeResult = allResults => {
    return new Promise((resolve, reject) => {
        const data = allResults.map(oneSite => [oneSite.url, oneSite.status]);
        let buffer = xlsx.build([{name: 'mySheetName', data: data}]); // Returns a buffer
        fs.writeFile(`${__dirname}/results/result.xlsx`, buffer, (err) => {
            if (err) return reject(err);
            return resolve('The file was saved!');
        });
    });
};
