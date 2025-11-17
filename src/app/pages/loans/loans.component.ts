import { Component, Input, input, OnInit } from '@angular/core';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthPinService } from '../../core/auth-pin.service';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
@Component({
  selector: 'app-loans',
  imports: [ CommonModule, 
    AppHeaderComponent,MultiSelectModule,
    InputNumberModule,
    FormsModule,CardModule,SelectModule,ButtonModule,TableModule],
  templateUrl: './loans.component.html',
  styleUrl: './loans.component.scss',
  providers: [DatePipe],
})
export class LoansComponent implements OnInit {
@Input() showHeader=true  
availability:boolean=true
employees:any=[]
employeeSelected:any
date: any = new Date();
tools:any=[]
toolsSelected:any=[]
quantityByTool:any
userToolTrackApp:any
constructor(private authS:AuthPinService,private datePipe: DatePipe){}
ngOnInit(): void {
  this.userToolTrackApp =JSON.parse(localStorage.getItem("userToolTrackApp")!);
  
  this.getCatalogsForLoans()
}

getCatalogsForLoans(){
  this.authS.getCatalogsForLoans().subscribe((resp:any)=>{
    this.employees=resp[0]
    this.tools=resp[1]
    this.tools.map((tool:any)=>{tool.quantity=1,tool.delivered=false,tool.availability=true})

    console.log('employees',this.employees)
    console.log('tools',this.tools)
   
  })
}

verifyQuantity(idTool:any){

  let toolFound=this.toolsSelected.find((tool:any)=>tool.id==idTool)
  if(toolFound.total_quantity<toolFound.quantity){
    toolFound.availability=false
  }
  else 
  {
  toolFound.availability=true
  }

  const index = this.toolsSelected.findIndex(
          (tool: any) =>
            tool.id == idTool
  );

  this.toolsSelected[index].availability=toolFound.availability
  this.availability=this.toolsSelected.filter((tool:any)=>tool.availability==false).length>0?false:true 

}

createLoan(){
let date = this.datePipe.transform(
      this.date.setDate(this.date.getDate()),
      "yyyy-MM-dd"
);  

const currentDate = new Date();
const hours = String(currentDate.getHours()).padStart(2, '0');
const minutes = String(currentDate.getMinutes()).padStart(2, '0');
const seconds = String(currentDate.getSeconds()).padStart(2, '0');
this.toolsSelected.map((tool:any)=>tool.total_quantity-=Number(tool.quantity))
  let loan = {
  'hour': `${hours}:${minutes}:${seconds}`,
  'date' :date,
  'delivered_all' :false,
  'id_leader':this.userToolTrackApp.id,
  'employee':this.employeeSelected,
  'id_employee':this.employeeSelected.id,
  'tools':this.toolsSelected
  }

  this.toolsSelected.forEach((toolSelect:any) => {
  const index = this.tools.findIndex(
          (tool: any) =>
            tool.id == toolSelect.id
  );

  this.tools[index].total_quantity=toolSelect.total_quantity
  });

  this.authS.createLoan(loan).then((resp:any)=>{
    this.toolsSelected=[]
    this.employeeSelected=null
  })


  console.log('tools',this.tools)
}
}

