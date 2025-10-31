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

interface DashboardCard {
  titleKey: string;
  icon: string;
  route: string;
  color: string;
  descriptionKey: string;
}

interface QuickStat {
  labelKey: string;
  value: number;
  icon: string;
  color: string;
  trend?: string;
}

interface Activity {
  actionKey: string;
  user: string;
  time: string;
  icon: string;
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
    TranslateModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userName: string = 'Supervisor';
  
  quickStats: QuickStat[] = [
    {
      labelKey: 'dashboard.stats.toolsOnLoan',
      value: 24,
      icon: 'pi pi-wrench',
      color: '#3B82F6',
      trend: '+5'
    },
    {
      labelKey: 'dashboard.stats.activeEmployees',
      value: 48,
      icon: 'pi pi-users',
      color: '#10B981',
      trend: '+2'
    },
    {
      labelKey: 'dashboard.stats.loansToday',
      value: 12,
      icon: 'pi pi-clock',
      color: '#F59E0B',
      trend: '+8'
    },
    {
      labelKey: 'dashboard.stats.pendingReturns',
      value: 5,
      icon: 'pi pi-exclamation-circle',
      color: '#EF4444',
      trend: '-2'
    }
  ];

  peopleCards: DashboardCard[] = [
    {
      titleKey: 'dashboard.cards.employees.title',
      icon: 'pi pi-users',
      route: '/employees',
      color: '#3B82F6',
      descriptionKey: 'dashboard.cards.employees.description'
    },
    {
      titleKey: 'dashboard.cards.leaders.title',
      icon: 'pi pi-star',
      route: '/employees',
      color: '#8B5CF6',
      descriptionKey: 'dashboard.cards.leaders.description'
    },
    {
      titleKey: 'dashboard.cards.supervisors.title',
      icon: 'pi pi-shield',
      route: '/employees',
      color: '#EC4899',
      descriptionKey: 'dashboard.cards.supervisors.description'
    }
  ];

  toolCards: DashboardCard[] = [
    {
      titleKey: 'dashboard.cards.tools.title',
      icon: 'pi pi-wrench',
      route: '/tools',
      color: '#10B981',
      descriptionKey: 'dashboard.cards.tools.description'
    },
    {
      titleKey: 'dashboard.cards.loans.title',
      icon: 'pi pi-arrow-right-arrow-left',
      route: '/loans',
      color: '#F59E0B',
      descriptionKey: 'dashboard.cards.loans.description'
    }
  ];

  locationCards: DashboardCard[] = [
    {
      titleKey: 'dashboard.cards.locations.title',
      icon: 'pi pi-map-marker',
      route: '/locations',
      color: '#06B6D4',
      descriptionKey: 'dashboard.cards.locations.description'
    },
    {
      titleKey: 'dashboard.cards.teams.title',
      icon: 'pi pi-sitemap',
      route: '/teams',
      color: '#84CC16',
      descriptionKey: 'dashboard.cards.teams.description'
    }
  ];

  recentActivities: Activity[] = [
    {
      actionKey: 'dashboard.activities.loanOf',
      user: 'Juan Pérez - Martillo #045',
      time: 'Hace 5 min',
      icon: 'pi pi-arrow-right',
      color: '#10B981'
    },
    {
      actionKey: 'dashboard.activities.returnOf',
      user: 'María López - Taladro #023',
      time: 'Hace 15 min',
      icon: 'pi pi-arrow-left',
      color: '#3B82F6'
    },
    {
      actionKey: 'dashboard.activities.newEmployee',
      user: 'Carlos Ruiz',
      time: 'Hace 1 hora',
      icon: 'pi pi-user-plus',
      color: '#8B5CF6'
    },
    {
      actionKey: 'dashboard.activities.alert',
      user: 'Sistema',
      time: 'Hace 2 horas',
      icon: 'pi pi-exclamation-triangle',
      color: '#EF4444'
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