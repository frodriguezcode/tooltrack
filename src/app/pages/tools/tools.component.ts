import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { AuthPinService } from '../../core/auth-pin.service';
import { CheckboxModule } from 'primeng/checkbox';
@Component({
  selector: 'app-tools',
  imports: [ CommonModule,TableModule,ButtonModule,
      InputTextModule,
      SelectModule,
      Dialog,
      FormsModule,ReactiveFormsModule,CheckboxModule],
  templateUrl: './tools.component.html',
  styleUrl: './tools.component.scss'
})
export class ToolsComponent implements OnInit {
constructor (private authS:AuthPinService) {}
id_tool:FormControl=new FormControl('')
name_tool:FormControl=new FormControl('')
status:FormControl=new FormControl(true)
total_quantity:FormControl=new FormControl(0)
tools:any=[]
editingTool= false
visibleCreateTool: boolean = false;
titleDialog:string=''
ngOnInit(): void {
  this.getTools()
}

getTools(){
  this.authS.getTools().then(resp=>{
    this.tools=resp
  })
}

createTool(){
   this.titleDialog='Create Tool'
   this.visibleCreateTool = true;

}
editTool(tool:any){
console.log('tool',tool)

this.name_tool.setValue(tool.name)
this.total_quantity.setValue(tool.total_quantity)
this.id_tool.setValue(tool.id)
this.titleDialog='Edit Tool'
this.editingTool=true
this.visibleCreateTool=true

}

saveTool(){
  let _tool={
    "name":this.name_tool.value,
    "total_quantity":this.total_quantity.value,
    "status":this.status.value,
    "ids_buildings":[]
  }
  this.authS.saveTool(_tool).then(resp=>{
    this.name_tool.setValue('')
    this.total_quantity.setValue('')
    this.tools.push(_tool)
  })

}

  updateStatusTool(tool:any){
    
    tool.status=!tool.status
    this.authS.updateStatusTool(tool)
  }

updateTool(){
  let _tool={
    "name":this.name_tool.value,
    "total_quantity":this.total_quantity.value,
    "id":this.id_tool.value,
  }
this.authS.updateTool(_tool).then(resp=>{
     const index = this.tools.findIndex((user: any) => user.id === _tool.id);
     if (index !== -1) {
      this.tools[index].name = this.name_tool.value
      this.tools[index].total_quantity = this.total_quantity.value

     }


  this.visibleCreateTool=false
  
})  
}



}
