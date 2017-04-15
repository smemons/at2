const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CatSchema = new Schema({
    title: String,
    desc: String,
    createdAt: { type: Date, default: Date.now },
    createdBy: String
});
module.exports = mongoose.model('Category', CatSchema);
