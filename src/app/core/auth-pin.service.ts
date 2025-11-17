import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, combineLatest, forkJoin, map, Observable } from 'rxjs';
import { Firestore, collection, addDoc, getDocs, collectionData } from '@angular/fire/firestore';
import { CollectionReference, doc, query, updateDoc, where, writeBatch } from 'firebase/firestore';

const STORAGE_KEY = 'tooltrack_is_admin';
const USER_STORAGE_KEY = 'userToolTrackApp';
const ADMIN_PIN = '1234';

@Injectable({
  providedIn: 'root'
})
export class AuthPinService {
  private firestore: Firestore = inject(Firestore);
  isLoggedIn = signal<boolean>(localStorage.getItem(STORAGE_KEY) === '1');
  private currentUserSubject = new BehaviorSubject<any>(this.loadUserFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const savedUser = this.loadUserFromStorage();
    if (savedUser) this.currentUserSubject.next(savedUser);
  }


getCatalogs() {
  const locationsRef = collection(this.firestore, 'locations');
  const jobsRef = collection(this.firestore, 'job_titles');
  const usersRef = collection(this.firestore, 'users_app');
  const employeesRef = collection(this.firestore, 'employees');
  const buildingsRef = collection(this.firestore, 'buildings');

  return forkJoin([
    getDocs(locationsRef),
    getDocs(jobsRef),
    getDocs(usersRef),
    getDocs(employeesRef),
    getDocs(buildingsRef)
  ]).pipe(
    map(([locSnap, jobSnap, userSnap, empSnap,bulidngSnap]) => {
      return [
        locSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        jobSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        userSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        empSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        bulidngSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      ];
    })
  );
}


getCatalogsForLoans() {
  const employeesRef = collection(this.firestore, 'employees');
  const toolsRef = collection(this.firestore, 'tools');
  return forkJoin([
    getDocs(employeesRef),
    getDocs(toolsRef)
  ]).pipe(
    map(([employeeSnap, toolSnap]) => {
      return [
        employeeSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        toolSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),

      ];
    })
  );
}


  private loadUserFromStorage(): any {
    const userJson = localStorage.getItem(USER_STORAGE_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch {
        return null;
      }
    }
    return null;
  }

  private saveUserToStorage(user: any): void {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  getCurrentUserName(): string {
    const user = this.currentUserSubject.value;
    if (!user) return 'Usuario';

    const first =
      user.firstName ||
      user.first_name ||
      user.nombre ||
      user.name ||
      '';

    const last =
      user.lastName ||
      user.last_name ||
      user.apellido ||
      '';

    const full = `${first} ${last}`.trim();
    return full || (user.email ? user.email.split('@')[0] : 'Usuario');
  }

  async loginWithPin(pin: string): Promise<boolean> {
    try {
      const user = await this.getUserByPin(pin);
      if (user) {
        const isActive = user.status === undefined || user.status === true || user.activo === true;
        if (isActive) {
          localStorage.setItem(STORAGE_KEY, '1');
          this.saveUserToStorage(user);
          this.isLoggedIn.set(true);
          setTimeout(() => this.currentUserSubject.next(user), 0);
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  }

  login(pin: string): boolean {
    if (pin === ADMIN_PIN) {
      const adminUser = { id: 'admin', name: 'Administrador', pin: ADMIN_PIN, role: 'admin' };
      localStorage.setItem(STORAGE_KEY, '1');
      this.saveUserToStorage(adminUser);
      this.isLoggedIn.set(true);
      setTimeout(() => this.currentUserSubject.next(adminUser), 0);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    this.isLoggedIn.set(false);
    this.currentUserSubject.next(null);
  }

  check(): boolean {
    return this.isLoggedIn();
  }

  async saveUser(user: any) {
    try {
      const docRef = await addDoc(collection(this.firestore, 'users_app'), user);
      return { id: docRef.id, ...user };
    } catch (error) {
      throw error;
    }
  }

  async getUsers() {
    try {
      const coleccionRef = collection(this.firestore, 'users_app');
      const snapshot = await getDocs(coleccionRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
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
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async updateStatusUser(id: string, status: boolean) {
    const docRef = doc(this.firestore, 'users_app', id);
    await updateDoc(docRef, { status });
  }

  async updateUser(user: any) {
    try {
      const docRef = doc(this.firestore, 'users_app', user.id);
      await updateDoc(docRef, user);
      return { id: user.id, ...user };
    } catch (error) {
      throw error;
    }
  }

  async getTools() {
    try {
      const coleccionRef = collection(this.firestore, 'tools');
      const snapshot = await getDocs(coleccionRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw error;
    }
  }

  async saveTool(tool: any) {
    try {
      const docRef = await addDoc(collection(this.firestore, 'tools'), tool);
      return { id: docRef.id, ...tool };
    } catch (error) {
      throw error;
    }
  }

  async updateTool(tool: any) {
    try {
      const docRef = doc(this.firestore, 'tools', tool.id);
      await updateDoc(docRef, tool);
      return { id: tool.id, ...tool };
    } catch (error) {
      throw error;
    }
  }

  async updateStatusTool(tool: any) {
    try {
      const docRef = doc(this.firestore, 'tools', tool.id);
      await updateDoc(docRef, tool);
      return { id: tool.id, ...tool };
    } catch (error) {
      throw error;
    }
  }

  //Employees

  async saveEmployee(employee: any) {
    try {
      const docRef = await addDoc(collection(this.firestore, 'employees'), employee);
      return { id: docRef.id, ...employee };
    } catch (error) {
      throw error;
  }

  }
  async updateEmployee(employee: any) {
    try {
      const docRef = doc(this.firestore, 'employees', employee.id);
      await updateDoc(docRef, employee);
      return { id: employee.id, ...employee };
    } catch (error) {
      throw error;
    }
  }
  async updateStatusEmployee(employee: any) {
    try {
      const docRef = doc(this.firestore, 'employees', employee.id);
      await updateDoc(docRef, employee);
      return { id: employee.id, ...employee };
    } catch (error) {
      throw error;
    }
  }

  //loan

async getLoans(): Promise<any[]> {
  try {
    const coleccionRef = collection(this.firestore, 'loans');
    const q = query(coleccionRef, where('delivered_all', '==', false));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      // Mapear TODOS los documentos
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }
    
    return []; // Retornar array vacío si no hay documentos
  } catch (error) {
    throw error;
  }
}

async getLoanById(id:string): Promise<any[]> {
  try {
    const coleccionRef = collection(this.firestore, 'loans');
    const q = query(coleccionRef, where('id', '==', id));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      // Mapear TODOS los documentos
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }
    
    return []; // Retornar array vacío si no hay documentos
  } catch (error) {
    throw error;
  }
}

async createLoan(loan: any) {
  try {
    // 1. Crear el préstamo
    const docRef = await addDoc(collection(this.firestore, 'loans'), loan);
    
    // 2. Actualizar las herramientas en lote
    if (loan.tools && loan.tools.length > 0) {
      await this.updateToolsQuantity(loan.tools);
    }
    
    return { id: docRef.id, ...loan };
  } catch (error) {
    throw error;
  }
}

async updateLoan(loan: any) {
    try {
      const docRef = doc(this.firestore, 'loans', loan.id);
      if (loan.tools && loan.tools.length > 0) {
      await this.updateToolsQuantity(loan.tools);
      }
      await updateDoc(docRef, loan);
      return { id: loan.id, ...loan };
    } catch (error) {
      throw error;
    }
}

async updateToolsQuantity(tools: any[]) {
  try {
    const batch = writeBatch(this.firestore);
    
    // Iterar sobre cada herramienta
    tools.forEach((tool) => {
      // Referencia al documento en la colección 'tools'
      const toolRef = doc(this.firestore, 'tools', tool.id); // Asume que tool tiene un campo 'id'
      
      // Agregar la operación de actualización al batch
      batch.update(toolRef, {
        total_quantity: tool.total_quantity
      });
    });
    
    // Ejecutar todas las actualizaciones
    await batch.commit();
    console.log('Herramientas actualizadas exitosamente');
  } catch (error) {
    console.error('Error actualizando herramientas:', error);
    throw error;
  }
}

  
}
