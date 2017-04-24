export class Activity {
_id:string;
parentId:string;
title:string;
desc:string;
benefit:string;
cost:number;
costSaving:number;
startDate:Date;
endDate:Date;
sponsor:[string];
assignee:[string];
buAssignee:[string];
kpiId:string;
percentage: number;//percentage of completion
catId:string; //category Id
deptId:[string]; //dept Id
focusId:string; //focus Id
phaseId:string; //phase Id
visId:[string]; //Visisblity ID
statusId:string;
createdBy:string;
createdAt:Date;
updatedBy: string;
updatedAt: Date;
level:number;
projDetail:string;
docLink:string;
outOfScope:string;
challenge:string;
nextStep:string;
monitored:boolean;
chartered:boolean;
}
