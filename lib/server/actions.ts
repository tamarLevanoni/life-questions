// Server Actions — גשר בין קוד לקוח (Zustand stores) לפונקציות שרת.
// קבצי lib/server/* מסומנים server-only ולכן אינם נגישים ישירות מהלקוח;
// קובץ זה חושף אותם כ-RPC דרך גבול 'use server'.
'use server';
import {
  getCurrentUser as _getCurrentUser,
  registerUser as _registerUser,
  updateCurrentUser as _updateCurrentUser,
} from './user';
import { submitContact as _submitContact } from './contact';
import type { UpdateUserBody, RegisterUserBody, ContactFormData } from '@/lib/schemas';

export async function getCurrentUser() {
  return _getCurrentUser();
}

export async function registerUser(body: RegisterUserBody) {
  return _registerUser(body);
}

export async function updateCurrentUser(partial: UpdateUserBody) {
  return _updateCurrentUser(partial);
}

export async function submitContact(body: ContactFormData) {
  return _submitContact(body);
}
