import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'tooltrack_is_admin';
const ADMIN_PIN = '1234'; // Demo: cámbialo luego por hash o backend

@Injectable({ providedIn: 'root' })
export class AuthPinService {
  isLoggedIn = signal<boolean>(localStorage.getItem(STORAGE_KEY) === '1');

  login(pin: string) {
    if (pin === ADMIN_PIN) {
      localStorage.setItem(STORAGE_KEY, '1');
      this.isLoggedIn.set(true);
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem(STORAGE_KEY);
    this.isLoggedIn.set(false);
  }

  check() {
    return this.isLoggedIn();
  }
}

