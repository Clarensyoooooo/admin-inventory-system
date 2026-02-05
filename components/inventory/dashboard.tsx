'use client'

import React, { useState, useMemo } from 'react'
import { Search, Download, Filter, X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { InventoryTable } from './inventory-table'
import { AnalyticsDashboard } from './analytics-dashboard'
import { AddDataModal } from './add-data-modal'
import { mockInventoryData, getInventoryAnalytics } from '@/lib/mock-inventory'
import type { InventoryItem } from '@/lib/mock-inventory'

export function InventoryDashboard() {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>(mockInventoryData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>('All Categories')
  const [selectedMonth, setSelectedMonth] = useState<string | null>('All Months')
  const [selectedYear, setSelectedYear] = useState<string>('2024')
  const [sortBy, setSortBy] = useState('date')

  const handleAddData = (newData: InventoryItem) => {
    const maxSn = Math.max(0, ...inventoryData.map(item => item.sn))
    setInventoryData([
      { ...newData, sn: maxSn + 1 } as InventoryItem,
      ...inventoryData,
    ])
    setIsModalOpen(false)
  }

  const filteredData = useMemo(() => {
    let filtered = inventoryData

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.poNumber.toLowerCase().includes(query) ||
          item.company.toLowerCase().includes(query) ||
          item.item.toLowerCase().includes(query) ||
          item.supplier.toLowerCase().includes(query) ||
          item.contactPerson.toLowerCase().includes(query),
      )
    }

    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }

    if (selectedMonth !== 'All Months') {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date)
        return itemDate.getMonth() + 1 === parseInt(selectedMonth)
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

  const categories = [...new Set(inventoryData.map((item) => item.category))].sort()
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: new Date(2024, i).toLocaleString('default', { month: 'long' }),
  }))

  const analytics = getInventoryAnalytics(filteredData)

  const handleExport = () => {
    const csv = [
      [
        'Date',
        'S/N',
        'PO Number',
        'Company',
        'Category',
        'Item',
        'Qty Requested',
        "Supplier's Price",
        'Total Actual Amount',
        'NAM Unit Price',
        'Total NAM Amount',
        'Total NAM Subtotal',
        'Income',
        'Income %',
        'Date Delivered',
        'Payment Term',
        'Due Date',
        'SI Number',
        'Remarks',
        'Supplier',
        'Address',
        'TIN',
        'Sales Invoice No.',
        'Contact Person',
      ],
      ...filteredData.map((item) => [
        item.date,
        item.sn,
        item.poNumber,
        item.company,
        item.category,
        item.item,
        item.quantityRequested,
        `₱${item.suppliersPrice.toLocaleString()}`,
        `₱${item.totalActualAmount.toLocaleString()}`,
        `₱${item.namUnitPrice.toLocaleString()}`,
        `₱${item.totalNamAmount.toLocaleString()}`,
        `₱${item.totalNamAmountSubtotal.toLocaleString()}`,
        `₱${item.income.toLocaleString()}`,
        `${item.incomePercent.toFixed(2)}%`,
        item.dateDelivered,
        item.paymentTerm,
        item.dueDate,
        item.siNumber,
        item.remarks,
        item.supplier,
        item.address,
        item.tin,
        item.salesInvoiceNo,
        item.contactPerson,
      ]),
    ]

    const csvContent = csv.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <div className="space-y-6">
      <AddDataModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddData={handleAddData} />

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₱{(analytics.totalRevenue / 1000000).toFixed(2)}M
            </div>
            <p className="text-xs text-muted-foreground mt-1">{filteredData.length} transactions</p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₱{(analytics.totalIncome / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg: ₱{analytics.averageIncome.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalItems.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">units tracked</p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Profit Margin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(filteredData.reduce((sum, item) => sum + item.incomePercent, 0) / filteredData.length).toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">income percentage</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="table" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="table">Data Table</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button onClick={() => setIsModalOpen(true)} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Entry
            </Button>
            <Button onClick={handleExport} variant="outline" size="sm" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        <TabsContent value="table" className="space-y-4">
          {/* Filters */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Search & Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by PO number, company, item, supplier, contact..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filter Row */}
                <div className="grid gap-3 md:grid-cols-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">
                      Category
                    </label>
                    <Select value={selectedCategory || ''} onValueChange={(v) => setSelectedCategory(v || null)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Categories">All Categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">
                      Month
                    </label>
                    <Select value={selectedMonth || ''} onValueChange={(v) => setSelectedMonth(v || null)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Months" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Months">All Months</SelectItem>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">
                      Year
                    </label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">
                      Sort By
                    </label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Recent Date</SelectItem>
                        <SelectItem value="amount">Amount (High)</SelectItem>
                        <SelectItem value="income">Income (High)</SelectItem>
                        <SelectItem value="quantity">Quantity (High)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Active Filters */}
                {(searchQuery || selectedCategory !== 'All Categories' || selectedMonth !== 'All Months' || selectedYear !== '2024') && (
                  <div className="flex flex-wrap gap-2">
                    {searchQuery && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSearchQuery('')}
                        className="gap-1"
                      >
                        Search: {searchQuery}
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                    {selectedCategory !== 'All Categories' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedCategory('All Categories')}
                        className="gap-1"
                      >
                        {selectedCategory}
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                    {selectedMonth !== 'All Months' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedMonth('All Months')}
                        className="gap-1"
                      >
                        {months.find((m) => m.value === selectedMonth)?.label}
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Data Table */}
          <Card className="bg-card overflow-hidden">
            <CardContent className="p-0">
              <InventoryTable data={filteredData} />
            </CardContent>
          </Card>

          {/* Results Info */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredData.length} of {inventoryData.length} records
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsDashboard data={filteredData} analytics={analytics} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
