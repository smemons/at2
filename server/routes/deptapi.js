const express = require('express');
const router = express.Router();
var db = require('../config/db');

const uf = require('../functions/dept');


var depts = express.Router();
depts.get('/all', uf.getAll);
depts.get('/:id', uf.getDept);
depts.post('/', uf.saveDept);
depts.put('/', uf.updateDept);

depts.delete('/:id', uf.deleteDept);




module.exports = depts;
