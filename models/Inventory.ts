import mongoose, { Schema } from 'mongoose';

const InventorySchema = new Schema(
  {
    // These match the fields we used in your dashboard
    date: { type: String, required: true },
    sn: { type: Number },
    poNumber: { type: String, required: true },
    company: { type: String },
    category: { type: String },
    item: { type: String, required: true },
    quantityRequested: { type: Number, default: 0 },
    
    // Financials
    suppliersPrice: { type: Number, default: 0 },
    totalActualAmount: { type: Number, default: 0 },
    namUnitPrice: { type: Number, default: 0 },
    totalNamAmount: { type: Number, default: 0 },
    income: { type: Number, default: 0 },
    incomePercent: { type: Number, default: 0 },
    
    // Delivery Info
    dateDelivered: { type: String },
    paymentTerm: { type: String },
    supplier: { type: String },
    remarks: { type: String },
  },
  { timestamps: true }
);

// This prevents "OverwriteModelError" when Next.js reloads
export default mongoose.models.Inventory || mongoose.model('Inventory', InventorySchema);