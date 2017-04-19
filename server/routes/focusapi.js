const express = require('express');
const router = express.Router();
var db = require('../config/db');

const uf = require('../functions/focus');


var focus = express.Router();
focus.get('/all', uf.getAll);
focus.get('/:id', uf.getFocus);
focus.post('/', uf.saveFocus);
focus.put('/', uf.updateFocus);

focus.delete('/:id', uf.deleteFocus);




module.exports = focus;
