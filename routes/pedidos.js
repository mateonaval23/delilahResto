const express = require('express');
const sql = require('../data/mysql');
const jwt = require('jsonwebtoken');

const route = express.Router();
const secretWord = "s3cr3tW0rd";


module.exports = route;