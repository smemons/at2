var Phase = require('../schema/phase');
// get single room
var getPhase = function(req, resp, next) {
    resp.send("GET");
}

// create single phase
////////////////////////////////////////////////////
var savePhase = function(req, res, next) {
        console.log('creating Phase now');
        var phase = new Phase(req.body);

        phase.save(function(err) {
            if (err) {

                return next(err);
            } else {

                return res.json({
                    message: 'Phase created!'
                });
            }
        });
    }
    //////////////////////////////////////////////////
    // updatePhase
var updatePhase = function(req, res, next) {

        var phase = new Phase(req.body);
        console.log('updating Phase now' + phase);
        Phase.findByIdAndUpdate(phase._id, { $set: phase }, function(err, result) {
            if (err) {
                console.log(err);
                next(err);
            }
            console.log("Phase updated: " + result);
            res.send('Done')
        });
    }
    ///////////////////////////////////////////////////
    // deletePhase
var deletePhase = function(req, res, next) {
        var id = req.params.id;
        console.log('deleting Phase now by id: ' + id);
        Phase.remove({ _id: id }, function(err) {
            if (err) {
                console.log(err);
                next(err);
            }
            console.log("Phase deleted");
            res.send('Done')
        });
    }
    /////////////////////////////////////////////////////////
    //get all phase list
var getAll = function(req, res, next) {
    Phase.find(function(err, phase) {
        if (err) {

            next(err);
        } else {

            res.json(phase);
        }
    });
}

////////////////////////////////////////////////////////

module.exports = {
    getPhase: getPhase,
    savePhase: savePhase,
    updatePhase: updatePhase,
    deletePhase: deletePhase,
    getAll: getAll
}