const express = require('express');
const router = express.Router();
var db = require('../config/db');

const uf = require('../functions/actLookup');


var actLookups = express.Router();
actLookups.get('/', uf.getActivityLookup);
actLookups.post('/', uf.saveActivityLookup);
actLookups.put('/', uf.updateActivityLookup);
actLookups.get('/all', uf.getAll);
actLookups.delete('/:id', uf.deleteActivityLookup);




module.exports = actLookups;