export interface InventoryItem {
  id: string
  date: string
  sn: number
  poNumber: string
  company: string
  category: string
  item: string
  quantityRequested: number
  suppliersPrice: number
  totalActualAmount: number
  namUnitPrice: number
  totalNamAmount: number
  totalNamAmountSubtotal: number
  income: number
  incomePercent: number
  dateDelivered: string
  paymentTerm: string
  dueDate: string
  siNumber: string
  remarks: string
  supplier: string
  address: string
  tin: string
  salesInvoiceNo: string
  contactPerson: string
}

export const mockInventoryData: InventoryItem[] = [
  {
    id: '1',
    date: '2024-01-15',
    sn: 1,
    poNumber: 'PO-2024-001',
    company: 'ABC Corporation',
    category: 'Electronics',
    item: 'Laptop Computer',
    quantityRequested: 50,
    suppliersPrice: 45000,
    totalActualAmount: 2250000,
    namUnitPrice: 48000,
    totalNamAmount: 2400000,
    totalNamAmountSubtotal: 2400000,
    income: 150000,
    incomePercent: 6.67,
    dateDelivered: '2024-01-20',
    paymentTerm: '30 days',
    dueDate: '2024-02-19',
    siNumber: 'SI-2024-001',
    remarks: 'Delivered on time',
    supplier: 'Tech Supplies Inc.',
    address: 'Manila, Philippines',
    tin: '123-456-789-012',
    salesInvoiceNo: 'INV-2024-001',
    contactPerson: 'John Doe / 555-0123',
  },
  {
    id: '2',
    date: '2024-01-18',
    sn: 2,
    poNumber: 'PO-2024-002',
    company: 'XYZ Industries',
    category: 'Office Supplies',
    item: 'Office Chairs',
    quantityRequested: 100,
    suppliersPrice: 8000,
    totalActualAmount: 800000,
    namUnitPrice: 8500,
    totalNamAmount: 850000,
    totalNamAmountSubtotal: 850000,
    income: 50000,
    incomePercent: 6.25,
    dateDelivered: '2024-01-22',
    paymentTerm: '15 days',
    dueDate: '2024-02-02',
    siNumber: 'SI-2024-002',
    remarks: 'Quality approved',
    supplier: 'Office Furniture Plus',
    address: 'Quezon City, Philippines',
    tin: '234-567-890-123',
    salesInvoiceNo: 'INV-2024-002',
    contactPerson: 'Jane Smith / 555-0124',
  },
  {
    id: '3',
    date: '2024-01-20',
    sn: 3,
    poNumber: 'PO-2024-003',
    company: 'Global Trading',
    category: 'Raw Materials',
    item: 'Steel Sheets',
    quantityRequested: 200,
    suppliersPrice: 12000,
    totalActualAmount: 2400000,
    namUnitPrice: 13000,
    totalNamAmount: 2600000,
    totalNamAmountSubtotal: 2600000,
    income: 200000,
    incomePercent: 8.33,
    dateDelivered: '2024-01-25',
    paymentTerm: '45 days',
    dueDate: '2024-03-05',
    siNumber: 'SI-2024-003',
    remarks: 'Premium grade',
    supplier: 'Steel International',
    address: 'Cavite, Philippines',
    tin: '345-678-901-234',
    salesInvoiceNo: 'INV-2024-003',
    contactPerson: 'Robert Johnson / 555-0125',
  },
  {
    id: '4',
    date: '2024-01-22',
    sn: 4,
    poNumber: 'PO-2024-004',
    company: 'Tech Solutions',
    category: 'Electronics',
    item: 'Server Components',
    quantityRequested: 30,
    suppliersPrice: 95000,
    totalActualAmount: 2850000,
    namUnitPrice: 100000,
    totalNamAmount: 3000000,
    totalNamAmountSubtotal: 3000000,
    income: 150000,
    incomePercent: 5.26,
    dateDelivered: '2024-01-28',
    paymentTerm: '30 days',
    dueDate: '2024-02-27',
    siNumber: 'SI-2024-004',
    remarks: 'Tested and certified',
    supplier: 'Premium Tech Distributors',
    address: 'Manila, Philippines',
    tin: '456-789-012-345',
    salesInvoiceNo: 'INV-2024-004',
    contactPerson: 'Maria Garcia / 555-0126',
  },
  {
    id: '5',
    date: '2024-01-25',
    sn: 5,
    poNumber: 'PO-2024-005',
    company: 'Retail Plus',
    category: 'Consumer Products',
    item: 'Household Items',
    quantityRequested: 500,
    suppliersPrice: 2500,
    totalActualAmount: 1250000,
    namUnitPrice: 2800,
    totalNamAmount: 1400000,
    totalNamAmountSubtotal: 1400000,
    income: 150000,
    incomePercent: 12.0,
    dateDelivered: '2024-02-01',
    paymentTerm: '7 days',
    dueDate: '2024-02-01',
    siNumber: 'SI-2024-005',
    remarks: 'Fast moving inventory',
    supplier: 'Consumer Goods Ltd.',
    address: 'Makati, Philippines',
    tin: '567-890-123-456',
    salesInvoiceNo: 'INV-2024-005',
    contactPerson: 'Carlos Martinez / 555-0127',
  },
  {
    id: '6',
    date: '2024-02-01',
    sn: 6,
    poNumber: 'PO-2024-006',
    company: 'Construction Co.',
    category: 'Construction Materials',
    item: 'Cement Bags',
    quantityRequested: 1000,
    suppliersPrice: 350,
    totalActualAmount: 350000,
    namUnitPrice: 380,
    totalNamAmount: 380000,
    totalNamAmountSubtotal: 380000,
    income: 30000,
    incomePercent: 8.57,
    dateDelivered: '2024-02-05',
    paymentTerm: '60 days',
    dueDate: '2024-04-04',
    siNumber: 'SI-2024-006',
    remarks: 'Bulk order',
    supplier: 'Building Materials Supply',
    address: 'Laguna, Philippines',
    tin: '678-901-234-567',
    salesInvoiceNo: 'INV-2024-006',
    contactPerson: 'Rosa Santos / 555-0128',
  },
]

export function getInventoryAnalytics(data: InventoryItem[]) {
  const totalRevenue = data.reduce((sum, item) => sum + item.totalNamAmount, 0)
  const totalIncome = data.reduce((sum, item) => sum + item.income, 0)
  const averageIncome = totalIncome / data.length
  const totalItems = data.reduce((sum, item) => sum + item.quantityRequested, 0)

  const categoryTotals = data.reduce(
    (acc, item) => {
      const existing = acc.find((c) => c.category === item.category)
      if (existing) {
        existing.total += item.totalNamAmount
        existing.count += 1
      } else {
        acc.push({ category: item.category, total: item.totalNamAmount, count: 1 })
      }
      return acc
    },
    [] as Array<{ category: string; total: number; count: number }>,
  )

  const supplierStats = data.reduce(
    (acc, item) => {
      const existing = acc.find((s) => s.supplier === item.supplier)
      if (existing) {
        existing.total += item.totalNamAmount
        existing.count += 1
      } else {
        acc.push({ supplier: item.supplier, total: item.totalNamAmount, count: 1 })
      }
      return acc
    },
    [] as Array<{ supplier: string; total: number; count: number }>,
  )

  return {
    totalRevenue,
    totalIncome,
    averageIncome,
    totalItems,
    categoryTotals: categoryTotals.sort((a, b) => b.total - a.total),
    supplierStats: supplierStats.sort((a, b) => b.total - a.total),
  }
}
