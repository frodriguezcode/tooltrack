import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthPinService } from '../../core/auth-pin.service';
import { CommonModule,DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

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
  imports: [CommonModule,FormsModule,TableModule,
    ConfirmDialogModule,
    FontAwesomeModule,TooltipModule,TranslateModule,ConfirmPopupModule],
  templateUrl: './detail-loan.component.html',
  styleUrl: './detail-loan.component.scss',
  providers: [ConfirmationService, MessageService,DatePipe]
})
export class DetailLoanComponent implements OnInit {
@Input() idLoan:string=''
@Output() newItemEvent = new EventEmitter<boolean>();
@Output() EditPrestamo = new EventEmitter<any>();
faToggleOn = faToggleOn;
faToggleOff = faToggleOff;
faUserPlus = faUserPlus;
constructor(private AuthS:AuthPinService,
  private confirmationService: ConfirmationService,
  private datePipe: DatePipe,
   private messageService: MessageService){}
loan:any=[]
tools:any=[]
userToolTrackApp:any
date: any = new Date();
ngOnInit(): void {
this.userToolTrackApp =JSON.parse(localStorage.getItem("userToolTrackApp")!);

 this.getLoan()   
}
getLoan(){
this.AuthS.getLoanById(this.idLoan).then(resp=>{
  this.loan=resp
  this.AuthS.getTools().then((resp:any)=>{
    this.tools=resp
  })

})
}

    confirmDelivered(event: Event,tool:any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'This action cannot be reversed',
            header: 'Are you sure that you want to proceed?',
            closable: true,
            closeOnEscape: true,
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: 'Yes',
            },
            accept: () => {
                this.updateDelivered(tool)
            },
            reject: () => {
          
            },
        });
    }

updateDelivered(tool:any) {

      const currentDate = new Date();
      const hours = String(currentDate.getHours()).padStart(2, '0');
      const minutes = String(currentDate.getMinutes()).padStart(2, '0');
      const seconds = String(currentDate.getSeconds()).padStart(2, '0');
      let date = this.datePipe.transform(
      this.date.setDate(this.date.getDate()),
      "yyyy-MM-dd"
      );

      let tool_returned = {
      'hour': `${hours}:${minutes}:${seconds}`,
      'date' :date,
      'id_tool':tool.id,
      'quantity':tool.quantity,
      'id_leader':this.userToolTrackApp.id,
      'id_employee':this.loan[0].id_employee,

      }
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



      this.AuthS.updateLoan(this.loan[0],tool_returned).then((resp:any)=>{
        this.EditPrestamo.emit({
          "loanEdit":this.loan[0],
          "tool_returned":tool_returned
        
        })
      })



}
}
