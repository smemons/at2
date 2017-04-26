var Activity = require('../schema/activity');
// get single room
var getActivity = function(req, res, next) {
        var actId = req.params.id;
        Activity.findById(actId, function(err, docs) {
            if (err) {
                console.log('Got Activity error :' + err);
                next(err);
            } else {
                // console.log('Got Activity :' + docs);
                res.json(docs);
            }
        });
    }
    // create Activity
var saveActivity = function(req, res, next) {
        var activity = new Activity(req.body);
        activity.save(function(err, act) {
            if (err) {
                return next(err);
            } else {
                // console.log('activiity created ' + act);
                return res.json(act);
            }
        });
    }
    // updateActivity
var updateActivity = function(req, res, next) {
        var activity = new Activity(req.body);
        console.log('updating Activity now' + activity);
        Activity.findByIdAndUpdate(activity._id, { $set: activity }, function(err, result) {
            if (err) {
                console.log(err);
            }
            console.log("Activity updated: " + result);
            res.send('Done')
        });
    }
    // updateActivity
var updateActivityPercent = function(req, res, next) {
    var activity = new Activity(req.body);
    console.log('updating Activity now' + activity);
    Activity.findByIdAndUpdate(activity._id, {
        $set: {
            percentage: activity.percentage,
            updatedBy: activity.updatedBy,
            updatedAt: new Date()
        }
    }, function(err, result) {
        if (err) {
            console.log(err);
        }
        console.log("Activity updated: " + result);
        res.send('Done')
    });
}
var getAll = function(req, res, next) {
        Activity.find(function(err, docs) {
            if (err) {
                next(err);
            } else {
                res.json(docs);
            }
        });
    }
    /**
     *
     * get all activity by deptName or all of them just title and percentage for now
     */
var getAllInProgress = function(req, res, next) {
    var deptName = req.params.id;
    var query = {};
    if (deptName != null && deptName != 'all') {
        // ObjectId = require('mongodb').ObjectID;
        // deptName = ObjectId(deptName);
        query = { deptName: deptName };
    }
    Activity.aggregate([
        { $match: { level: 0 } },
        {
            $unwind: "$deptId"
        },
        {
            $lookup: {
                from: "depts",
                localField: "deptId",
                foreignField: "_id",
                as: "dept"
            }
        },
        {
            $project: {
                _id: "$_id",
                percentage: 1,
                title: 1,
                assignee: 1,
                deptName: "$dept.title",
                deptId: "$dept._id"
            }
        },
        { $match: query },
        { $sort: { percentage: 1 } }
    ], function(err, docs) {
        if (err) {
            next(err);
        } else {
            res.json(docs);
        }
    });
}


var getAllByParentId = function(req, res, next) {
        var id = req.params.id;
        Activity.find({ 'parentId': id }, function(err, docs) {
            if (err) {
                next(err);
            } else {
                res.json(docs);
            }
        });
    }
    //getAll By userId
var getAllByUserId = function(req, res, next) {
        var userId = req.params.id;
        Activity.find({ $or: [{ 'createdBy': userId }, { 'assignee': { $all: [userId] } }] }, function(err, docs) {
            if (err) {
                next(err);
            } else {
                res.json(docs);
            }
        });
    }
    //all created
var getAllCreated = function(req, res, next) {
        var userId = req.params.id;
        Activity.find({ 'createdBy': userId }, function(err, docs) {
            if (err) {
                next(err);
            } else {
                res.json(docs);
            }
        }).sort({ 'createdAt': -1 });
    }
    //all assigned
var getAllAssigned = function(req, res, next) {
    var userId = req.params.id;
    console.log("Getting all assigned by userId" + userId);
    Activity.find({ 'assignee': { $all: [userId] } }, function(err, docs) {
        if (err) {
            next(err);
        } else {
            res.json(docs);
        }
    }).sort({ 'createdAt': -1 });
}
var getActivityByName = function(req, res, next) {
        // console.log('getting a room' + JSON.stringify(req.body));
        var inc = req.params.incName;
        //console.log('Looking by roomName: ' + roomn);
        Activity.findOne({ "title": inc }, function(err, rooms) {
            if (err) {
                next(err);
            } else {
                res.json(rooms);
            }
        });
    }
    //getAll By level id
var getAllByLevel = function(req, res, next) {
    var level = req.params.level;
    Activity.find({ 'level': level }, function(err, docs) {
        if (err) {
            next(err);
        } else {
            res.json(docs);
        }
    });
}
module.exports = {
    getActivity: getActivity,
    saveActivity: saveActivity,
    getAll: getAll,
    getAllAssigned: getAllAssigned,
    getAllCreated: getAllCreated,
    updateActivity: updateActivity,
    updateActivityPercent: updateActivityPercent,
    getAllByUserId: getAllByUserId,
    getAllByLevel: getAllByLevel,
    getAllByParentId: getAllByParentId,
    getAllInProgress: getAllInProgress
}