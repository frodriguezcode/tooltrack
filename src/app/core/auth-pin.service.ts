import { Injectable, signal } from '@angular/core';
import { Firestore, collection, doc, setDoc, collectionData, query, where, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


const STORAGE_KEY = 'tooltrack_is_admin';
const ADMIN_PIN = '1234'; // Puedes cambiarlo más adelante

@Injectable({
  providedIn: 'root'
})
export class AuthPinService {

  constructor(private firestore: Firestore) {}

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
  check() {
    return this.isLoggedIn();
  }

  async saveUser(user: any): Promise<string> {
    const id = doc(collection(this.firestore, 'users_app')).id;
    const ref = doc(this.firestore, `users_app/${id}`);
    await setDoc(ref, { ...user, id });
    return id;
  }

getUsers(): Observable<any[]> {
  return collectionData(
    collection(this.firestore, 'users_app'),
    { idField: 'id' }
  ) as Observable<any[]>;
}




}
