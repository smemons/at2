import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(val: any, args?:any): string {

    if (args === undefined) {
      return val;
    }

    if (val.length > args) {
      return val.substring(0, args) + '...';
    } else {
      return val;
    }

  }

}
