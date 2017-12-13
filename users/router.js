'user strict';

const express = require('express');
const bodyParser = require('body-parser');
const { User } = require('./models');
const router = express.Router();
const jsonParser = bodyParser.json();

router.user(jsonParser);

router.post('/', (req, res) => {
    res.json({message: "success"});
});

module.exports = { router };