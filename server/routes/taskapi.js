const express = require('express');
const router = express.Router();
var db = require('../config/db');

const uf = require('../functions/task');


var tasks = express.Router();
tasks.get('/', uf.getTask);
tasks.post('/', uf.saveTask);

tasks.get('/all', uf.getAll);
tasks.get('/allByActivity/:id', uf.getAllByActivity);
tasks.get('/:id', function(req, res) {});
tasks.patch('/:id', function(req, res) {});
tasks.delete('/:id', function(req, res) {});



module.exports = tasks;