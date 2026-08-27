'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const ADMIN_COOKIE_NAME = 'skillready_admin_session';

export async function checkIsAdmin(): Promise<boolean> {
  const cookieStore = cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME);
  return session?.value === 'admin_authenticated_session';
}

export async function loginAdmin(password: string) {
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    return { success: false, error: 'ADMIN_PASSWORD environment variable is not configured' };
  }

  if (password === expectedPassword) {
    const cookieStore = cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, 'admin_authenticated_session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    revalidatePath('/');
    return { success: true };
  }

  return { success: false, error: 'Invalid admin password' };
}

export async function logoutAdmin() {
  const cookieStore = cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  revalidatePath('/');
  return { success: true };
}
