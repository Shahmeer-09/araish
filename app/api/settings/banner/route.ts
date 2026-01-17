import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET banner image binary data
export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { key: 'main' },
    });

    if (!settings?.bannerImage || !settings?.bannerMimeType) {
      return NextResponse.json(
        { error: 'Banner image not found' },
        { status: 404 }
      );
    }

    return new NextResponse(Buffer.from(settings.bannerImage), {
      headers: {
        'Content-Type': settings.bannerMimeType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error fetching banner image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch banner image' },
      { status: 500 }
    );
  }
}
