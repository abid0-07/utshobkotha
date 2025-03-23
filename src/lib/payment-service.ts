// Types for payment processing
export type PaymentMethod = "credit_card" | "mobile_banking" | "bank_transfer"

export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded"

export interface PaymentDetails {
  id: string
  amount: number
  currency: string
  status: PaymentStatus
  method: PaymentMethod
  createdAt: string
  updatedAt: string
  metadata?: Record<string, any>
}

export interface RefundDetails {
  id: string
  paymentId: string
  amount: number
  reason: string
  status: "pending" | "completed" | "failed"
  createdAt: string
}

// Mock payment data
const mockPayments: PaymentDetails[] = [
  {
    id: "pmt_1",
    amount: 500,
    currency: "BDT",
    status: "completed",
    method: "credit_card",
    createdAt: "2023-05-15T10:30:00Z",
    updatedAt: "2023-05-15T10:32:00Z",
    metadata: {
      eventId: "2",
      userId: "4",
      cardLast4: "4242",
    },
  },
  {
    id: "pmt_2",
    amount: 200,
    currency: "BDT",
    status: "completed",
    method: "mobile_banking",
    createdAt: "2023-05-20T14:45:00Z",
    updatedAt: "2023-05-20T14:47:00Z",
    metadata: {
      eventId: "3",
      userId: "3",
      provider: "bKash",
    },
  },
  {
    id: "pmt_3",
    amount: 1000,
    currency: "BDT",
    status: "refunded",
    method: "credit_card",
    createdAt: "2023-05-25T09:15:00Z",
    updatedAt: "2023-05-26T11:20:00Z",
    metadata: {
      eventId: "6",
      userId: "4",
      cardLast4: "1234",
    },
  },
]

const mockRefunds: RefundDetails[] = [
  {
    id: "ref_1",
    paymentId: "pmt_3",
    amount: 1000,
    reason: "Event cancelled",
    status: "completed",
    createdAt: "2023-05-26T11:20:00Z",
  },
]

// Payment service functions
export const paymentService = {
  // Process a payment
  processPayment: async (
    amount: number,
    currency: string,
    method: PaymentMethod,
    metadata?: Record<string, any>,
  ): Promise<PaymentDetails> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate payment processing
    const success = Math.random() > 0.1 // 90% success rate

    if (!success) {
      throw new Error("Payment processing failed")
    }

    const payment: PaymentDetails = {
      id: `pmt_${Date.now()}`,
      amount,
      currency,
      status: "completed",
      method,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata,
    }

    // Add to mock data
    mockPayments.push(payment)

    return payment
  },

  // Get payment by ID
  getPayment: async (paymentId: string): Promise<PaymentDetails | null> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    return mockPayments.find((p) => p.id === paymentId) || null
  },

  // Get payments by user ID
  getUserPayments: async (userId: string): Promise<PaymentDetails[]> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    return mockPayments.filter((p) => p.metadata?.userId === userId)
  },

  // Process a refund
  processRefund: async (paymentId: string, amount: number, reason: string): Promise<RefundDetails> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Find the payment
    const payment = mockPayments.find((p) => p.id === paymentId)

    if (!payment) {
      throw new Error("Payment not found")
    }

    if (payment.status === "refunded") {
      throw new Error("Payment already refunded")
    }

    // Update payment status
    payment.status = "refunded"
    payment.updatedAt = new Date().toISOString()

    // Create refund record
    const refund: RefundDetails = {
      id: `ref_${Date.now()}`,
      paymentId,
      amount,
      reason,
      status: "completed",
      createdAt: new Date().toISOString(),
    }

    // Add to mock data
    mockRefunds.push(refund)

    return refund
  },

  // Get refund by ID
  getRefund: async (refundId: string): Promise<RefundDetails | null> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    return mockRefunds.find((r) => r.id === refundId) || null
  },

  // Get refunds by payment ID
  getPaymentRefunds: async (paymentId: string): Promise<RefundDetails[]> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    return mockRefunds.filter((r) => r.paymentId === paymentId)
  },
}

