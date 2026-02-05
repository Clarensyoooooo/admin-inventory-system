import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Inventory from '@/models/Inventory';

// GET ALL ITEMS
export async function GET() {
  await connectDB();
  try {
    // Sort by createdAt descending (newest first)
    const items = await Inventory.find({}).sort({ createdAt: -1 });
    
    // Remap _id to id to match your frontend interface
    const formattedItems = items.map(doc => ({
      ...doc.toObject(),
      id: doc._id.toString(),
    }));

    return NextResponse.json(formattedItems);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

// ADD NEW ITEM
export async function POST(req: Request) {
  await connectDB();
  try {
    const body = await req.json();
    
    // Simple validation logic or auto-calculations can go here
    const newItem = await Inventory.create(body);
    
    return NextResponse.json({
      ...newItem.toObject(),
      id: newItem._id.toString()
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}