var Task = require('../schema/task');
// get single room
var getTask = function(req, res, next) {
    var id = req.params.id;
    Task.findById(id, function(err, docs) {
        if (err) {
            console.log('Got Task error :' + err);
            next(err);
        } else {
            res.json(docs);
        }
    });
}

// create single room
var saveTask = function(req, res, next) {
        console.log('creating Task now');
        var task = new Task(req.body);

        task.save(function(err) {
            if (err) {

                return next(err);
            } else {

                return res.json(task);
            }
        });
    }
    // update Task
var updateTask = function(req, res, next) {

    var task = new Task(req.body);
    console.log('updating Task now' + task);
    Task.findByIdAndUpdate(task._id, { $set: task }, function(err, result) {
        if (err) {
            console.log(err);
        }
        console.log("Task updated: " + result);
        res.send('Done')
    });
}
var getAll = function(req, res, next) {
    Task.find(function(err, task) {
        if (err) {

            next(err);
        } else {

            res.json(task);
        }
    });
}

var getAllByActivity = function(req, res, next) {
    actId = req.params.id;
    Task.find({ 'activityId': actId }, function(err, docs) {
        if (err) {

            next(err);
        } else {


            res.json(docs);
        }
    }).sort({ 'createdAt': -1 });
}


module.exports = {
    getTask: getTask,
    saveTask: saveTask,
    getAll: getAll,
    getAllByActivity: getAllByActivity,
    updateTask: updateTask



}