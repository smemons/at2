const express = require('express');
const router = express.Router();
var db = require('../config/db');

const uf = require('../functions/focus');


var focus = express.Router();
focus.get('/', uf.getFocus);
focus.post('/', uf.saveFocus);
focus.put('/', uf.updateFocus);
focus.get('/all', uf.getAll);
focus.delete('/:id', uf.deleteFocus);




module.exports = focus;