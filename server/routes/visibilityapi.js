const express = require('express');
const router = express.Router();
var db = require('../config/db');

const uf = require('../functions/visibility');


var vis = express.Router();
vis.get('/all', uf.getAll);
vis.get('/:id', uf.getVisibility);
vis.post('/', uf.saveVisibility);
vis.put('/', uf.updateVisibility);

vis.delete('/:id', uf.deleteVisibility);




module.exports = vis;
