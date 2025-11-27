import { Component, OnInit } from '@angular/core';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { AuthPinService } from '../../core/auth-pin.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Dialog } from 'primeng/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faToggleOn,
  faToggleOff,
  faUserPlus,
  faEdit,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-employees',
  imports: [
    CommonModule,
    AppHeaderComponent,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    TranslateModule,
    Dialog,
    TooltipModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgIf
  ],
  providers: [DatePipe],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent implements OnInit {
  constructor(
    private authS: AuthPinService,
    private datePipe: DatePipe,
    private translate: TranslateService
  ) {}

  // Font Awesome Icons
  faToggleOn = faToggleOn;
  faToggleOff = faToggleOff;
  faUserPlus = faUserPlus;
  faEdit = faEdit;
  faUsers = faUsers;

  // Form
  EmployeeForm!: FormGroup;
  Date: any = new Date();

  // Data
  locations: any = [];
  buildings: any = [];
  jobs_titles: any = [];
  users: any = [];
  leaders: any = [];
  employees: any = [];

  // State
  titleDialog: string = '';
  editingUser = false;
  id_employee: string = '';
  visibleCreateEmployee: boolean = false;

  ngOnInit(): void {
    this.getCatalogs();
    this.EmployeeForm = new FormGroup({
      full_name: new FormControl('', [Validators.required]),
      status: new FormControl(true),
      id_job_title: new FormControl('', [Validators.required]),
      id_buiding: new FormControl('', [Validators.required]),
      phone_number: new FormControl(''),
      id_leader: new FormControl('', [Validators.required]),
      register_date: new FormControl(
        this.datePipe.transform(
          this.Date.setDate(this.Date.getDate()),
          'yyyy-MM-dd'
        )
      ),
    });
  }

  getCatalogs() {
    this.authS.getCatalogs().subscribe(resp => {
      this.locations = resp[0];
      this.jobs_titles = resp[1];
      this.leaders = resp[2].filter((user: any) => user.id_role == 2 || user.id_role == 1);
      this.employees = resp[3];
      this.buildings = resp[4];
      console.log('buildings', this.buildings);
    });
  }

  getNameLocation(idLocation: any) {
    return this.locations.find((loc: any) => loc.id == idLocation)?.location_name || '';
  }

  getNameBuliding(idbuilding: any) {
    return this.buildings.find((loc: any) => loc.id == idbuilding)?.Description || '';
  }

  getNameJobTitle(idJob: any) {
    return this.jobs_titles.find((job: any) => job.id == idJob)?.description || '';
  }

  getNameLeader(iduser: any) {
    return this.leaders.find((leader: any) => leader.id == iduser)?.first_name || '';
  }

  showCreateEmployee() {
    this.editingUser = false;
    this.EmployeeForm.get('full_name')?.setValue('');
    this.EmployeeForm.get('id_job_title')?.setValue('');
    this.EmployeeForm.get('id_buiding')?.setValue('');
    this.EmployeeForm.get('id_leader')?.setValue('');
    this.EmployeeForm.get('phone_number')?.setValue('');
    this.visibleCreateEmployee = true;
  }

  saveEmployee() {
    this.authS.saveEmployee(this.EmployeeForm.value).then(resp => {
      this.employees.push(this.EmployeeForm.value);
      this.EmployeeForm.get('full_name')?.setValue('');
      this.EmployeeForm.get('id_job_title')?.setValue('');
      this.EmployeeForm.get('id_buiding')?.setValue('');
      this.EmployeeForm.get('id_leader')?.setValue('');
      this.EmployeeForm.get('phone_number')?.setValue('');
    });
  }

  updateEmployee(employee: any) {
    this.editingUser = true;
    this.visibleCreateEmployee = true;
  }

  editEmployee(employee: any) {
    this.EmployeeForm = new FormGroup({
      full_name: new FormControl(employee.full_name, [Validators.required]),
      id_job_title: new FormControl(employee.id_job_title, [Validators.required]),
      id_buiding: new FormControl(employee.id_buiding, [Validators.required]),
      phone_number: new FormControl(employee.phone_number),
      id_leader: new FormControl(employee.id_leader, [Validators.required]),
      id: new FormControl(employee.id, [Validators.required]),
    });
    this.editingUser = true;
    this.visibleCreateEmployee = true;
  }

  saveChangesEmployee() {
    this.authS.updateEmployee(this.EmployeeForm.value).then(resp => {
      let employeeEdit = this.EmployeeForm.value;
      const index = this.employees.findIndex(
        (employee: any) => employee.id === employeeEdit.id
      );
      if (index !== -1) {
        this.employees[index].full_name = employeeEdit.full_name;
        this.employees[index].id_job_title = employeeEdit.id_job_title;
        this.employees[index].id_leader = employeeEdit.id_leader;
        this.employees[index].id_buiding = employeeEdit.id_buiding;
        this.employees[index].phone_number = employeeEdit.phone_number;
      }
    });
  }

  updateStatusEmployee(employee: any) {
    employee.status = !employee.status;
    this.authS.updateStatusEmployee(employee);
  }
}