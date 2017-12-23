'use strict';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');

const app = express();
const { PORT, DATABASE_URL } = require('./config');

mongoose.Promise = global.Promise;
app.use(morgan('common'));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if(req.method === 'OPTIONS'){
        return res.send(204);
    }
    next();
});


const { router: userRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/user', userRouter);
app.use('/auth', authRouter);

app.use('*', (req, res) => {
    return res.status(404).json({message: 'Not Found'});
});

let server;

const runServer = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(DATABASE_URL, { useMongoClient: true }, err => {
            if(err){
                return reject(err);
            }
            server = app
                .listen(PORT, () => {
                    console.log(`Server started on port ${PORT}`);
                    resolve();
                })
                .on('error', err => {
                    mongoose.disconnect();
                    reject(err);
                });
            })
    });
}

const closeServer = () => {
    return mongoose
        .disconnect()
        .then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if(err){
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if( require.main === module) {
    runServer().catch(err => {
        console.log(err);
    })
}

module.exports = { app, runServer, closeServer };
