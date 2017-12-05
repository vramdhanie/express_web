'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
const { PORT } = require('./config');

let server;

const runServer = () => {
    return new Promise((resolve, reject) => {
        server = app
            .listen(PORT, () => {
                console.log(`Server started on port ${PORT}`);
                resolve();
            })
            .on('error', err => {
                reject(err);
            });
    });
}

const closeServer = () => {
    return new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
            if(err){
                return reject(err);
            }
            resolve();
        });
    });
}

if( require.main === module) {
    runServer().catch(err => {
        console.log(err);
    })
}

module.exports = { app, runServer, closeServer };