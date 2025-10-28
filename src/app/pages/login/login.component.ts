import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthPinService } from '../../core/auth-pin.service';

/* PrimeNG */
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LangService } from '../../core/lang.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, TranslateModule,  CardModule, ButtonModule, InputTextModule, ToastModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  pin = '';
  loading = false;
  online = navigator.onLine;

  private _onOnline = () => (this.online = true);
  private _onOffline = () => (this.online = false);

  constructor(
    private auth: AuthPinService,
    private router: Router,
    private msg: MessageService,
    public translate: TranslateService,
    public lang: LangService
  ) {}

  ngOnInit(): void {
    window.addEventListener('online', this._onOnline);
    window.addEventListener('offline', this._onOffline);
  }

  ngOnDestroy(): void {
    window.removeEventListener('online', this._onOnline);
    window.removeEventListener('offline', this._onOffline);
  }

  submit() {
    if (!this.pin) {
      this.msg.add({ severity: 'warn', summary: this.translate.instant('login.toastMissing.title'), detail: this.translate.instant('login.toastMissing.msg') });
      return;
    }
    this.loading = true;
    const ok = this.auth.login(this.pin);
    this.loading = false;

    if (ok) {
       this.msg.add({
          severity: 'success',
          summary: this.translate.instant('login.toastOk.title'),
          detail: this.translate.instant('login.toastOk.msg')
        });
      this.router.navigateByUrl('/dashboard');
    } else {
        this.msg.add({
          severity: 'error',
          summary: this.translate.instant('login.toastBad.title'),
          detail: this.translate.instant('login.toastBad.msg')
      
    })
  }
  }

    useDemo() {
    this.pin = '1234';
    this.msg.add({
      severity: 'info',
      summary: this.translate.instant('login.demo.title'),
      detail: this.translate.instant('login.demo.msg')
    });
  }

    toggleLang() {
    this.lang.use(this.lang.current() === 'es' ? 'en' : 'es');
  }
}
