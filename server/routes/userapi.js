const express = require('express');
const router = express.Router();
var db = require('../config/db');

const uf = require('../functions/user');


var users = express.Router();
users.get('/', uf.getUser);
users.post('/', uf.saveUser);
users.post('/authenticate', uf.authenticate);
users.get('/all', uf.getAll);
users.get('/search/:term', uf.getSearch);
users.get('/:id', function(req, res) {});
users.patch('/:id', function(req, res) {});
users.delete('/:id', function(req, res) {});



module.exports = users;