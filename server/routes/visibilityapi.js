const express = require('express');
const router = express.Router();
var db = require('../config/db');

const uf = require('../functions/visibility');


var vis = express.Router();
vis.get('/', uf.getVisibility);
vis.post('/', uf.saveVisibility);
vis.put('/', uf.updateVisibility);
vis.get('/all', uf.getAll);
vis.delete('/:id', uf.deleteVisibility);




module.exports = vis;