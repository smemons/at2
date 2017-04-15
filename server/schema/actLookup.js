const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lookupSchema = new Schema({
    actId: String,
    parentId: String,
    level: { type: Number, default: 0 },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('ActivityLookup', lookupSchema);