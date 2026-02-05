'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X } from 'lucide-react'

interface AddDataModalProps {
  isOpen: boolean
  onClose: () => void
  onAddData: (data: any) => void
}

const categories = ['Electronics', 'Hardware', 'Software', 'Construction Materials', 'Office Supplies', 'Other']
const paymentTerms = ['30 days', '60 days', '90 days', 'COD', 'Pre-payment']

export function AddDataModal({ isOpen, onClose, onAddData }: AddDataModalProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    poNumber: '',
    company: '',
    category: '',
    item: '',
    quantityRequested: '',
    suppliersPrice: '',
    namUnitPrice: '',
    dateDelivered: '',
    paymentTerm: '',
    siNumber: '',
    remarks: '',
    supplier: '',
    address: '',
    tin: '',
    salesInvoiceNo: '',
    contactPerson: '',
  })

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Calculate derived fields
    const qty = parseFloat(formData.quantityRequested as string) || 0
    const supplierPrice = parseFloat(formData.suppliersPrice as string) || 0
    const namPrice = parseFloat(formData.namUnitPrice as string) || 0

    const totalActualAmount = qty * supplierPrice
    const totalNamAmount = qty * namPrice
    const income = totalNamAmount - totalActualAmount
    const incomePercent = totalActualAmount > 0 ? (income / totalActualAmount) * 100 : 0

    const newData = {
      id: Date.now().toString(),
      sn: 0,
      ...formData,
      quantityRequested: qty,
      suppliersPrice: supplierPrice,
      namUnitPrice: namPrice,
      totalActualAmount,
      totalNamAmount,
      totalNamAmountSubtotal: totalNamAmount,
      income,
      incomePercent,
      dueDate: formData.paymentTerm ? new Date(new Date(formData.date).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : '',
    }

    onAddData(newData)

    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      poNumber: '',
      company: '',
      category: '',
      item: '',
      quantityRequested: '',
      suppliersPrice: '',
      namUnitPrice: '',
      dateDelivered: '',
      paymentTerm: '',
      siNumber: '',
      remarks: '',
      supplier: '',
      address: '',
      tin: '',
      salesInvoiceNo: '',
      contactPerson: '',
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle>Add Inventory Entry</CardTitle>
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">PO Number</label>
                <Input
                  value={formData.poNumber}
                  onChange={(e) => handleChange('poNumber', e.target.value)}
                  placeholder="PO-2024-001"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company</label>
                <Input
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  placeholder="Company Name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Select value={formData.category} onValueChange={(v) => handleChange('category', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Item</label>
                <Input
                  value={formData.item}
                  onChange={(e) => handleChange('item', e.target.value)}
                  placeholder="Item description"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <Input
                  type="number"
                  value={formData.quantityRequested}
                  onChange={(e) => handleChange('quantityRequested', e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Supplier's Price</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.suppliersPrice}
                  onChange={(e) => handleChange('suppliersPrice', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">NAM Unit Price</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.namUnitPrice}
                  onChange={(e) => handleChange('namUnitPrice', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Supplier</label>
                <Input
                  value={formData.supplier}
                  onChange={(e) => handleChange('supplier', e.target.value)}
                  placeholder="Supplier name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Person</label>
                <Input
                  value={formData.contactPerson}
                  onChange={(e) => handleChange('contactPerson', e.target.value)}
                  placeholder="Contact name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Payment Term</label>
                <Select value={formData.paymentTerm} onValueChange={(v) => handleChange('paymentTerm', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentTerms.map((term) => (
                      <SelectItem key={term} value={term}>
                        {term}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">SI Number</label>
                <Input
                  value={formData.siNumber}
                  onChange={(e) => handleChange('siNumber', e.target.value)}
                  placeholder="SI-2024-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date Delivered</label>
                <Input
                  type="date"
                  value={formData.dateDelivered}
                  onChange={(e) => handleChange('dateDelivered', e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Remarks</label>
                <Input
                  value={formData.remarks}
                  onChange={(e) => handleChange('remarks', e.target.value)}
                  placeholder="Add any remarks"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Add Entry
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
