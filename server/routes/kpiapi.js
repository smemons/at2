const express = require('express');
const router = express.Router();
var db = require('../config/db');

const uf = require('../functions/kpi');


var phase = express.Router();
phase.get('/', uf.getKPI);
phase.post('/', uf.saveKPI);
phase.put('/', uf.updateKPI);
phase.get('/all', uf.getAll);
phase.delete('/:id', uf.deleteKPI);




module.exports = phase;