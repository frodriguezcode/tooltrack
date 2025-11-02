import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { SelectModule } from 'primeng/select';
import { AuthPinService } from '../../core/auth-pin.service';

@Component({
  selector: 'app-users',
  imports: [CommonModule,
    TableModule,ButtonModule,
    InputTextModule,
    SelectModule,
    Dialog,
    FormsModule,ReactiveFormsModule],
  templateUrl: './users.component.html',
  providers: [DatePipe],
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
 showPin = false;
 UsuarioForm!:FormGroup
 users:any=[]
 Date:any= new Date();
 icon!: IconProp;
 role_list:any=[]
 role_selected:string=''
visibleCreateUser: boolean = false;
 constructor(private datePipe: DatePipe, private auth: AuthPinService,){}

 ngOnInit(): void {
  this.getUsers()
  this.role_list.push(
    {
    id_rol:'1',
    name:'super user'
    },
    {
    id_rol:'2',
    name:'leader'
    },
    {
    id_rol:'3',
    name:'employee'
    },
    
    )
    this.UsuarioForm = new FormGroup({
      firs_name: new FormControl('',[Validators.required]), 
      last_name: new FormControl('',[Validators.required]), 
      status: new FormControl(true), 
      pin: new FormControl('',[Validators.required]), 
      id_role: new FormControl('',[Validators.required]), 
      register_date: new FormControl(this.datePipe.transform(this.Date.setDate(this.Date.getDate()), 'yyyy-MM-dd')), 
    })
 }

  showCreateUser() {
    this.visibleCreateUser = true;
  }

  getUsers(){

  }
  saveUser(){
    console.log('UsuarioForm',this.UsuarioForm.value)

  }

  changePin() {
      this.showPin = !this.showPin;
  }


}
