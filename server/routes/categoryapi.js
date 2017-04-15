const express = require('express');
const router = express.Router();
var db = require('../config/db');

const uf = require('../functions/category');


var users = express.Router();
users.get('/', uf.getCategory);
users.post('/', uf.saveCategory);
users.put('/', uf.updateCategory);
users.get('/all', uf.getAll);
users.delete('/:id', uf.deleteCategory);




module.exports = users;