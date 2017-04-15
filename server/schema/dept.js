const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeptSchema = new Schema({
    title: String,
    code: String,
    desc: String,
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Dept', DeptSchema);
