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
    res.json({message: "success"});
});

module.exports = { router };