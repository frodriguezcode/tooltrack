import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LangService } from '../../core/lang.service';

// Shared Components
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
// Font Awesome
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faTools,
  faHardHat,
  faClock,
  faExclamationTriangle,
  faUserTie,
  faUserShield,
  faUserCheck,
  faToolbox,
  faExchangeAlt,
  faMapMarkedAlt,
  faUsersCog,
  faHandHolding,
  faUndo,
  faUserPlus,
  faBell,
  faPlusCircle,
  faCheckCircle,
  faUsers,
  faHistory,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { AuthPinService } from '../../core/auth-pin.service';
import { LoansComponent } from '../loans/loans.component';
import { DetailLoanComponent } from '../detail-loan/detail-loan.component';
import { TableModule } from 'primeng/table';
interface DashboardCard {
  titleKey: string;
  icon: any;
  route: string;
  color: string;
  descriptionKey: string;
}

interface QuickStat {
  labelKey: string;
  value: number;
  icon: any;
  color: string;
  trend?: string;
}

interface Activity {
  id: string;
  actionKey: string;
  user: string;
  time: string;
  icon: any;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    RippleModule,
    TranslateModule,
    FontAwesomeModule,
    AppHeaderComponent,
    DialogModule,
    LoansComponent,
    DetailLoanComponent,
    TableModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  // ✅ Control de botones flotantes
  showFloatingButtons: boolean = false;
 visibleCreateLoan: boolean = false;
 visibleDetailLoan: boolean = false;
  // Iconos Font Awesome
  faUsers = faUsers;
  faTools = faTools;
  faMapMarkedAlt = faMapMarkedAlt;
  faHistory = faHistory;
  faPlusCircle = faPlusCircle;
  faCheckCircle = faCheckCircle;
  faChevronRight = faChevronRight;
  idLoan:string=''
  quickStats: QuickStat[] = [
    {
      labelKey: 'dashboard.stats.toolsOnLoan',
      value: 24,
      icon: faTools,
      color: '#718096',
      trend: '+5'
    },
    {
      labelKey: 'dashboard.stats.activeEmployees',
      value: 48,
      icon: faHardHat,
      color: '#718096',
      trend: '+2'
    },
    {
      labelKey: 'dashboard.stats.loansToday',
      value: 12,
      icon: faClock,
      color: '#718096',
      trend: '+8'
    },
    {
      labelKey: 'dashboard.stats.pendingReturns',
      value: 5,
      icon: faExclamationTriangle,
      color: '#718096',
      trend: '-2'
    }
  ];

  peopleCards: DashboardCard[] = [
    {
      titleKey: 'dashboard.cards.employees.title',
      icon: faUserTie,
      route: '/employees',
      color: '#718096',
      descriptionKey: 'dashboard.cards.employees.description'
    },
    {
      titleKey: 'dashboard.cards.users.title',
      icon: faUserTie,
      route: '/users',
      color: '#718096',
      descriptionKey: 'dashboard.cards.users.description'
    },
    {
      titleKey: 'dashboard.cards.leaders.title',
      icon: faUserShield,
      route: '/employees',
      color: '#718096',
      descriptionKey: 'dashboard.cards.leaders.description'
    },
    {
      titleKey: 'dashboard.cards.supervisors.title',
      icon: faUserCheck,
      route: '/employees',
      color: '#718096',
      descriptionKey: 'dashboard.cards.supervisors.description'
    }
  ];

  toolCards: DashboardCard[] = [
    {
      titleKey: 'dashboard.cards.tools.title',
      icon: faToolbox,
      route: '/tools',
      color: '#718096',
      descriptionKey: 'dashboard.cards.tools.description'
    },
    {
      titleKey: 'dashboard.cards.loans.title',
      icon: faExchangeAlt,
      route: '/loans',
      color: '#718096',
      descriptionKey: 'dashboard.cards.loans.description'
    }
  ];

  locationCards: DashboardCard[] = [
    {
      titleKey: 'dashboard.cards.locations.title',
      icon: faMapMarkedAlt,
      route: '/locations',
      color: '#718096',
      descriptionKey: 'dashboard.cards.locations.description'
    },
    {
      titleKey: 'dashboard.cards.teams.title',
      icon: faUsersCog,
      route: '/teams',
      color: '#718096',
      descriptionKey: 'dashboard.cards.teams.description'
    }
  ];

  recentActivities: Activity[] = [


  ];

  constructor(
    private router: Router,
    private AuthS:AuthPinService,
    public langService: LangService,
    private library: FaIconLibrary
  ) {
    // Pre-cargar todos los iconos
    this.library.addIcons(
      faTools,
      faHardHat,
      faClock,
      faExclamationTriangle,
      faUserTie,
      faUserShield,
      faUserCheck,
      faToolbox,
      faExchangeAlt,
      faMapMarkedAlt,
      faUsersCog,
      faHandHolding,
      faUndo,
      faUserPlus,
      faBell,
      faPlusCircle,
      faCheckCircle,
      faUsers,
      faHistory,
      faChevronRight
    );
  }

  ngOnInit(): void {
    this.langService.init();
    this.loadDashboardData();
    this.getLoans()
  }

   showCreateLoan() {
    this.visibleCreateLoan = true;
    } 
receiveNewItem(event:any){
  console.log('event',event)
  this.visibleDetailLoan=event
}
getLoans(){
  this.AuthS.getLoans().then((resp:any)=>{
    console.log('resp',resp)
    resp.forEach((element:any) => {
      this.recentActivities.push(   
    {
      id: element.id,
      actionKey: 'dashboard.activities.loanOf',
      user: element.employee.full_name,
      time: element.date + ' ' +element.hour ,
      icon: faHandHolding,
      color: '#718096'
    },
    )
      
    });

  })
}  

@HostListener('window:scroll', ['$event'])
onWindowScroll() {
  // Solo mostrar en móvil/tablet (pantallas <= 768px)
  const isMobile = window.innerWidth <= 768;
  
  if (!isMobile) {
    this.showFloatingButtons = false;
    return;
  }
  
  const scrollPosition = window.pageYOffset + window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const nearBottom = documentHeight - scrollPosition < 200;
  
  this.showFloatingButtons = !nearBottom;
}

@HostListener('window:resize', ['$event'])
onResize() {
  const isMobile = window.innerWidth <= 768;
  if (!isMobile) {
    this.showFloatingButtons = false;
  }
}
  loadDashboardData(): void {
    console.log('Loading dashboard data...');
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}