const express = require('express');
const router = express.Router();
var db = require('../config/db');

const uf = require('../functions/phase');


var phase = express.Router();
phase.get('/', uf.getPhase);
phase.post('/', uf.savePhase);
phase.put('/', uf.updatePhase);
phase.get('/all', uf.getAll);
phase.delete('/:id', uf.deletePhase);




module.exports = phase;