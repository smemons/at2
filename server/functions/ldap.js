var User = require('../schema/user');
var ad = require('ldapjs');
/*
var url="ldap://ldapvqa.aramco.com.sa:389";
var username="memosa0b";
var password="aramco2.1";
var dn='DC=aramco2,DC=com';
*/
// var url="ldap://ldapv01.aramco.com.sa:389";
// var username="memosa0b";
// var password="Mko09ijn";
// var dn='DC=aramco,DC=com';
// var bindUser="eaiusrvc@aramco.com";
// var bindPass='NTivHKm^et*83$SE';

var url="ldap://ldap.forumsys.com:389";
var username="memosa0b";
var password="Mko09ijn";
var dn='dc=example,dc=com';
var bindUser="cn=read-only-admin,dc=example,dc=com";
var bindPass='password';


var ldapres = null
 var client = ad.createClient({ "url":url , "bindDN": bindUser, "bindCredentials": bindPass });
var authenticate = function(req, res, next) {
    let user = new User(req.body);
    console.log(user.username+"-"+user.password);
    let opts = {
      filter:  "(&(objectClass=user)(sAMAccountName=" +user.username + "))",
      scope: 'sub',
    }
//////////////////////
  client.search(dn, opts, function (err, result) {
    console.log('inside search');
  result.on('searchEntry', function (entry) {
    ldapres = entry.raw

  })
  result.on('end', function (result) {
    if (!ldapres) {
     res.json({
                success: false,
                 message: 'Authentication Failed'
               });
    }
    client.bind(ldapres.dn, password, function (err) {
      if (err) {
            client.unbind();
            res.status(500);
            return next(err);
            }
            else
            {
              res.json({
                           success: true,
                           message: 'User logged in successfully',
                            'user': user
                    });
            }
    })
  })
});
//////////////////////
};
var find = function(req, res, next) {
    var username=req.params.username;
var query = "(&(objectClass=user)(sAMAccountName=" +username + "))"; //"(|(displayName=*"+name+"*)(sAMAccountName=*"+name+"*))";
var optFiltered = {
  filter: query,
  scope: 'sub',
  attributes: ['displayName','sAMAccountName']
};
client.search(dn, optFiltered, function(err, result) {
  result.on('searchEntry', function(entry) {
    res.send('entry: ' + JSON.stringify(entry.object));
  });
  result.on('searchReference', function(referral) {
    //res.send('referral: ' + referral.uris.join());
  });
  result.on('error', function(err) {
    console.error('error: ' + err.message);
  });
  result.on('end', function(result) {
    console.log('status: ' + result.status);
  });
});
}
module.exports = {
    authenticate:authenticate,
    find:find
}
