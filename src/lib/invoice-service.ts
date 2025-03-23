// Types for invoicing
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled"

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
  taxRate?: number
  taxAmount?: number
}

export interface Invoice {
  id: string
  number: string
  userId: string
  customerName: string
  customerEmail: string
  status: InvoiceStatus
  items: InvoiceItem[]
  subtotal: number
  taxTotal: number
  total: number
  notes?: string
  dueDate: string
  issueDate: string
  paidDate?: string
  paymentId?: string
}

// Mock invoice data
const mockInvoices: Invoice[] = [
  {
    id: "inv_1",
    number: "INV-2023-001",
    userId: "2",
    customerName: "Computer Science Department",
    customerEmail: "cs@diu.edu",
    status: "paid",
    items: [
      {
        id: "item_1",
        description: "Venue booking for AI Workshop",
        quantity: 1,
        unitPrice: 5000,
        amount: 5000,
        taxRate: 0.05,
        taxAmount: 250,
      },
      {
        id: "item_2",
        description: "Catering services (50 people)",
        quantity: 50,
        unitPrice: 300,
        amount: 15000,
        taxRate: 0.05,
        taxAmount: 750,
      },
    ],
    subtotal: 20000,
    taxTotal: 1000,
    total: 21000,
    notes: "Payment due within 30 days",
    dueDate: "2023-06-15T00:00:00Z",
    issueDate: "2023-05-15T00:00:00Z",
    paidDate: "2023-05-20T00:00:00Z",
    paymentId: "pmt_special_1",
  },
  {
    id: "inv_2",
    number: "INV-2023-002",
    userId: "2",
    customerName: "Business School",
    customerEmail: "business@diu.edu",
    status: "sent",
    items: [
      {
        id: "item_3",
        description: "Venue booking for Entrepreneurship Summit",
        quantity: 1,
        unitPrice: 8000,
        amount: 8000,
        taxRate: 0.05,
        taxAmount: 400,
      },
      {
        id: "item_4",
        description: "Audio/Visual Equipment Rental",
        quantity: 1,
        unitPrice: 3000,
        amount: 3000,
        taxRate: 0.05,
        taxAmount: 150,
      },
    ],
    subtotal: 11000,
    taxTotal: 550,
    total: 11550,
    notes: "Payment due within 15 days",
    dueDate: "2023-06-10T00:00:00Z",
    issueDate: "2023-05-25T00:00:00Z",
  },
]

// Invoice service functions
export const invoiceService = {
  // Create a new invoice
  createInvoice: async (
    userId: string,
    customerName: string,
    customerEmail: string,
    items: Omit<InvoiceItem, "id">[],
    dueDate: string,
    notes?: string,
  ): Promise<Invoice> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Calculate totals
    const invoiceItems: InvoiceItem[] = items.map((item) => ({
      ...item,
      id: `item_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      taxAmount: item.taxRate ? item.unitPrice * item.quantity * item.taxRate : 0,
    }))

    const subtotal = invoiceItems.reduce((sum, item) => sum + item.amount, 0)
    const taxTotal = invoiceItems.reduce((sum, item) => sum + (item.taxAmount || 0), 0)

    // Generate invoice number
    const invoiceCount = mockInvoices.length + 1
    const invoiceNumber = `INV-${new Date().getFullYear()}-${invoiceCount.toString().padStart(3, "0")}`

    const invoice: Invoice = {
      id: `inv_${Date.now()}`,
      number: invoiceNumber,
      userId,
      customerName,
      customerEmail,
      status: "draft",
      items: invoiceItems,
      subtotal,
      taxTotal,
      total: subtotal + taxTotal,
      notes,
      dueDate,
      issueDate: new Date().toISOString(),
    }

    // Add to mock data
    mockInvoices.push(invoice)

    return invoice
  },

  // Send an invoice
  sendInvoice: async (invoiceId: string): Promise<Invoice> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const invoice = mockInvoices.find((inv) => inv.id === invoiceId)

    if (!invoice) {
      throw new Error("Invoice not found")
    }

    if (invoice.status !== "draft") {
      throw new Error("Only draft invoices can be sent")
    }

    // Update invoice status
    invoice.status = "sent"

    return invoice
  },

  // Mark invoice as paid
  markAsPaid: async (invoiceId: string, paymentId?: string): Promise<Invoice> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const invoice = mockInvoices.find((inv) => inv.id === invoiceId)

    if (!invoice) {
      throw new Error("Invoice not found")
    }

    if (invoice.status === "paid") {
      throw new Error("Invoice is already paid")
    }

    if (invoice.status === "cancelled") {
      throw new Error("Cannot mark a cancelled invoice as paid")
    }

    // Update invoice status
    invoice.status = "paid"
    invoice.paidDate = new Date().toISOString()

    if (paymentId) {
      invoice.paymentId = paymentId
    }

    return invoice
  },

  // Cancel an invoice
  cancelInvoice: async (invoiceId: string): Promise<Invoice> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const invoice = mockInvoices.find((inv) => inv.id === invoiceId)

    if (!invoice) {
      throw new Error("Invoice not found")
    }

    if (invoice.status === "paid") {
      throw new Error("Cannot cancel a paid invoice")
    }

    // Update invoice status
    invoice.status = "cancelled"

    return invoice
  },

  // Get invoice by ID
  getInvoice: async (invoiceId: string): Promise<Invoice | null> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    return mockInvoices.find((inv) => inv.id === invoiceId) || null
  },

  // Get invoices by user ID
  getUserInvoices: async (userId: string): Promise<Invoice[]> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    return mockInvoices.filter((inv) => inv.userId === userId)
  },

  // Get all invoices (admin only)
  getAllInvoices: async (): Promise<Invoice[]> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return [...mockInvoices]
  },
}

