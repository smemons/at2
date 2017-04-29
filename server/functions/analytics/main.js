/**
 * this file will hold analytics about the getting all the departments and there accumulated performance by
 * Over Due, Need Attention, In Progress and Complete
 */
var matchLevel0 = {
    $match: { level: 0 }
}
var unwindDept = {
    $unwind: "$deptId"
};
var lookupDept = {
    $lookup: {
        from: "depts",
        localField: "deptId",
        foreignField: "_id",
        as: "dept"
    }
};
var lookupPhase = {
    $lookup: {
        from: "phases",
        localField: "phaseId",
        foreignField: "_id",
        as: "phase"
    }
};
var projectDept1 = {
    $project: {
        _id: 0,
        // projId:"$_id",
        complete: "$percentage",
        //endDate:1,
        //startDate:1,
        deptName: "$dept.title",
        deptId: "$dept._id",
        // phase: "$phase.title",
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
var projectDept2 = {
    $project: {
        _id: 0,
        deptName: { $arrayElemAt: ["$deptName", 0] },
        deptId: 1,
        phase: { $arrayElemAt: ["$phase", 0] },
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
var groupDept = {
    $group: {
        _id: { depName: "$deptName", deptId: "$deptId" },
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
//phase related things
var projectPhase1 = {
    $project: {
        _id: 0,
        deptName: "$dept.title",
        deptId: "$dept._id",
        phase: "$phase.title",
    }
};
var projectPhase2 = {
    $project: {
        _id: 0,
        deptName: { $arrayElemAt: ["$deptName", 0] },
        deptId: 1,
        phase: { $arrayElemAt: ["$phase", 0] },
    }
};
var groupPhase = {
    $group: {
        _id: { depName: "$deptName", deptId: "$deptId" },
        "Scoping": {
            "$sum": {
                "$cond": [
                    { "$eq": ["$phase", "Scoping"] },
                    1,
                    0
                ]
            }
        },
        "Design": {
            "$sum": {
                "$cond": [
                    { "$eq": ["$phase", "Design"] },
                    1,
                    0
                ]
            }
        },
        "Implementation": {
            "$sum": {
                "$cond": [
                    { "$eq": ["$phase", "Implementation"] },
                    1,
                    0
                ]
            }
        },
    }
};
var lookupStatus = {
    $lookup: {
        from: "status",
        localField: "statusId",
        foreignField: "_id",
        as: "status"
    }
};
var lookupFocus = {
    $lookup: {
        from: "focus",
        localField: "focusId",
        foreignField: "_id",
        as: "focus"
    }
};
var selfActLookup = {
    $lookup: {
        from: "activities",
        localField: "_id",
        foreignField: "parentId",
        as: "firstChild"
    }
};
var actGraphLookup = {
    $graphLookup: {
        from: "activities",
        startWith: "$_id",
        connectFromField: "_id",
        connectToField: "parentId",
        as: "children"
    }
};
// {
//    $match:{level:0}
// }
var actProject = {
    $project: {
        _id: "$_id",
        percentage: 1,
        endDate: 1,
        startDate: 1,
        cost: 1,
        title: 1,
        assignee: 1,
        deptName: "$dept.title",
        focus: "$focus.title",
        phase: "$phase.title",
        status: "$status.title",
        firstChild: 1,
        children: 1,
    }
};
var refStatusQuery = [{
        $unwind: "$deptId"
    },
    {
        $lookup: {
            from: "categories",
            localField: "catId",
            foreignField: "_id",
            as: "cat"
        }
    }, {
        $project: {
            _id: 0,
            projId: "$_id",
            complete: "$percentage",
            endDate: 1,
            startDate: 1,
            catName: "$cat.title",
            catId: "$cat._id",
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
    }, {
        $project: {
            _id: 0,
            catName: { $arrayElemAt: ["$catName", 0] },
            catId: 1,
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
    }, {
        $group: {
            _id: { catName: "$catName", catId: "$catId" },
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
    }
];

module.exports = {
        matchLevel0: matchLevel0,
        unwindDept: unwindDept,
        lookupDept: lookupDept,
        lookupPhase: lookupPhase,
        projectDept1: projectDept1,
        projectDept2: projectDept2,
        groupDept: groupDept,
        projectPhase1: projectPhase1,
        projectPhase2: projectPhase2,
        groupPhase: groupPhase,
        actProject: actProject,
        actGraphLookup: actGraphLookup,
        lookupFocus: lookupFocus,
        lookupStatus: lookupStatus,
        selfActLookup: selfActLookup,
        refStatusQuery: refStatusQuery,

    }
    //db.getCollection('activities').aggregate([unwind, lookup, project1, project2, group]);