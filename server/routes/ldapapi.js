const express = require('express');
const router = express.Router();


const uf = require('../functions/ldap');


var ldap = express.Router();
ldap.post('/authenticate', uf.authenticate);
ldap.get('/find/:username', uf.find);





module.exports = ldap;
