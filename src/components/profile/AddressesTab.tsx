
import React, { useState } from "react";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Address } from "@/types/checkout";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAddressManager } from "@/hooks/useAddressManager";

export const AddressesTab = () => {
  const { user } = useAuth();
  const { addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress, defaultAddressId } = useAddressManager();
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<(Address & { id: string }) | null>(null);

  // Form state
  const [addressForm, setAddressForm] = useState<Partial<Address>>({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: ""
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditAddress = (address: Address & { id: string }) => {
    setEditingAddress(address);
    setAddressForm({
      firstName: address.firstName,
      lastName: address.lastName,
      address1: address.address1,
      address2: address.address2 || "",
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone || ""
    });
    setIsAddressFormOpen(true);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      firstName: user?.user_metadata?.first_name || "",
      lastName: user?.user_metadata?.last_name || "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      phone: ""
    });
    setIsAddressFormOpen(true);
  };

  const handleSubmitAddress = () => {
    // Basic validation
    if (!addressForm.firstName || !addressForm.lastName || !addressForm.address1 || 
        !addressForm.city || !addressForm.state || !addressForm.zipCode || !addressForm.country) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (editingAddress) {
      updateAddress(editingAddress.id, addressForm as Address);
      toast.success("Address updated successfully");
    } else {
      addAddress(addressForm as Address);
      toast.success("Address added successfully");
    }
    
    setIsAddressFormOpen(false);
    setEditingAddress(null);
  };

  const handleDeleteAddress = (id: string) => {
    deleteAddress(id);
    toast.success("Address removed successfully");
  };

  const handleSetDefaultAddress = (id: string) => {
    setDefaultAddress(id);
    toast.success("Default address updated");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Addresses</CardTitle>
        <CardDescription>
          Manage your shipping and billing addresses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={handleAddNewAddress} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add New Address
          </Button>
        </div>
        
        {addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <h3 className="mb-2 text-lg font-medium">No saved addresses</h3>
            <p className="text-sm text-muted-foreground">Add addresses to make checkout faster</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {addresses.map((address) => (
              <div key={address.id} className={`relative rounded-lg border p-4 ${address.id === defaultAddressId ? 'border-primary ring-1 ring-primary' : ''}`}>
                {address.id === defaultAddressId && (
                  <span className="absolute right-2 top-2 rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
                    Default
                  </span>
                )}
                <div className="mb-3 font-medium">
                  {address.firstName} {address.lastName}
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>{address.address1}</div>
                  {address.address2 && <div>{address.address2}</div>}
                  <div>{address.city}, {address.state} {address.zipCode}</div>
                  <div>{address.country}</div>
                  {address.phone && <div>Phone: {address.phone}</div>}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditAddress(address)}
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Remove
                    </Button>
                  </div>
                  {address.id !== defaultAddressId && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleSetDefaultAddress(address.id)}
                    >
                      Set as default
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <Dialog open={isAddressFormOpen} onOpenChange={setIsAddressFormOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
              <DialogDescription>
                {editingAddress 
                  ? "Update your address information below" 
                  : "Fill in your address details to save for future orders"}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={addressForm.firstName}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={addressForm.lastName}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address1">Address Line 1 *</Label>
                <Input
                  id="address1"
                  name="address1"
                  value={addressForm.address1}
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address2">Address Line 2</Label>
                <Input
                  id="address2"
                  name="address2"
                  value={addressForm.address2}
                  onChange={handleFormChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={addressForm.city}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province *</Label>
                  <Input
                    id="state"
                    name="state"
                    value={addressForm.state}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={addressForm.zipCode}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    name="country"
                    value={addressForm.country}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={addressForm.phone}
                  onChange={handleFormChange}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddressFormOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitAddress}>
                {editingAddress ? "Update Address" : "Save Address"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
