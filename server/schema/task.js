const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({

    desc: String,
    activityId: String,
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedBy: String,
    updatedAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Task', TaskSchema);