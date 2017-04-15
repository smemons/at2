var ActivityLookup = require('../schema/actLookup');
// get single room
var getActivityLookup = function(req, resp, next) {
    resp.send("GET");
}

// create single actLookup
////////////////////////////////////////////////////
var saveActivityLookup = function(req, res, next) {
        console.log('creating ActivityLookup now');
        var actLookup = new ActivityLookup(req.body);
        console.log('saving lookup' + actLookup);
        actLookup.save(function(err) {
            if (err) {

                return next(err);
            } else {

                return res.json({
                    message: 'ActivityLookup created!'
                });
            }
        });
    }
    //////////////////////////////////////////////////
    // updateActivityLookup
var updateActivityLookup = function(req, res, next) {

        var actLookup = new ActivityLookup(req.body);
        console.log('updating ActivityLookup now' + actLookup);
        ActivityLookup.findByIdAndUpdate(actLookup._id, { $set: actLookup }, function(err, result) {
            if (err) {
                console.log(err);
                next(err);
            }
            console.log("ActivityLookup updated: " + result);
            res.send('Done')
        });
    }
    ///////////////////////////////////////////////////
    // deleteActivityLookup
var deleteActivityLookup = function(req, res, next) {
        var id = req.params.id;
        console.log('deleting ActivityLookup now by id: ' + id);
        ActivityLookup.remove({ _id: id }, function(err) {
            if (err) {
                console.log(err);
                next(err);
            }
            console.log("ActivityLookup deleted");
            res.send('Done')
        });
    }
    /////////////////////////////////////////////////////////
    //get all actLookup list
var getAll = function(req, res, next) {
    ActivityLookup.find(function(err, actLookup) {
        if (err) {

            next(err);
        } else {

            res.json(actLookup);
        }
    });
}

////////////////////////////////////////////////////////

module.exports = {
    getActivityLookup: getActivityLookup,
    saveActivityLookup: saveActivityLookup,
    updateActivityLookup: updateActivityLookup,
    deleteActivityLookup: deleteActivityLookup,
    getAll: getAll
}