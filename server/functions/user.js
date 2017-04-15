var User = require('../schema/user');
// get single user
var getUser = function(req, resp, next) {
    resp.send("GET");
}

// get single user
var saveUser = function(req, res, next) {
    console.log('Registering user now');
    var user = new User(req.body);

    user.save(function(err) {
        if (err) {

            return next(err);
        } else {

            return res.json({
                message: 'UserCreated!'
            });
        }
    });
}

var getAll = function(req, res, next) {
        User.find(function(err, users) {
            if (err) {
                next(err);
            } else {
                res.json(users);
            }
        });
    }
    //search user for typeahead
var getSearch = function(req, res, next) {
    var regex = new RegExp(req.query["term"], 'i');
    var query = User.find({ 'username': regex }, { username: 1, _id: 0 }).limit(10);
    query.exec(function(err, users) {
        if (err) {
            next(err);
        } else {

            res.json(users);
        }
    });
}

//authenticate user
var authenticate = function(req, res, next) {

    var user = new User(req.body);

    User.findOne({
            "username": user.username
        },

        function(err, aUser) {



            if (err) {
                res.status(500);
                return next(err);
            }

            if (!aUser) {

                res.json({
                    success: false,
                    message: 'User not Found'
                });

            }
            if (aUser) { // Search could come back empty, so we should protect against sending nothing back
                if (aUser.password != user.password) {

                    res.json({
                        success: false,
                        message: 'Authentication Failed, incorrect password'
                    });

                } else { // succss

                    res.json({
                        success: true,
                        message: 'User logged in successfully',
                        'user': aUser
                    });

                }
            }

        }
    );
}
module.exports = {
    getUser: getUser,
    saveUser: saveUser,
    authenticate: authenticate,
    getAll: getAll,
    getSearch: getSearch
}