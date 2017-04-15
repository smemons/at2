const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhaseSchema = new Schema({
    title: String,
    desc: String,

    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedBy: String,
    updatedAt: Date,
});
module.exports = mongoose.model('Phase', PhaseSchema);
