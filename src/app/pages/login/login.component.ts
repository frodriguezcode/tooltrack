import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Translate
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LangService } from '../../core/lang.service';

// Services
import { AuthPinService } from '../../core/auth-pin.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    TranslateModule
  ],
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
    private translate: TranslateService,
    public langService: LangService
  ) {}

  ngOnInit(): void {
    // Inicializar idioma
    this.langService.init();
    
    // Listeners de online/offline
    window.addEventListener('online', this._onOnline);
    window.addEventListener('offline', this._onOffline);
  }

  ngOnDestroy(): void {
    window.removeEventListener('online', this._onOnline);
    window.removeEventListener('offline', this._onOffline);
  }

  signByPin(){

  }

  submit() {
    this.auth.getUserByPin(this.pin).then((resp:any)=>{

      console.log('resp',resp)
      if (resp==null) {
        this.msg.add({
          severity: 'warn',
          summary: this.translate.instant('login.toastMissing.title'),
          detail: this.translate.instant('login.toastMissing.msg')
        });
        return;
      }
  
      this.loading = true;
      const ok = this.auth.login(this.pin);
      this.loading = false;
  
      if (resp) {
      localStorage.setItem('userToolTrackApp', JSON.stringify(resp)); 

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
        });
      }
    })

  }

  useDemo() {
    this.pin = '1234';
    this.msg.add({
      severity: 'info',
      summary: this.translate.instant('login.demo.title'),
      detail: this.translate.instant('login.demo.msg')
    });
  }
}