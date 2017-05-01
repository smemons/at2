import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AnalyticsService {

constructor(private http:Http) { }
/**
 * get all depts with its overdue,need attention, in progress and complete values
 */
getDeptProgress()
{
   return this.http.get('/api/analytics/allDepts').map((response: Response) => response.json());
}
/**
 *
 */
getDeptPhaseProgress()
{
   return this.http.get('/api/analytics/allDeptPhase').map((response: Response) => response.json());
}

/**
 * get activity and its hierarchy by activity id
 */
getActivityHrchyById(id:string,deptId:string)
{
   return this.http.get('/api/analytics/allActHrchy/'+id+"/"+deptId).map((response: Response) => response.json());
}
/**
 * get all status with its overdue,need attention, in progress and complete values
 */
getStatusByRef()
{
  return this.http.get('/api/analytics/allStatusByRef').map((response: Response) => response.json());
}
/**
 * get all acts group by dept
 */
getActsGrByDept(id)
{
  return this.http.get('/api/analytics/allGrByDept/'+id).map((response: Response) => response.json());
}
/**
 * get all acts group by category
 */
getActsGrByCat(id)
{
  return this.http.get('/api/analytics/allGrByCat/'+id).map((response: Response) => response.json());
}

}
