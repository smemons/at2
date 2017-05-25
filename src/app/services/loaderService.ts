import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { Injectable } from '@angular/core';

@Injectable()
export class LoaderService {
private subject = new Subject<number>();
private index:number=0;
constructor() { }

showLoader()
{
  this.index++;
  this.subject.next(this.index);
}
hideLoader()
{
  this.index--;
  if(this.index<0)this.index=0;
  this.subject.next(this.index);

}
showOrHideLoader(): Observable <number> {
        return this.subject.asObservable();
    }


}
