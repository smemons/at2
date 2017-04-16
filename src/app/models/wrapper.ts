import { DDType } from './DDType.enum';
export class Wrapper {
  label:string;
  id:string;
  type:DDType
  constructor(label:string,id:string,type:DDType)
  {
    this.label=label;
    this.id=id;
    this.type=type;
  }
}
