export class Activity {
_id:string;
parentId:string;
title:string;
desc:string;
startDate:Date;
endDate:Date;
sponsor:[string];
assignee:[string];
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
}
