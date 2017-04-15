import { UtilityService } from '../../services/utility.service';
import { Tree } from './../../models/tree';
import { TreeBuilderService } from './../../services/treeBuilder.service';
import { TreeNode } from 'primeng/primeng';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit {

  actTree:TreeNode[]=[];
  constructor(private treeService:TreeBuilderService,private utilityService:UtilityService) { }

  ngOnInit() {


   this.actTree.push(this.treeService.treeBuilder());


  }
nodeSelect(evt)
{
  if(evt.node.data!=null){
    this.utilityService.viewActivity(evt.node.data);

  }

}
}
