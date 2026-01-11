import { NextResponse } from 'next/server';
import { createAdminIfNotExists } from '@/lib/auth';

// This endpoint initializes the admin user if it doesn't exist
// It should be called once during setup
export async function POST() {
  try {
    await createAdminIfNotExists();
    return NextResponse.json({ success: true, message: 'Admin initialization complete' });
  } catch (error) {
    console.error('Admin init error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize admin' },
      { status: 500 }
    );
  }
}
