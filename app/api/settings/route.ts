import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateSession } from '@/lib/auth';

// GET site settings
export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { key: 'main' },
    });

    if (!settings) {
      return NextResponse.json({
        bannerTitle: 'LUXE',
        bannerSubtitle: 'Exquisite Handcrafted Jewellery',
        shopNameUrdu: '',
        hasBannerImage: false,
      });
    }

    return NextResponse.json({
      bannerTitle: settings.bannerTitle || 'LUXE',
      bannerSubtitle: settings.bannerSubtitle || 'Exquisite Handcrafted Jewellery',
      shopNameUrdu: settings.shopNameUrdu || '',
      hasBannerImage: !!settings.bannerImage,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// POST/PUT update settings
export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await validateSession();
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const bannerTitle = formData.get('bannerTitle') as string;
    const bannerSubtitle = formData.get('bannerSubtitle') as string;
    const shopNameUrdu = formData.get('shopNameUrdu') as string;
    const bannerImage = formData.get('bannerImage') as File | null;
    const removeBanner = formData.get('removeBanner') === 'true';

    const updateData: {
      bannerTitle: string;
      bannerSubtitle: string;
      shopNameUrdu: string;
      bannerImage?: Buffer | null;
      bannerMimeType?: string | null;
    } = {
      bannerTitle: bannerTitle || 'LUXE',
      bannerSubtitle: bannerSubtitle || 'Exquisite Handcrafted Jewellery',
      shopNameUrdu: shopNameUrdu || '',
    };

    if (removeBanner) {
      updateData.bannerImage = null;
      updateData.bannerMimeType = null;
    } else if (bannerImage && bannerImage.size > 0) {
      const buffer = Buffer.from(await bannerImage.arrayBuffer());
      updateData.bannerImage = buffer;
      updateData.bannerMimeType = bannerImage.type;
    }

    const settings = await prisma.siteSettings.upsert({
      where: { key: 'main' },
      update: updateData,
      create: {
        key: 'main',
        ...updateData,
      },
    });

    return NextResponse.json({
      success: true,
      bannerTitle: settings.bannerTitle,
      bannerSubtitle: settings.bannerSubtitle,
      shopNameUrdu: settings.shopNameUrdu,
      hasBannerImage: !!settings.bannerImage,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
