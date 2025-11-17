import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthPinService } from '../../core/auth-pin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import Swal from 'sweetalert2'
import {
  faToggleOn,
  faToggleOff,
  faUserPlus,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TooltipModule } from 'primeng/tooltip';
@Component({
  selector: 'app-detail-loan',
  imports: [CommonModule,FormsModule,TableModule,FontAwesomeModule,TooltipModule,TranslateModule],
  templateUrl: './detail-loan.component.html',
  styleUrl: './detail-loan.component.scss'
})
export class DetailLoanComponent implements OnInit {
@Input() idLoan:string=''
@Output() newItemEvent = new EventEmitter<boolean>();
faToggleOn = faToggleOn;
faToggleOff = faToggleOff;
faUserPlus = faUserPlus;
constructor(private AuthS:AuthPinService){}
loan:any=[]
tools:any=[]
ngOnInit(): void {
 this.getLoan()   
}
getLoan(){
this.AuthS.getLoanById(this.idLoan).then(resp=>{
  this.loan=resp
  this.AuthS.getTools().then((resp:any)=>{
    this.tools=resp
    console.log('tools',this.tools)
  })
  console.log('loan',this.loan)
})
}

updateDelivered(tool:any) {

      tool.delivered = !tool.delivered;

      let toolFound = this.tools.find((t:any) => t.id == tool.id);

      tool.total_quantity = toolFound.total_quantity + tool.quantity;
      tool.quantity = 0;

      const index = this.loan[0].tools.findIndex(
        (t: any) => t.id == tool.id
      );

      this.loan[0].tools[index] = {
        ...this.loan[0].tools[index],
        delivered: tool.delivered,
        quantity: tool.quantity,
        total_quantity: tool.total_quantity,
        availability: tool.quantity <= tool.total_quantity
      };

      this.loan[0].delivered_all =
        this.loan[0].tools.every((t:any) => t.delivered);
      console.log('loan[0]',this.loan[0])
      this.AuthS.updateLoan(this.loan[0]).then((resp:any)=>{

      })



}
}
