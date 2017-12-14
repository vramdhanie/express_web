'user strict';

const express = require('express');
const bodyParser = require('body-parser');
const { User } = require('./models');
const router = express.Router();
const jsonParser = bodyParser.json();
const { check, validationResult } = require('express-validator/check');

router.use(jsonParser);

router.post('/', [check('username').exists(), check('password').exists()], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.mapped() });
    }

    const { username, password, firstName='', lastName='' } = req.body;

    return User.find({username})
        .count()
        .then(count => {
            if(count > 0){
                return Promise.reject({
                    code: 422,
                    reason: 'ValidationError',
                    message: 'Username already in use',
                    location: 'username'
                });
            }
            return User.hashPassword(password);
        })
        .then(hash => {
            return User.create({
                username,
                password: hash,
                firstName,
                lastName
            });
        })
        .then(user => {
            return  res.status(201).json(user.serialize());
        })
        .catch(err => {
            if(err.reason === 'ValidationError'){
                return res.status(err.code).json(err);
            }
            return res.status(500).json({code: 500, message:'Internal server error'});
        });
});

module.exports = { router };