var Visibility = require('../schema/visibility');
// get single room
var getVisibility = function(req, resp, next) {
    resp.send("GET");
}

// create single vis
////////////////////////////////////////////////////
var saveVisibility = function(req, res, next) {
        console.log('creating Visibility now');
        var vis = new Visibility(req.body);

        vis.save(function(err) {
            if (err) {

                return next(err);
            } else {

                return res.json({
                    message: 'Visibility created!'
                });
            }
        });
    }
    //////////////////////////////////////////////////
    // updateVisibility
var updateVisibility = function(req, res, next) {

        var vis = new Visibility(req.body);
        console.log('updating Visibility now' + vis);
        Visibility.findByIdAndUpdate(vis._id, { $set: vis }, function(err, result) {
            if (err) {
                console.log(err);
                next(err);
            }
            console.log("Visibility updated: " + result);
            res.send('Done')
        });
    }
    ///////////////////////////////////////////////////
    // deleteVisibility
var deleteVisibility = function(req, res, next) {
        var id = req.params.id;
        console.log('deleting Visibility now by id: ' + id);
        Visibility.remove({ _id: id }, function(err) {
            if (err) {
                console.log(err);
                next(err);
            }
            console.log("Visibility deleted");
            res.send('Done')
        });
    }
    /////////////////////////////////////////////////////////
    //get all vis list
var getAll = function(req, res, next) {
    Visibility.find(function(err, vis) {
        if (err) {

            next(err);
        } else {

            res.json(vis);
        }
    });
}

////////////////////////////////////////////////////////

module.exports = {
    getVisibility: getVisibility,
    saveVisibility: saveVisibility,
    updateVisibility: updateVisibility,
    deleteVisibility: deleteVisibility,
    getAll: getAll
}