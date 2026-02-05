'use client'

import React from 'react'
import { InventoryDashboard } from '@/components/inventory/dashboard'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">NAM Builders</h1>
            <p className="text-sm text-muted-foreground">Inventory Management System</p>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="p-6">
        <InventoryDashboard />
      </main>
    </div>
  )
}
