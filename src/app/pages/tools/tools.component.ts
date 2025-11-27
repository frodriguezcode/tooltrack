import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { AuthPinService } from '../../core/auth-pin.service';
import { CheckboxModule } from 'primeng/checkbox';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { trigger, state, style, transition, animate } from '@angular/animations';
import {
  faToggleOn,
  faToggleOff,
  faPlus,
  faEdit,
  faToolbox,
  faChevronDown,
  faChevronUp,
  faWrench,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-tools',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    Dialog,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    AppHeaderComponent,
    FontAwesomeModule,
    TranslateModule,
    TooltipModule
  ],
  templateUrl: './tools.component.html',
  styleUrl: './tools.component.scss',
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '0',
        opacity: '0',
        overflow: 'hidden',
        padding: '0 1rem'
      })),
      state('expanded', style({
        height: '*',
        opacity: '1',
        overflow: 'hidden',
        padding: '1rem'
      })),
      transition('collapsed <=> expanded', [
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)')
      ])
    ])
  ]
})
export class ToolsComponent implements OnInit {
  constructor(private authS: AuthPinService) {}

  // Font Awesome Icons
  faToggleOn = faToggleOn;
  faToggleOff = faToggleOff;
  faPlus = faPlus;
  faEdit = faEdit;
  faToolbox = faToolbox;
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;
  faWrench = faWrench;

  // Form Controls
  id_tool: FormControl = new FormControl('');
  name_tool: FormControl = new FormControl('');
  code: FormControl = new FormControl('');
  status: FormControl = new FormControl(true);
  total_quantity: FormControl = new FormControl(0);

  // Component State
  tools: any = [];
  editingTool = false;
  visibleCreateTool: boolean = false;
  expandedIndex: number | null = null;

  ngOnInit(): void {
    this.getTools();
  }

  getTools() {
    this.authS.getTools().then(resp => {
      this.tools = resp;
    });
  }

  toggleExpand(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  createTool() {
    this.editingTool = false;
    this.name_tool.setValue('');
    this.code.setValue('');
    this.total_quantity.setValue(0);
    this.visibleCreateTool = true;
  }

  editTool(tool: any) {
    console.log('tool', tool);
    this.name_tool.setValue(tool.name);
    this.code.setValue(tool.code);
    this.total_quantity.setValue(tool.total_quantity);
    this.id_tool.setValue(tool.id);
    this.editingTool = true;
    this.visibleCreateTool = true;
  }

  saveTool() {
    let _tool = {
      "name": this.name_tool.value,
      "total_quantity": Number(this.total_quantity.value),
      "code": this.code.value,
      "status": this.status.value,
      "ids_buildings": []
    };
    this.authS.saveTool(_tool).then(resp => {
      this.name_tool.setValue('');
      this.total_quantity.setValue('');
      this.code.setValue('');
      this.tools.push(_tool);
    });
  }

  updateStatusTool(tool: any) {
    tool.status = !tool.status;
    this.authS.updateStatusTool(tool);
  }

  updateTool() {
    let _tool = {
      "name": this.name_tool.value,
      "total_quantity": Number(this.total_quantity.value),
      "code": this.code.value,
      "id": this.id_tool.value,
    };
    this.authS.updateTool(_tool).then(resp => {
      const index = this.tools.findIndex((user: any) => user.id === _tool.id);
      if (index !== -1) {
        this.tools[index].name = this.name_tool.value;
        this.tools[index].total_quantity = this.total_quantity.value;
        this.tools[index].code = this.code.value;
      }
      this.visibleCreateTool = false;
    });
  }
}