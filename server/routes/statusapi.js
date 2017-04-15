const express = require('express');
const router = express.Router();
var db = require('../config/db');

const uf = require('../functions/status');


var status = express.Router();
status.get('/', uf.getStatus);
status.post('/', uf.saveStatus);
status.put('/', uf.updateStatus);
status.get('/all', uf.getAll);
status.delete('/:id', uf.deleteStatus);




module.exports = status;