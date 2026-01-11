import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateSession } from '@/lib/auth';

// GET all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
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
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST create new product
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
    
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const material = formData.get('material') as string;
    const inStock = formData.get('inStock') === 'true';
    const featured = formData.get('featured') === 'true';
    const images = formData.getAll('images') as File[];

    if (!name || !category || !description || !price || !material) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Create product first
    const product = await prisma.product.create({
      data: {
        name,
        category,
        description,
        price,
        material,
        inStock,
        featured,
      },
    });

    // Process and save images
    for (const image of images) {
      if (image && image.size > 0) {
        const buffer = Buffer.from(await image.arrayBuffer());
        await prisma.image.create({
          data: {
            data: buffer,
            mimeType: image.type,
            productId: product.id,
          },
        });
      }
    }

    const productWithImages = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        images: {
          select: {
            id: true,
            mimeType: true,
          },
        },
      },
    });

    return NextResponse.json(productWithImages, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
