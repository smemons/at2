var Status = require('../schema/status');
// get single room
var getStatus = function(req, resp, next) {
    resp.send("GET");
}

// create single status
////////////////////////////////////////////////////
var saveStatus = function(req, res, next) {
        console.log('creating Status now');
        var status = new Status(req.body);

        status.save(function(err) {
            if (err) {

                return next(err);
            } else {

                return res.json({
                    message: 'Status created!'
                });
            }
        });
    }
    //////////////////////////////////////////////////
    // updateStatus
var updateStatus = function(req, res, next) {

        var status = new Status(req.body);
        console.log('updating Status now' + status);
        Status.findByIdAndUpdate(status._id, { $set: status }, function(err, result) {
            if (err) {
                console.log(err);
                next(err);
            }
            console.log("Status updated: " + result);
            res.send('Done')
        });
    }
    ///////////////////////////////////////////////////
    // deleteStatus
var deleteStatus = function(req, res, next) {
        var id = req.params.id;
        console.log('deleting Status now by id: ' + id);
        Status.remove({ _id: id }, function(err) {
            if (err) {
                console.log(err);
                next(err);
            }
            console.log("Status deleted");
            res.send('Done')
        });
    }
    /////////////////////////////////////////////////////////
    //get all status list
var getAll = function(req, res, next) {
    Status.find(function(err, status) {
        if (err) {

            next(err);
        } else {

            res.json(status);
        }
    });
}

////////////////////////////////////////////////////////

module.exports = {
    getStatus: getStatus,
    saveStatus: saveStatus,
    updateStatus: updateStatus,
    deleteStatus: deleteStatus,
    getAll: getAll
}