import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import prisma from './prisma';

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'your-secret-key-change-in-production';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createSession(username: string): Promise<string> {
  const sessionToken = Buffer.from(`${username}:${Date.now()}:${SESSION_SECRET}`).toString('base64');
  return sessionToken;
}

export async function validateSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  
  if (!session?.value) {
    return false;
  }

  try {
    const decoded = Buffer.from(session.value, 'base64').toString('utf-8');
    const [username] = decoded.split(':');
    
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    return !!admin;
  } catch {
    return false;
  }
}

export async function login(username: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return { success: false, error: 'Invalid credentials' };
    }

    const isValid = await verifyPassword(password, admin.password);

    if (!isValid) {
      return { success: false, error: 'Invalid credentials' };
    }

    const sessionToken = await createSession(username);
    const cookieStore = await cookies();
    
    cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'An error occurred during login' };
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function createAdminIfNotExists(): Promise<void> {
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  const existingAdmin = await prisma.admin.findUnique({
    where: { username: adminUsername },
  });

  if (!existingAdmin) {
    const hashedPassword = await hashPassword(adminPassword);
    await prisma.admin.create({
      data: {
        username: adminUsername,
        password: hashedPassword,
      },
    });
    console.log('Admin user created');
  }
}
