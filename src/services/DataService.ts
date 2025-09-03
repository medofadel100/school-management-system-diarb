import { ref, get, set, update, remove } from 'firebase/database';
import { database } from '../firebase';

export interface School {
  name: string;
  stage: string;
  principal: string;
  staff: {
    [key: string]: {
      name: string;
      jobTitle: string;
      nationalId: string;
      codeNumber: string;
      whatsapp: string;
      email: string;
      role: string;
    };
  };
}

export interface User {
  name: string;
  email: string;
  schoolName: string;
  role: 'admin' | 'teacher' | 'staff';
  whatsapp: string;
  createdAt: string;
}

export class DataService {
  static async getSchool(schoolName: string) {
    const schoolRef = ref(database, `schools/${schoolName}`);
    const snapshot = await get(schoolRef);
    return snapshot.val() as School | null;
  }

  static async createSchool(schoolName: string, schoolData: School) {
    const schoolRef = ref(database, `schools/${schoolName}`);
    await set(schoolRef, schoolData);
  }

  static async updateSchool(schoolName: string, updates: Partial<School>) {
    const schoolRef = ref(database, `schools/${schoolName}`);
    await update(schoolRef, updates);
  }

  static async getUser(userId: string) {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);
    return snapshot.val() as User | null;
  }

  static async updateUser(userId: string, updates: Partial<User>) {
    const userRef = ref(database, `users/${userId}`);
    await update(userRef, updates);
  }

  static async addStaffMember(schoolName: string, staffData: School['staff'][string]) {
    const staffRef = ref(database, `schools/${schoolName}/staff/${staffData.nationalId}`);
    await set(staffRef, staffData);
  }

  static async removeStaffMember(schoolName: string, nationalId: string) {
    const staffRef = ref(database, `schools/${schoolName}/staff/${nationalId}`);
    await remove(staffRef);
  }

  static async getSystemSettings() {
    const settingsRef = ref(database, 'system/settings');
    const snapshot = await get(settingsRef);
    return snapshot.val();
  }

  static async updateSystemSettings(updates: any) {
    const settingsRef = ref(database, 'system/settings');
    await update(settingsRef, updates);
  }
}
