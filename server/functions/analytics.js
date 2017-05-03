var Activity = require('../schema/activity');
//var an = require('./analytics/main');
var an = require('./analytics/main');
// get single room
var getAllDept = function(req, res, next) {
    Activity.aggregate([an.unwindDept, an.lookupDept, an.projectDept1, an.projectDept2, an.groupDept], function(err, result) {
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
        var deptId = req.params.deptId;

        var query = { $match: {} };
        if (actId != null && deptId != null) {
            ObjectId = require('mongodb').ObjectID;
            actId = ObjectId(actId);
            deptId = ObjectId(deptId);

            query = { $match: { $and: [{ _id: actId }, { deptId: deptId }] } };
        }
        Activity.aggregate([an.unwindDept, query, an.lookupDept, an.lookupPhase, an.lookupStatus, an.lookupFocus, an.selfActLookup,
            an.actGraphLookup, an.actProject
        ], function(err, result) {
            if (err) {
                next(err);
            } else {
                res.json(result);
            }
        });
    }
    /**
     * get  status  by reference of all activities
     */
var getStatusByRef = function(req, res, next) {
    Activity.aggregate(an.refStatusQuery, function(err, result) {
        if (err) {
            next(err);
        } else {
            res.json(result);
        }
    });
};
/**
 * get all activities grouped by dept find all or by catid or dept id based on given param
 *
 */
var getAllActGroupedByDept = function(req, res, next) {

    var id = req.params.id;
    var by = req.params.by;


    var query = { $match: { level: 0 } };
    if (id != null && id != "all") {
        ObjectId = require('mongodb').ObjectID;
        id = ObjectId(id);
        if (by == "cat")
            query = { $match: { $and: [{ catId: id }, { level: 0 }] } };
        else
        if (by == "dept")
            query = { $match: { $and: [{ deptId: id }, { level: 0 }] } };

    }

    Activity.aggregate([an.unwindDept, query, an.lookupDept, an.lookupCategory,
        an.selfActLookup,
        an.actGraphLookup, an.grByCat_DeptProject, an.grByDept_Group
    ], function(err, result) {
        if (err) {
            next(err);
        } else {
            res.json(result);
        }
    });
};
/**
 * get all activities grouped by dept,
 *
 * add: optional param all is added.. in case we are looking to restrict by catId
 *
 */
var getAllActGroupedByCat = function(req, res, next) {
    var catId = req.params.id;
    var query = { $match: { level: 0 } };
    if (catId != null && catId != "all") {
        ObjectId = require('mongodb').ObjectID;
        catId = ObjectId(catId);
        query = { $match: { $and: [{ catId: catId }, { level: 0 }] } };
    }
    Activity.aggregate([query, an.unwindDept, an.lookupDept, an.lookupCategory,
        an.selfActLookup,
        an.actGraphLookup, an.grByCat_DeptProject, an.grByCat_Group
    ], function(err, result) {
        if (err) {
            next(err);
        } else {
            res.json(result);
        }
    });
};
module.exports = {
    getAllDept: getAllDept,
    getAllDeptPhase: getAllDeptPhase,
    getActivityHchy: getActivityHchy,
    getStatusByRef: getStatusByRef,
    getAllActGroupedByDept: getAllActGroupedByDept,
    getAllActGroupedByCat: getAllActGroupedByCat
}