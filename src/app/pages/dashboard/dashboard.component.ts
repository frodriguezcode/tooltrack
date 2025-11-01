import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LangService } from '../../core/lang.service';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { MenuModule } from 'primeng/menu';
import { RippleModule } from 'primeng/ripple';
import { TimelineModule } from 'primeng/timeline';
import { TooltipModule } from 'primeng/tooltip';

// Font Awesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
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
  faLanguage,
  faSignOutAlt,
  faPlusCircle,
  faCheckCircle,
  faUsers,
  faHistory,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';

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
    AvatarModule,
    BadgeModule,
    MenuModule,
    RippleModule,
    TimelineModule,
    TooltipModule,
    TranslateModule,
    FontAwesomeModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userName: string = 'Supervisor';

  // Iconos Font Awesome
  faLanguage = faLanguage;
  faBell = faBell;
  faSignOutAlt = faSignOutAlt;
  faUsers = faUsers;
  faTools = faTools;
  faMapMarkedAlt = faMapMarkedAlt;
  faHistory = faHistory;
  faPlusCircle = faPlusCircle;
  faCheckCircle = faCheckCircle;
  faChevronRight = faChevronRight;
  
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
    {
      actionKey: 'dashboard.activities.loanOf',
      user: 'Juan Pérez - Martillo #045',
      time: 'Hace 5 min',
      icon: faHandHolding,
      color: '#718096'
    },
    {
      actionKey: 'dashboard.activities.returnOf',
      user: 'María López - Taladro #023',
      time: 'Hace 15 min',
      icon: faUndo,
      color: '#718096'
    },
    {
      actionKey: 'dashboard.activities.newEmployee',
      user: 'Carlos Ruiz',
      time: 'Hace 1 hora',
      icon: faUserPlus,
      color: '#718096'
    },
    {
      actionKey: 'dashboard.activities.alert',
      user: 'Sistema',
      time: 'Hace 2 horas',
      icon: faBell,
      color: '#718096'
    }
  ];

  constructor(
    private router: Router,
    public langService: LangService
  ) {}

  ngOnInit(): void {
    // Inicializar el idioma
    this.langService.init();
    // Cargar datos del dashboard
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // TODO: Implementar carga de datos desde Firestore
    console.log('Loading dashboard data...');
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    // TODO: Implementar logout completo
    localStorage.removeItem('tooltrack_is_admin');
    this.router.navigate(['/login']);
  }

  changeLanguage(): void {
    this.langService.toggle();
  }
}