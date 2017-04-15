var Dept = require('../schema/dept');
// get single room
var getDept = function(req, resp, next) {
    resp.send("GET");
}

// create single dept
////////////////////////////////////////////////////
var saveDept = function(req, res, next) {
        console.log('creating Dept now');
        var dept = new Dept(req.body);

        dept.save(function(err) {
            if (err) {

                return next(err);
            } else {

                return res.json({
                    message: 'Dept created!'
                });
            }
        });
    }
    //////////////////////////////////////////////////
    // updateDept
var updateDept = function(req, res, next) {

        var dept = new Dept(req.body);
        console.log('updating Dept now' + dept);
        Dept.findByIdAndUpdate(dept._id, { $set: dept }, function(err, result) {
            if (err) {
                console.log(err);
                next(err);
            }
            console.log("Dept updated: " + result);
            res.send('Done')
        });
    }
    ///////////////////////////////////////////////////
    // deleteDept
var deleteDept = function(req, res, next) {
        var id = req.params.id;
        console.log('deleting Dept now by id: ' + id);
        Dept.remove({ _id: id }, function(err) {
            if (err) {
                console.log(err);
                next(err);
            }
            console.log("Dept deleted");
            res.send('Done')
        });
    }
    /////////////////////////////////////////////////////////
    //get all dept list
var getAll = function(req, res, next) {
    Dept.find(function(err, dept) {
        if (err) {

            next(err);
        } else {

            res.json(dept);
        }
    });
}

////////////////////////////////////////////////////////

module.exports = {
    getDept: getDept,
    saveDept: saveDept,
    updateDept: updateDept,
    deleteDept: deleteDept,
    getAll: getAll
}