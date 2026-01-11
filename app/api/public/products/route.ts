import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET paginated products for public display
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '8');
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');

    const skip = (page - 1) * limit;

    const where: {
      featured?: boolean;
      category?: string;
      inStock?: boolean;
    } = {
      inStock: true,
    };

    if (featured === 'true') {
      where.featured = true;
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: {
            select: {
              id: true,
              mimeType: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching public products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
