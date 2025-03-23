"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, CreditCard, Smartphone, Building } from "lucide-react"
import { paymentService, type PaymentMethod } from "@/lib/payment-service"

interface CheckoutProps {
  amount: number
  currency: string
  description: string
  eventId: string
  onSuccess?: (paymentId: string) => void
  onCancel?: () => void
}

export function Checkout({ amount, currency, description, eventId, onSuccess, onCancel }: CheckoutProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit_card")

  // Credit card form state
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")

  // Mobile banking form state
  const [mobileNumber, setMobileNumber] = useState("")
  const [provider, setProvider] = useState("bKash")

  // Bank transfer form state
  const [accountName, setAccountName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [bankName, setBankName] = useState("")

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      // Validate form based on payment method
      if (paymentMethod === "credit_card") {
        if (!cardNumber || !cardName || !expiryDate || !cvv) {
          throw new Error("Please fill in all credit card details")
        }
      } else if (paymentMethod === "mobile_banking") {
        if (!mobileNumber || !provider) {
          throw new Error("Please fill in all mobile banking details")
        }
      } else if (paymentMethod === "bank_transfer") {
        if (!accountName || !accountNumber || !bankName) {
          throw new Error("Please fill in all bank transfer details")
        }
      }

      // Process payment
      const metadata = {
        eventId,
        description,
        ...(paymentMethod === "credit_card" && { cardLast4: cardNumber.slice(-4) }),
        ...(paymentMethod === "mobile_banking" && { provider }),
        ...(paymentMethod === "bank_transfer" && { bankName }),
      }

      const payment = await paymentService.processPayment(amount, currency, paymentMethod, metadata)

      toast({
        title: "Payment Successful",
        description: `Your payment of ${amount} ${currency} has been processed successfully.`,
      })

      if (onSuccess) {
        onSuccess(payment.id)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "An error occurred while processing your payment.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment Checkout</CardTitle>
        <CardDescription>Complete your payment for {description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center p-4 bg-muted rounded-md">
          <p className="text-sm text-muted-foreground">Amount</p>
          <p className="text-3xl font-bold">
            {amount} {currency}
          </p>
        </div>

        <div className="space-y-4">
          <Label>Payment Method</Label>
          <RadioGroup
            value={paymentMethod}
            onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
            className="grid grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem value="credit_card" id="credit_card" className="peer sr-only" />
              <Label
                htmlFor="credit_card"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <CreditCard className="mb-3 h-6 w-6" />
                <span className="text-sm font-medium">Credit Card</span>
              </Label>
            </div>

            <div>
              <RadioGroupItem value="mobile_banking" id="mobile_banking" className="peer sr-only" />
              <Label
                htmlFor="mobile_banking"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Smartphone className="mb-3 h-6 w-6" />
                <span className="text-sm font-medium">Mobile Banking</span>
              </Label>
            </div>

            <div>
              <RadioGroupItem value="bank_transfer" id="bank_transfer" className="peer sr-only" />
              <Label
                htmlFor="bank_transfer"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Building className="mb-3 h-6 w-6" />
                <span className="text-sm font-medium">Bank Transfer</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {paymentMethod === "credit_card" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="card-number">Card Number</Label>
              <Input
                id="card-number"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="card-name">Cardholder Name</Label>
              <Input
                id="card-name"
                placeholder="John Doe"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" value={cvv} onChange={(e) => setCvv(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {paymentMethod === "mobile_banking" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mobile-provider">Provider</Label>
              <select
                id="mobile-provider"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
              >
                <option value="bKash">bKash</option>
                <option value="Nagad">Nagad</option>
                <option value="Rocket">Rocket</option>
                <option value="Upay">Upay</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile-number">Mobile Number</Label>
              <Input
                id="mobile-number"
                placeholder="01XXXXXXXXX"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </div>
          </div>
        )}

        {paymentMethod === "bank_transfer" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bank-name">Bank Name</Label>
              <Input
                id="bank-name"
                placeholder="Bank Name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account-name">Account Name</Label>
              <Input
                id="account-name"
                placeholder="Account Name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account-number">Account Number</Label>
              <Input
                id="account-number"
                placeholder="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full" onClick={handlePayment} disabled={isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ${amount} ${currency}`
          )}
        </Button>

        <Button variant="outline" className="w-full" onClick={onCancel} disabled={isProcessing}>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  )
}

