import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

@Injectable()
export class AlertService {

private subject = new Subject<any>();
  constructor(private location:Location) { }

   warn(message: string) {
         this.subject.next({ severity:'warn', summary:' Warning', detail: message});
    }

   info(message: string) {
         this.subject.next({ severity:'info', summary:' Info', detail: message});
    }
    success(message: string) {

         this.subject.next({ severity:'success', summary:' Success', detail: message});

    }

    error(message: string) {

        this.subject.next({ severity:'error', summary:'Error Message', detail: message});
    }

    getMessage(): Observable <any> {
        return this.subject.asObservable();
    }


}
