var Focus = require('../schema/focus');
// get single room
var getFocus = function(req, resp, next) {
    resp.send("GET");
}

// create single focus
////////////////////////////////////////////////////
var saveFocus = function(req, res, next) {
        console.log('creating Focus now');
        var focus = new Focus(req.body);

        focus.save(function(err) {
            if (err) {

                return next(err);
            } else {

                return res.json({
                    message: 'Focus created!'
                });
            }
        });
    }
    //////////////////////////////////////////////////
    // updateFocus
var updateFocus = function(req, res, next) {

        var focus = new Focus(req.body);
        console.log('updating Focus now' + focus);
        Focus.findByIdAndUpdate(focus._id, { $set: focus }, function(err, result) {
            if (err) {
                console.log(err);
                next(err);
            }
            console.log("Focus updated: " + result);
            res.send('Done')
        });
    }
    ///////////////////////////////////////////////////
    // deleteFocus
var deleteFocus = function(req, res, next) {
        var id = req.params.id;
        console.log('deleting Focus now by id: ' + id);
        Focus.remove({ _id: id }, function(err) {
            if (err) {
                console.log(err);
                next(err);
            }
            console.log("Focus deleted");
            res.send('Done')
        });
    }
    /////////////////////////////////////////////////////////
    //get all focus list
var getAll = function(req, res, next) {
    Focus.find(function(err, focus) {
        if (err) {

            next(err);
        } else {

            res.json(focus);
        }
    });
}

////////////////////////////////////////////////////////

module.exports = {
    getFocus: getFocus,
    saveFocus: saveFocus,
    updateFocus: updateFocus,
    deleteFocus: deleteFocus,
    getAll: getAll
}