var Activity = require('../schema/activity');
//var an = require('./analytics/main');
var an = require('./analytics/main');

// get single room
var getAllDept = function(req, res, next) {
    Activity.aggregate([an.unwind, an.lookup, an.project1, an.project2, an.group], function(err, result) {
        if (err) {
            next(err);
        } else {
            res.json(result);
        }
    });
}
module.exports = {
    getAllDept: getAllDept
}