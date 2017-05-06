const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ActSchema = new Schema({
    parentId: { type: mongoose.Schema.ObjectId },
    title: String,
    desc: String,
    benefit: String,
    focusId: { type: mongoose.Schema.ObjectId },
    phaseId: { type: mongoose.Schema.ObjectId },
    cost: { type: Number, default: 0 },
    costSaving: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now },
    sponsor: [String],
    assignee: [String],
    buAssignee: [String],
    percentage: { type: Number, default: 0 },
    delta: { type: Number, default: 0 },
    catId: { type: mongoose.Schema.ObjectId },
    deptId: [mongoose.Schema.ObjectId],
    visId: [mongoose.Schema.ObjectId],
    statusId: { type: mongoose.Schema.ObjectId },
    kpiId: { type: mongoose.Schema.ObjectId },
    createdAt: { type: Date, default: Date.now },
    createdBy: String,
    updatedAt: { type: Date, default: Date.now },
    updatedBy: String,
    level: { type: Number, default: 0 },
    projDetail: String,
    docLink: String,
    outOfScope: String,
    challenge: String,
    nextStep: String,
    monitored: Boolean,
    chartered: Boolean

});
module.exports = mongoose.model('Activity', ActSchema)