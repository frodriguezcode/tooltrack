import { Injectable, signal } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  query, where, getDocs,
  writeBatch
} from '@angular/fire/firestore';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

const STORAGE_KEY = 'tooltrack_is_admin';
const ADMIN_PIN = '1234'; // Puedes cambiarlo más adelante

@Injectable({
  providedIn: 'root'
})
export class AuthPinService {

  constructor() { }

  // Creamos una señal reactiva para saber si está logueado
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

  // 👇 Esta función es la que falta en tu servicio
  check() {
    return this.isLoggedIn();
  }
}
