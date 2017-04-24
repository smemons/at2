/**
 * this file will hold analytics about the getting all the departments and there accumulated performance by
 * Over Due, Need Attention, In Progress and Complete
 */
var unwind = {
    $unwind: "$deptId"
};
var lookup = {
    $lookup: {
        from: "depts",
        localField: "deptId",
        foreignField: "_id",
        as: "dept"
    }
};
var project1 = {
    $project: {
        _id: 0,
        // projId:"$_id",
        complete: "$percentage",
        //endDate:1,
        //startDate:1,
        deptName: "$dept.title",
        deptId: "$dept._id",
        //status:"$status.title",
        totalDays: { $divide: [{ $subtract: ["$endDate", "$startDate"] }, 86400000] },
        consumedDays: { $divide: [{ $subtract: [new Date(), "$startDate"] }, 86400000] },
        remainDays: { $divide: [{ $subtract: ["$endDate", new Date()] }, 86400000] },
        actual: {
            $multiply: [{
                $divide: [{ $divide: [{ $subtract: [new Date(), "$startDate"] }, 86400000] },
                    { $divide: [{ $subtract: ["$endDate", "$startDate"] }, 86400000] }
                ]
            }, 100]
        }
    }
};
var project2 = {
    $project: {
        _id: 0,
        deptName: 1,
        deptId: 1,
        // field:"$$ROOT",
        "score": {
            $switch: {
                branches: [{
                        case: {
                            $and: [{ $gte: ["$actual", "$complete"] },
                                { $lte: ["$remainDays", 0] }
                            ]
                        },
                        then: "OverDue"
                    },
                    {
                        case: {
                            $and: [{ $gt: ["$actual", "$complete"] },
                                { $gt: ["$remainDays", 0] }
                            ]
                        },
                        then: "NeedAttention"
                    },
                    {
                        case: {
                            $and: [{ $lte: ["$actual", "$complete"] },
                                { $gt: ["$remainDays", 0] },
                                { $lt: ["$complete", 100] }
                            ]
                        },
                        then: "InProgress"
                    },
                    {
                        case: { $eq: ["$complete", 100] },
                        then: "Completed"
                    }
                ],
                default: "No scores found."
            }
        }
    }
};
var group = {
    $group: {
        _id: { depName: "$deptName", deptId: "$deptId" },
        // _id: "$deptName",
        // "deptName": { $addToSet: "$deptName" },
        // "deptId": { $addToSet: "$deptId" },
        "OverDue": {
            "$sum": {
                "$cond": [
                    { "$eq": ["$score", "OverDue"] },
                    1,
                    0
                ]
            }
        },
        "NeedAttention": {
            "$sum": {
                "$cond": [
                    { "$eq": ["$score", "NeedAttention"] },
                    1,
                    0
                ]
            }
        },
        "InProgress": {
            "$sum": {
                "$cond": [
                    { "$eq": ["$score", "InProgress"] },
                    1,
                    0
                ]
            }
        },
        "Completed": {
            "$sum": {
                "$cond": [
                    { "$eq": ["$score", "Completed"] },
                    1,
                    0
                ]
            }
        }
    }
};
module.exports = {
        unwind: unwind,
        lookup: lookup,
        project1: project1,
        project2: project2,
        group: group
    }
    //db.getCollection('activities').aggregate([unwind, lookup, project1, project2, group]);