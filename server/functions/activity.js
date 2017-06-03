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
            delta: activity.delta,
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
//delete by id
var deleteActivity=function(req, res, next) {
        var id = req.params.id;
        console.log('deleting activity  by id: ' + id);
        Activity.remove({ _id: id }, function(err) {
            if (err) {
                console.log(err);
                next(err);
            }
            console.log("Activity deleted");
            res.send('Done')
        });
    }
//get all activities
var getAll = function(req, res, next) {
    Activity.find(function(err, docs) {
        if (err) {
            next(err);
        } else {
            res.json(docs);
        }
    }).sort({ 'createdAt': -1 });
}
var OLDgetActivitiesByCatId = function(req, res, next) {
        var catId = req.params.id;
        if (catId != null) {
            ObjectId = require('mongodb').ObjectID;
            catId = ObjectId(catId);
            query = { catId: catId };
            Activity.find(query, { _id: 1, title: 1, percentage: 1 }, function(err, docs) {
                if (err) {
                    next(err);
                } else {
                    res.json(docs);
                }
            });
        }
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
                    startDate: 1,
                    endDate: 1,
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
 var getActivityById = function(req, res, next) {
    var actId = req.params.id;
    if (actId != null) {
        var query = {};
        ObjectId = require('mongodb').ObjectID;
        actId = ObjectId(actId);
        query = { $match: {  _id: actId }} }
        else
        {
          throw "Activity Id required";
        }
        Activity.aggregate([
            query,
            {
    $lookup: {
    from: "depts",
    localField: "deptId",
    foreignField: "_id",
    as: "dept"}
  } ,
  {
    $lookup: {
    from: "status",
    localField: "statusId",
    foreignField: "_id",
    as: "status"}
  }
   ,
  {
    $lookup: {
    from: "categories",
    localField: "catId",
    foreignField: "_id",
    as: "ref"}
  }
  ,
  {
    $lookup: {
    from: "phases",
    localField: "phaseId",
    foreignField: "_id",
    as: "phase"}
  }
  ,
  {
    $lookup: {
    from: "kpis",
    localField: "kpiId",
    foreignField: "_id",
    as: "phase"}
  }
 ,
  {
    $lookup: {
    from: "focus",
    localField: "focusId",
    foreignField: "_id",
    as: "focus"}
  },
 {
   $lookup: {
    from: "visibilities",
    localField: "visId",
    foreignField: "_id",
    as: "vis"}
   }
  ,
  {
   $project:{
               _id:"$_id",
              title: 1,
              desc: 1,
              benefit: 1,
              cost: 1,
              costSaving: 1,
              startDate: 1,
              endDate: 1,
              sponsor: 1,
              assignee: 1,
              buAssignee: 1,
              percentage: 1,
              delta: 1,
              createdAt: 1,
              createdBy: 1,
              updatedAt: 1,
              updatedBy: 1,
              projDetail: 1,
              docLink: 1,
              outOfScope: 1,
              challenge: 1,
              nextStep: 1,
              monitored: 1,
              chartered: 1,
              level:1,
               deptName:"$dept.title",
               focus:"$focus.title",
               phase:"$phase.title",
               status:"$status.title",
               ref:"$ref.title",
               vis:"$vis.title",
               kpi:"$kpi.title"
   }
   }
            ], function(err, docs) {
            if (err) {
                next(err);
            } else {
                res.json(docs);
            }
        });
    }
    /**
     * get all activities by catId
     */
var getActivitiesByCatId = function(req, res, next) {
    var catId = req.params.id;
    if (catId != null) {
        var query = {};
        ObjectId = require('mongodb').ObjectID;
        catId = ObjectId(catId);
        query = { $match: { $and: [{ catId: catId }, { level: 0 }] } };
        Activity.aggregate([
            query,
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
                $lookup: {
                    from: "categories",
                    localField: "catId",
                    foreignField: "_id",
                    as: "cat"
                }
            },
            {
                $project: {
                    _id: "$_id",
                    catId: 1,
                    title: 1,
                    percentage: 1,
                    deptName: "$dept.title",
                    deptId: "$dept._id",
                    catName: "$cat.title",
                    startDate: 1,
                    endDate: 1,
                    level: 1
                }
            },
            {
                $sort: { percentage: 1 }
            }
        ], function(err, docs) {
            if (err) {
                next(err);
            } else {
                res.json(docs);
            }
        });
    }
}
/**
 *
 *
 */
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
        var inc = req.params.incName;
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
    getAllInProgress: getAllInProgress,
    getActivitiesByCatId: getActivitiesByCatId,
    getActivityById:getActivityById,
    deleteActivity:deleteActivity
}
