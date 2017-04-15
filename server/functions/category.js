var Category = require('../schema/category');
// get single room
var getCategory = function(req, resp, next) {
    resp.send("GET");
}

// create single room
var saveCategory = function(req, res, next) {
        console.log('creating Category now');
        var category = new Category(req.body);

        category.save(function(err) {
            if (err) {

                return next(err);
            } else {

                return res.json({
                    message: 'Category created!'
                });
            }
        });
    }
    // updateCategory
var updateCategory = function(req, res, next) {

        var category = new Category(req.body);
        console.log('updating Category now' + category);
        Category.findByIdAndUpdate(category._id, { $set: category }, function(err, result) {
            if (err) {
                console.log(err);
                next(err);
            }
            console.log("Category updated: " + result);
            res.send('Done')
        });
    }
    // deleteCategory
var deleteCategory = function(req, res, next) {
    var id = req.params.id;
    console.log('deleting Category now by id: ' + id);
    Category.remove({ _id: id }, function(err) {
        if (err) {
            console.log(err);
            next(err);
        }
        console.log("Category deleted");
        res.send('Done')
    });
}
var getAll = function(req, res, next) {
    Category.find(function(err, category) {
        if (err) {

            next(err);
        } else {

            res.json(category);
        }
    });
}



module.exports = {
    getCategory: getCategory,
    saveCategory: saveCategory,
    updateCategory: updateCategory,
    deleteCategory: deleteCategory,
    getAll: getAll
}