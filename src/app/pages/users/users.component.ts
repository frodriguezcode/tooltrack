import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { SelectModule } from 'primeng/select';
import { AuthPinService } from '../../core/auth-pin.service';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { TooltipModule } from 'primeng/tooltip';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faToggleOn,
  faToggleOff,
  faUserPlus,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    Dialog,
    FormsModule,
    ReactiveFormsModule,
    AppHeaderComponent,
    FontAwesomeModule,
    TooltipModule,
    TranslateModule
  ],
  templateUrl: './users.component.html',
  providers: [DatePipe],
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  userName: string = 'Supervisor';
  faToggleOn = faToggleOn;
  faToggleOff = faToggleOff;
  faUserPlus = faUserPlus;
  faEdit = faEdit;
  showPin = false;
  editingUser = false;
  titleDialog: string = '';
  UsuarioForm!: FormGroup;
  users: any = [];
  usersBack: any = [];
  idRol:string=''
  Date: any = new Date();
  icon!: IconProp;
  role_list: any = [];
  role_selected: string = '';
  pin_list: any = [];
  duplicate_pin: boolean = false;
  visibleCreateUser: boolean = false;
  constructor(private datePipe: DatePipe, private auth: AuthPinService,  private translate: TranslateService) {}

  ngOnInit(): void {
    this.getUsers();
    this.role_list.push(
      {
        id_rol: '1',
        name: 'super user',
      },
      {
        id_rol: '2',
        name: 'leader',
      },
      {
        id_rol: '3',
        name: 'employee',
      }
    );
    this.UsuarioForm = new FormGroup({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      status: new FormControl(true),
      pin: new FormControl('', [Validators.required]),
      id_role: new FormControl('', [Validators.required]),
      register_date: new FormControl(
        this.datePipe.transform(
          this.Date.setDate(this.Date.getDate()),
          'yyyy-MM-dd'
        )
      ),
    });
  }


  

  getRoleUser(idRol: any) {
    return this.role_list.find((role: any) => role.id_rol == idRol).name;
  }

  showCreateUser() {
    this.UsuarioForm.get('first_name')?.setValue('');
    this.UsuarioForm.get('last_name')?.setValue('');
    this.UsuarioForm.get('pin')?.setValue('');
    this.UsuarioForm.get('id_role')?.setValue('');
     this.titleDialog = this.translate.instant('users.dialog.create');
    this.visibleCreateUser = true;
  }

  getUsers() {
    this.auth.getUsers().then((resp: any) => {
      this.users = resp;
      this.usersBack=resp
      this.pin_list = this.users.map((user: any) => user.pin);
    });
  }
  filterByRol(){
    console.log('idRol',this.idRol)
    this.users=this.usersBack.filter((user:any)=>user.id_role==this.idRol)
  }
  verifyPin() {
    this.duplicate_pin =
      this.pin_list.filter(
        (pin: any) => pin == this.UsuarioForm.get('pin')?.value
      ).length > 0
        ? true
        : false;
  }
  saveUser() {
    this.auth.saveUser(this.UsuarioForm.value).then((resp: any) => {
      this.UsuarioForm.get('first_name')?.setValue('');
      this.UsuarioForm.get('last_name')?.setValue('');
      this.UsuarioForm.get('pin')?.setValue('');
    });
  }

  changePin() {
    this.showPin = !this.showPin;
  }

  updateStatusUser(user: any) {
    user.status = !user.status;
    this.auth.updateStatusUser(user.id, user.status);
  }

  editUser(user: any) {
    this.titleDialog = this.translate.instant('users.dialog.edit');
    
    this.UsuarioForm = new FormGroup({
      first_name: new FormControl(user.first_name, [Validators.required]),
      last_name: new FormControl(user.last_name, [Validators.required]),
      status: new FormControl(user.status),
      pin: new FormControl(user.pin, [Validators.required]),
      id_role: new FormControl(user.id_role, [Validators.required]),
      register_date: new FormControl(user.register_date),
      id: new FormControl(user.id),
    });
    this.editingUser = true;
    this.visibleCreateUser = true;
  }

  updateUser() {
    this.auth.updateUser(this.UsuarioForm.value).then((resp) => {
      let userEdit = this.UsuarioForm.value;
      const index = this.users.findIndex(
        (user: any) => user.id === userEdit.id
      );
      if (index !== -1) {
        this.users[index].first_name = userEdit.first_name;
        this.users[index].last_name = userEdit.last_name;
        this.users[index].pin = userEdit.pin;
        this.users[index].id_role = userEdit.id_role;
      }
    });
  }
}
