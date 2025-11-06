import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Firestore, collection, addDoc, getDocs } from '@angular/fire/firestore';
import { doc, getDoc, query, updateDoc, where } from 'firebase/firestore';


const STORAGE_KEY = 'tooltrack_is_admin';
const ADMIN_PIN = '1234'; // Puedes cambiarlo más adelante

@Injectable({
  providedIn: 'root'
})
export class AuthPinService {
  private firestore: Firestore = inject(Firestore);
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
  check() {
    return this.isLoggedIn();
  }
 // Users 
  async saveUser(user: any) {
    try {
      // addDoc genera automáticamente un ID
      const docRef = await addDoc(collection(this.firestore, 'users_app'), user);

      console.log('Documento creado con ID:', docRef.id);

      return {
        id: docRef.id,
        ...user
      };
    } catch (error) {
      console.error('Error al crear documento:', error);
      throw error;
    }
  }

  async getUsers() {
    try {
      const coleccionRef = collection(this.firestore, 'users_app');
      const snapshot = await getDocs(coleccionRef);

      const datos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return datos;
    } catch (error) {
      console.error('Error al obtener documentos:', error);
      throw error;
    }
  }

  async getUserByPin(pin: string): Promise<any | null> {
    try {
      const coleccionRef = collection(this.firestore, 'users_app');
      const q = query(coleccionRef, where('pin', '==', pin));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error al buscar usuario por PIN:', error);
      throw error;
    }
  }


  async updateStatusUser(id: string, status: boolean) {
    const docRef = doc(this.firestore, 'users_app', id);

    await updateDoc(docRef, {
      status: status,

    });
  }

  async updateUser(user: any) {
    try {
      let id = user.id
      const docRef = doc(this.firestore, 'users_app', user.id);
      await updateDoc(docRef, user);

      console.log('Documento actualizado con ID:', user.id);
      return { id, ...user };
    } catch (error) {
      console.error('Error al actualizar:', error);
      throw error;
    }
  }

  // Tools
  async getTools() {
    try {
      const coleccionRef = collection(this.firestore, 'tools');
      const snapshot = await getDocs(coleccionRef);

      const datos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return datos;
    } catch (error) {
      console.error('Error al obtener documentos:', error);
      throw error;
    }
  }

  async saveTool(tool: any) {
    try {
      // addDoc genera automáticamente un ID
      const docRef = await addDoc(collection(this.firestore, 'tools'), tool);

      console.log('Documento creado con ID:', docRef.id);

      return {
        id: docRef.id,
        ...tool
      };
    } catch (error) {
      console.error('Error al crear documento:', error);
      throw error;
  }
  }

  async updateTool(tool: any) {
    try {
      let id = tool.id
      const docRef = doc(this.firestore, 'tools', tool.id);
      await updateDoc(docRef, tool);

      console.log('Documento actualizado con ID:', tool.id);
      return { id, ...tool };
    } catch (error) {
      console.error('Error al actualizar:', error);
      throw error;
    }
  }

  async updateStatusTool(tool: any) {
    try {
      let id = tool.id
      const docRef = doc(this.firestore, 'tools', tool.id);
      await updateDoc(docRef, tool);

      console.log('Documento actualizado con ID:', tool.id);
      return { id, ...tool };
    } catch (error) {
      console.error('Error al actualizar:', error);
      throw error;
    }
  }

}
