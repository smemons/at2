const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VisibilitySchema = new Schema({
    title: String,
    code: String,
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedBy: String,
    updatedAt: Date,
});
module.exports = mongoose.model('Visibility', VisibilitySchema);