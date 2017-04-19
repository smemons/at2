const express = require('express');
const router = express.Router();
var db = require('../config/db');

const uf = require('../functions/activity');


var acts = express.Router();
acts.get('/all', uf.getAll);
acts.get('/:id', uf.getActivity);
acts.post('/', uf.saveActivity);
acts.put('/percent', uf.updateActivityPercent);
acts.put('/', uf.updateActivity);

acts.get('/allByUserId/:id', uf.getAllByUserId);
acts.get('/allAssigned/:id', uf.getAllAssigned);
acts.get('/allCreated/:id', uf.getAllCreated);
acts.get('/byLevel/:level', uf.getAllByLevel);
acts.get('/allByParentId/:id', uf.getAllByParentId);
acts.get('/:id', function(req, res) {});
acts.patch('/:id', function(req, res) {});
acts.delete('/:id', function(req, res) {});



module.exports = acts;