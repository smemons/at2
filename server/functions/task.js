var Task = require('../schema/task');
// get single room
var getTask = function(req, resp, next) {
    resp.send("GET");
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
    getAllByActivity: getAllByActivity


}