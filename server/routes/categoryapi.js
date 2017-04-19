const express = require('express');
const router = express.Router();
var db = require('../config/db');

const uf = require('../functions/category');


var users = express.Router();
users.get('/all', uf.getAll);
users.get('/:id', uf.getCategory);
users.post('/', uf.saveCategory);
users.put('/', uf.updateCategory);

users.delete('/:id', uf.deleteCategory);




module.exports = users;
