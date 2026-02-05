'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { InventoryItem } from '@/lib/mock-inventory'
import { Button } from '@/components/ui/button'

interface InventoryTableProps {
  data: InventoryItem[]
}

export function InventoryTable({ data }: InventoryTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const formatCurrency = (value: number) => {
    return `₱${value.toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <ScrollArea className="w-full">
      <div className="inline-block min-w-full">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="w-8 px-4 py-3 text-left font-medium text-muted-foreground" />
              <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
                Date
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
                S/N
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
                PO #
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
                Company
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
                Category
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
                Item
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground whitespace-nowrap">
                Qty
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground whitespace-nowrap">
                Supplier Price
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground whitespace-nowrap">
                Total Amount
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground whitespace-nowrap">
                NAM Unit Price
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground whitespace-nowrap">
                Total NAM
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground whitespace-nowrap">
                Income
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground whitespace-nowrap">
                Income %
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
                Supplier
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
                Address
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
                TIN
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
                Sales Invoice No.
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">
                Contact Person
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const isExpanded = expandedRows.has(item.id)
              return (
                <React.Fragment key={item.id}>
                  <tr className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="w-8 px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRow(item.id)}
                        className="h-6 w-6 p-0"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </td>
                    <td className="px-4 py-3 font-medium text-sm">{formatDate(item.date)}</td>
                    <td className="px-4 py-3 text-sm">{item.sn}</td>
                    <td className="px-4 py-3 text-sm font-mono text-accent">{item.poNumber}</td>
                    <td className="px-4 py-3 text-sm">{item.company}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-block px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{item.item}</td>
                    <td className="px-4 py-3 text-right text-sm font-medium">{item.quantityRequested}</td>
                    <td className="px-4 py-3 text-right text-sm">{formatCurrency(item.suppliersPrice)}</td>
                    <td className="px-4 py-3 text-right text-sm font-medium">
                      {formatCurrency(item.totalActualAmount)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm">{formatCurrency(item.namUnitPrice)}</td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-accent">
                      {formatCurrency(item.totalNamAmount)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-chart-1">
                      {formatCurrency(item.income)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium">
                      <span className="text-chart-1">{item.incomePercent.toFixed(2)}%</span>
                    </td>
                    <td className="px-4 py-3 text-sm">{item.supplier}</td>
                    <td className="px-4 py-3 text-sm text-xs">{item.address}</td>
                    <td className="px-4 py-3 text-sm font-mono">{item.tin}</td>
                    <td className="px-4 py-3 text-sm font-mono text-accent">{item.salesInvoiceNo}</td>
                    <td className="px-4 py-3 text-sm">{item.contactPerson}</td>
                  </tr>

                  {isExpanded && (
                    <tr className="border-b border-border bg-muted/20">
                      <td colSpan={19} className="px-4 py-4">
                        <div className="grid gap-4 md:grid-cols-3 text-sm">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Date Delivered</p>
                            <p className="font-medium">{formatDate(item.dateDelivered)}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Payment Term</p>
                            <p className="font-medium">{item.paymentTerm}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Due Date</p>
                            <p className="font-medium">{formatDate(item.dueDate)}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">SI Number</p>
                            <p className="font-medium font-mono text-accent">{item.siNumber}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Sales Invoice No.</p>
                            <p className="font-medium font-mono text-accent">{item.salesInvoiceNo}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Remarks</p>
                            <p className="font-medium">{item.remarks}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Address</p>
                            <p className="font-medium">{item.address}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">TIN</p>
                            <p className="font-medium font-mono">{item.tin}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Contact Person</p>
                            <p className="font-medium">{item.contactPerson}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>

        {data.length === 0 && (
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            <p>No inventory records found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
