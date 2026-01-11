import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateSession } from '@/lib/auth';

// GET single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          select: {
            id: true,
            mimeType: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuthenticated = await validateSession();
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const material = formData.get('material') as string;
    const inStock = formData.get('inStock') === 'true';
    const featured = formData.get('featured') === 'true';
    const images = formData.getAll('images') as File[];
    const deleteImageIds = formData.getAll('deleteImages') as string[];

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete specified images
    if (deleteImageIds.length > 0) {
      await prisma.image.deleteMany({
        where: {
          id: { in: deleteImageIds },
          productId: id,
        },
      });
    }

    // Update product
    const product = await prisma.product.update({
      where: { id },
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

    // Add new images
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

    return NextResponse.json(productWithImages);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuthenticated = await validateSession();
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete product (images will be cascade deleted)
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
