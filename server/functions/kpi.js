var KPI = require('../schema/kpi');
// get single room
var getKPI = function(req, resp, next) {
    resp.send("GET");
}

// create single kpi
////////////////////////////////////////////////////
var saveKPI = function(req, res, next) {
        console.log('creating KPI now');
        var kpi = new KPI(req.body);

        kpi.save(function(err, doc) {
            if (err) {

                return next(err);
            } else {

                return res.json(doc);
            }
        });
    }
    //////////////////////////////////////////////////
    // updateKPI
var updateKPI = function(req, res, next) {

        var kpi = new KPI(req.body);
        console.log('updating KPI now' + kpi);
        KPI.findByIdAndUpdate(kpi._id, { $set: kpi }, function(err, result) {
            if (err) {
                console.log(err);
                next(err);
            }
            console.log("KPI updated: " + result);
            res.send('Done')
        });
    }
    ///////////////////////////////////////////////////
    // deleteKPI
var deleteKPI = function(req, res, next) {
        var id = req.params.id;
        console.log('deleting KPI now by id: ' + id);
        KPI.remove({ _id: id }, function(err) {
            if (err) {
                console.log(err);
                next(err);
            }
            console.log("KPI deleted");
            res.send('Done')
        });
    }
    /////////////////////////////////////////////////////////
    //get all kpi list
var getAll = function(req, res, next) {
    KPI.find(function(err, kpi) {
        if (err) {

            next(err);
        } else {

            res.json(kpi);
        }
    });
}

////////////////////////////////////////////////////////

module.exports = {
    getKPI: getKPI,
    saveKPI: saveKPI,
    updateKPI: updateKPI,
    deleteKPI: deleteKPI,
    getAll: getAll
}