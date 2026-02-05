'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Search, Download, Filter, X, Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { InventoryTable } from './inventory-table'
import { AnalyticsDashboard } from './analytics-dashboard'
import { AddDataModal } from './add-data-modal'
import { getInventoryAnalytics } from '@/lib/mock-inventory' // We keep this helper function
import type { InventoryItem } from '@/lib/mock-inventory' // We keep the type definition
import { useToast } from '@/hooks/use-toast'

export function InventoryDashboard() {
  // Start with empty array, not mock data
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>('All Categories')
  const [selectedMonth, setSelectedMonth] = useState<string | null>('All Months')
  const [selectedYear, setSelectedYear] = useState<string>('2024')
  const [sortBy, setSortBy] = useState('date')

  const { toast } = useToast()

  // 1. FETCH DATA FROM CLOUD DB
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/inventory')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setInventoryData(data)
      } catch (error) {
        console.error(error)
        toast({
          title: "Connection Error",
          description: "Could not load inventory. Check your internet or DB connection.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [toast])

  // 2. ADD DATA TO CLOUD DB
  const handleAddData = async (newData: InventoryItem) => {
    try {
      // Optimistic Update (Optional: remove if you want to wait for server)
      // setInventoryData(prev => [{ ...newData, sn: prev.length + 1 } as InventoryItem, ...prev])

      const payload = {
        ...newData,
        // Ensure numeric fields are numbers
        quantityRequested: Number(newData.quantityRequested),
        suppliersPrice: Number(newData.suppliersPrice),
        totalActualAmount: Number(newData.totalActualAmount),
        namUnitPrice: Number(newData.namUnitPrice),
        totalNamAmount: Number(newData.totalNamAmount),
        income: Number(newData.income),
        incomePercent: Number(newData.incomePercent),
        sn: inventoryData.length + 1 // Simple auto-increment logic
      }

      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to save')

      const savedItem = await res.json()
      
      // Update state with the REAL item from DB (contains _id)
      setInventoryData(prev => [savedItem, ...prev])
      setIsModalOpen(false)
      
      toast({ 
        title: "Success", 
        description: `Added ${newData.item} to inventory.` 
      })
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save item to database.",
        variant: "destructive",
      })
    }
  }

  // 3. FILTERING LOGIC
  const filteredData = useMemo(() => {
    let filtered = inventoryData

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.poNumber.toLowerCase().includes(query) ||
          item.company.toLowerCase().includes(query) ||
          item.item.toLowerCase().includes(query) ||
          item.supplier.toLowerCase().includes(query)
      )
    }

    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }

    if (selectedMonth !== 'All Months') {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date)
        return itemDate.getMonth() + 1 === parseInt(selectedMonth || '0')
      })
    }

    if (selectedYear) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date)
        return itemDate.getFullYear() === parseInt(selectedYear)
      })
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'amount':
          return b.totalNamAmount - a.totalNamAmount
        case 'income':
          return b.income - a.income
        case 'quantity':
          return b.quantityRequested - a.quantityRequested
        default:
          return 0
      }
    })

    return sorted
  }, [inventoryData, searchQuery, selectedCategory, selectedMonth, selectedYear, sortBy])

  // derived state for dropdowns
  const categories = [...new Set(inventoryData.map((item) => item.category))].sort()
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: new Date(2024, i).toLocaleString('default', { month: 'long' }),
  }))

  const analytics = getInventoryAnalytics(filteredData)

  const handleExport = () => {
    // Basic CSV Export
    const headers = ['Date', 'PO Number', 'Item', 'Category', 'Total Amount', 'Income']
    const rows = filteredData.map(item => [
      item.date,
      item.poNumber,
      item.item,
      item.category,
      item.totalNamAmount,
      item.income
    ])
    
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `inventory-export-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
  }

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading inventory from cloud...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AddDataModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddData={handleAddData} />

      {/* KPI CARDS */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">₱{(analytics.totalRevenue / 1000000).toFixed(2)}M</div></CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">₱{(analytics.totalIncome / 1000).toFixed(0)}K</div></CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{analytics.totalItems.toLocaleString()}</div></CardContent>
        </Card>
        <Card className="bg-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Avg Margin</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(filteredData.length > 0 ? filteredData.reduce((sum, item) => sum + item.incomePercent, 0) / filteredData.length : 0).toFixed(2)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="table" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="table">Data Table</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button onClick={() => setIsModalOpen(true)} size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> Add Entry
            </Button>
            <Button onClick={handleExport} variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        <TabsContent value="table" className="space-y-4">
          <Card className="bg-card">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Filter className="h-4 w-4" /> Search & Filters</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search PO, Company, Item..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                </div>
                <div className="grid gap-3 md:grid-cols-4">
                  <Select value={selectedCategory || ''} onValueChange={(v) => setSelectedCategory(v || null)}>
                    <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Categories">All Categories</SelectItem>
                      {categories.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {/* Additional filters for Month/Year/Sort can go here similarly */}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card overflow-hidden">
             <CardContent className="p-0">
               <InventoryTable data={filteredData} />
             </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsDashboard data={filteredData} analytics={analytics} />
        </TabsContent>
      </Tabs>
    </div>
  )
}