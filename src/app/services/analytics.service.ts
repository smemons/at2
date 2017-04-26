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
getActivityHrchyById(id:string,deptName:string)
{
   return this.http.get('/api/analytics/allActHrchy/'+id+"/"+deptName).map((response: Response) => response.json());
}
}
