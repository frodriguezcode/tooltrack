import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LangService } from '../../../core/lang.service';
import { AuthPinService } from '../../../core/auth-pin.service';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faLanguage, faBell, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    BadgeModule,
    TooltipModule,
    TranslateModule,
    FontAwesomeModule
  ],
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  userFullName = 'Usuario';

  @Input() pageTitle?: string;
  @Input() pageSubtitle?: string;

  faLanguage = faLanguage;
  faBell = faBell;
  faSignOutAlt = faSignOutAlt;

  private userSubscription?: Subscription;

  constructor(
    private router: Router,
    public langService: LangService,
    private authService: AuthPinService,
    private library: FaIconLibrary
  ) {
    this.library.addIcons(faLanguage, faBell, faSignOutAlt);
  }

  ngOnInit(): void {
    this.langService.init();
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.userFullName = this.buildFullName(user);
    });
  }

  private buildFullName(user: any): string {
    if (!user) return 'Usuario';

    const first =
      user.firstName ||
      user.first_name ||
      user.name ||
      user.nombre ||
      '';

    const last =
      user.lastName ||
      user.last_name ||
      user.apellido ||
      '';

    const full = `${first} ${last}`.trim();
    return full || (user.email ? user.email.split('@')[0] : 'Usuario');
  }

  changeLanguage(): void {
    this.langService.toggle();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }
}
