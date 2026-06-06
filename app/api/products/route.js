import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET: Fetches all medical inventory items from the database
 * URL: http://localhost:3000/api/products
 */
export async function GET() {
  try {
    // 1. Fetch live product configurations from your MySQL instance
    const [rows] = await pool.query(
      'SELECT id, name, category, price, dosage, image_url, description, stock_count FROM products ORDER BY name ASC'
    );

    // 2. Map and parse database string outputs to correct UI datatypes
    const formattedProducts = rows.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      price: parseFloat(product.price),              // Converts decimal string to float number
      dosage: product.dosage,
      image: product.image_url,  // Maps to frontend key with fallback
      description: product.description,
      inStock: parseInt(product.stock_count) > 0      // Dynamically determines stock availability
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error("Database Pharmacy Error:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch medical products from database." }, 
      { status: 500 }
    );
  }
}