const express = require('express');
const router = express.Router();
var db = require('../config/db');

const uf = require('../functions/analytics');


var acts = express.Router();
acts.get('/allDepts', uf.getAllDept);
// acts.get('/:id', uf.getActivity);
// acts.post('/', uf.saveActivity);
// acts.put('/percent', uf.updateActivityPercent);
// acts.put('/', uf.updateActivity);

// acts.get('/allByUserId/:id', uf.getAllByUserId);
// acts.get('/allAssigned/:id', uf.getAllAssigned);
// acts.get('/allCreated/:id', uf.getAllCreated);
// acts.get('/byLevel/:level', uf.getAllByLevel);
// acts.get('/allByParentId/:id', uf.getAllByParentId);




module.exports = acts;