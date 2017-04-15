const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StatusSchema = new Schema({

    title: String,
    code: String,
    desc: String,
    colorCode: String,
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Status', StatusSchema);
