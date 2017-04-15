/**
 * activity look up model is for look up entries for parent and child relationship
*/
export class ActivityLookup {
  _id:string;
  actId:string;
  parentId:string;
  level:number;
  createdBy: string;
  createdAt: Date;
}
