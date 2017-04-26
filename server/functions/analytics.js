var Activity = require('../schema/activity');
//var an = require('./analytics/main');
var an = require('./analytics/main');
// get single room
var getAllDept = function(req, res, next) {
    Activity.aggregate([an.matchLevel0, an.unwindDept, an.lookupDept, an.projectDept1, an.projectDept2, an.groupDept], function(err, result) {
        if (err) {
            next(err);
        } else {
            res.json(result);
        }
    });
}
var getAllDeptPhase = function(req, res, next) {
        Activity.aggregate([an.unwindDept, an.lookupDept, an.lookupPhase, an.projectPhase1, an.projectPhase2, an.groupPhase], function(err, result) {
            if (err) {
                next(err);
            } else {
                res.json(result);
            }
        });
    }
    /**
     * get all activities filtered by activityId name or all... it will return all the children as well
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
var getActivityHchy = function(req, res, next) {

    var actId = req.params.id;
    var deptName = req.params.deptName;

    var query = { $match: {} };
    if (actId != null && actId != 'all') {
        ObjectId = require('mongodb').ObjectID;
        actId = ObjectId(actId);
        query = { $match: { $and: [{ _id: actId }, { deptName: deptName }] } };
    }
    Activity.aggregate([an.unwindDept, an.lookupDept, an.lookupPhase, an.lookupStatus, an.lookupFocus, an.selfActLookup,
        an.actGraphLookup, an.matchLevel0, an.actProject, query
    ], function(err, result) {
        if (err) {
            next(err);
        } else {
            res.json(result);
        }
    });
}
module.exports = {
    getAllDept: getAllDept,
    getAllDeptPhase: getAllDeptPhase,
    getActivityHchy: getActivityHchy
}