'use client'

import React from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InventoryItem } from '@/lib/mock-inventory'

interface AnalyticsDashboardProps {
  data: InventoryItem[]
  analytics: {
    totalRevenue: number
    totalIncome: number
    averageIncome: number
    totalItems: number
    categoryTotals: Array<{ category: string; total: number; count: number }>
    supplierStats: Array<{ supplier: string; total: number; count: number }>
  }
}

export function AnalyticsDashboard({ data, analytics }: AnalyticsDashboardProps) {
  // Prepare chart data
  const categoryData = analytics.categoryTotals.map((item) => ({
    name: item.category,
    value: Math.round(item.total / 1000000 * 100) / 100, // in millions
    count: item.count,
  }))

  const supplierData = analytics.supplierStats.slice(0, 8).map((item) => ({
    name: item.supplier.split(' ')[0], // Shorten name
    value: Math.round(item.total / 1000000 * 100) / 100,
    count: item.count,
  }))

  const dailyTrendData = (() => {
    const dateMap = new Map<string, { revenue: number; income: number; count: number }>()

    data.forEach((item) => {
      const date = new Date(item.date).toLocaleDateString('en-PH', {
        month: 'short',
        day: 'numeric',
      })
      const existing = dateMap.get(date) || { revenue: 0, income: 0, count: 0 }
      existing.revenue += item.totalNamAmount
      existing.income += item.income
      existing.count += 1
      dateMap.set(date, existing)
    })

    return Array.from(dateMap.entries())
      .map(([date, stats]) => ({
        date,
        revenue: Math.round(stats.revenue / 1000000 * 100) / 100,
        income: Math.round(stats.income / 1000 * 100) / 100,
      }))
      .slice(0, 20)
  })()

  const incomeDistribution = data.map((item) => ({
    name: item.poNumber,
    value: item.income,
  }))

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f97316', '#6366f1']

  return (
    <div className="space-y-6">
      {/* Revenue by Category */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Revenue by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" label={{ value: '₱ (Millions)', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                formatter={(value) => `₱${value.toFixed(2)}M`}
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Suppliers */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Revenue by Top Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={supplierData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" width={80} />
                <Tooltip
                  formatter={(value) => `₱${value.toFixed(2)}M`}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                />
                <Bar dataKey="value" fill="hsl(var(--accent))" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Income Distribution */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Income Distribution (Top 8)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomeDistribution.slice(0, 8)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ₱${(value / 1000).toFixed(0)}K`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₱${(value / 1000).toFixed(0)}K`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Daily Trend */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Daily Revenue & Income Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" label={{ value: '₱ (Millions)', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                formatter={(value) => `₱${value.toFixed(2)}M`}
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                name="Revenue"
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={false}
                name="Income"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Statistics Table */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Category Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.categoryTotals.map((cat) => (
                <div key={cat.category} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{cat.category}</p>
                    <p className="text-xs text-muted-foreground">{cat.count} orders</p>
                  </div>
                  <p className="font-bold">₱{(cat.total / 1000000).toFixed(2)}M</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Supplier Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.supplierStats.map((supplier) => (
                <div key={supplier.supplier} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{supplier.supplier}</p>
                    <p className="text-xs text-muted-foreground">{supplier.count} orders</p>
                  </div>
                  <p className="font-bold text-sm">₱{(supplier.total / 1000000).toFixed(2)}M</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
