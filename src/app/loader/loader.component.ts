import { Input } from '@angular/core/core';
import { LoaderService } from '../services/loaderService';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  hidden:boolean=true;
  constructor(private  loaderService:LoaderService) { }



  ngOnInit() {
   this.loaderService.showOrHideLoader().subscribe((index: number) => {
     debugger;
     if(index<=0)
      this.hidden=true;//hide
     else
      this.hidden=false;//show
   });
  }

}
