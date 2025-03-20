
import React, { useState } from "react";
import { PlusCircle, Trash2, CreditCard, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { usePaymentMethodManager } from "@/hooks/usePaymentMethodManager";

export const PaymentMethodsTab = () => {
  const { 
    paymentMethods, 
    addPaymentMethod, 
    deletePaymentMethod, 
    setDefaultPaymentMethod,
    defaultPaymentMethodId
  } = usePaymentMethodManager();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    cardNumber: "",
    nameOnCard: "",
    expiryDate: "",
    cvv: ""
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces every 4 digits
    if (name === "cardNumber") {
      const formatted = value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
      setFormData(prev => ({ ...prev, [name]: formatted.substring(0, 19) }));
      return;
    }
    
    // Format expiry date as MM/YY
    if (name === "expiryDate") {
      let formatted = value.replace(/\D/g, "");
      if (formatted.length > 2) {
        formatted = formatted.substring(0, 2) + "/" + formatted.substring(2, 4);
      }
      setFormData(prev => ({ ...prev, [name]: formatted }));
      return;
    }
    
    // Limit CVV to 3 or 4 digits
    if (name === "cvv") {
      const formatted = value.replace(/\D/g, "").substring(0, 4);
      setFormData(prev => ({ ...prev, [name]: formatted }));
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCard = () => {
    // Simple validation
    if (!formData.cardNumber || !formData.nameOnCard || !formData.expiryDate || !formData.cvv) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Send formatted data to be saved
    const last4 = formData.cardNumber.replace(/\s/g, "").slice(-4);
    const cardType = getCardType(formData.cardNumber);
    
    addPaymentMethod({
      cardNumber: last4,
      nameOnCard: formData.nameOnCard,
      expiryDate: formData.expiryDate,
      cardType
    });
    
    // Reset form and close dialog
    setFormData({
      cardNumber: "",
      nameOnCard: "",
      expiryDate: "",
      cvv: ""
    });
    setIsFormOpen(false);
    toast.success("Payment method added successfully");
  };

  const handleDeleteCard = (id: string) => {
    deletePaymentMethod(id);
    toast.success("Payment method removed");
  };

  const handleSetDefault = (id: string) => {
    setDefaultPaymentMethod(id);
    toast.success("Default payment method updated");
  };

  // Simple card type detection based on first digits
  const getCardType = (cardNumber: string) => {
    const cleanNumber = cardNumber.replace(/\s/g, "");
    
    if (/^4/.test(cleanNumber)) return "visa";
    if (/^5[1-5]/.test(cleanNumber)) return "mastercard";
    if (/^3[47]/.test(cleanNumber)) return "amex";
    if (/^6(?:011|5)/.test(cleanNumber)) return "discover";
    
    return "generic";
  };

  const getCardIcon = (type: string) => {
    // In a real app, you'd use specific card icons
    return <CreditCard className={`h-6 w-6 ${type === 'visa' ? 'text-blue-600' : type === 'mastercard' ? 'text-red-500' : type === 'amex' ? 'text-blue-400' : 'text-gray-600'}`} />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>
          Manage your saved payment cards for faster checkout
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add New Card
          </Button>
        </div>
        
        {paymentMethods.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <h3 className="mb-2 text-lg font-medium">No saved payment methods</h3>
            <p className="text-sm text-muted-foreground">Save your card details for faster checkout</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {paymentMethods.map((method) => (
              <div key={method.id} className={`relative flex items-start rounded-lg border p-4 ${method.id === defaultPaymentMethodId ? 'border-primary ring-1 ring-primary' : ''}`}>
                <div className="mr-4 mt-1">
                  {getCardIcon(method.cardType)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium capitalize">{method.cardType}</div>
                    {method.id === defaultPaymentMethodId && (
                      <span className="rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    •••• •••• •••• {method.cardNumber}
                  </div>
                  <div className="mt-1 text-sm">
                    {method.nameOnCard} | Expires: {method.expiryDate}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    {method.id !== defaultPaymentMethodId && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleSetDefault(method.id)}
                        className="h-8 px-2"
                      >
                        <Star className="mr-1 h-3 w-3" />
                        Make Default
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8 px-2 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteCard(method.id)}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Payment Method</DialogTitle>
              <DialogDescription>
                Enter your card details below to save for future purchases
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nameOnCard">Name on Card</Label>
                <Input
                  id="nameOnCard"
                  name="nameOnCard"
                  value={formData.nameOnCard}
                  onChange={handleFormChange}
                  placeholder="John Doe"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleFormChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleFormChange}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    type="password"
                    value={formData.cvv}
                    onChange={handleFormChange}
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCard}>
                Save Card
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
