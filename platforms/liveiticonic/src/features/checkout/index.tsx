// Simplified Checkout Feature - All-in-one component
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Trash2, Check } from 'lucide-react';

// Types
declare global {
  interface Window {
    google?: any;
  }
}

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type CheckoutForm = {
  email: string;
  name: string;
  address: string;
  city: string;
  zip: string;
  guestCheckout: boolean;
};

// Cart Management
const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        const { items: cartItems, expires } = JSON.parse(stored);
        if (Date.now() < expires) setItems(cartItems);
        else localStorage.removeItem('cart');
      } catch {
        localStorage.removeItem('cart');
      }
    }
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem('cart', JSON.stringify({
      items: newItems,
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    }));
  };

  const updateQuantity = (id: string, quantity: number) => {
    saveCart(items.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const removeItem = (id: string) => {
    saveCart(items.filter(item => item.id !== id));
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return { items, updateQuantity, removeItem, total };
};

// Address Autocomplete
const AddressInput = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => {
  useEffect(() => {
    const initAutocomplete = () => {
      const input = document.getElementById('address-input') as HTMLInputElement;
      if (!input || !window.google) return;

      const autocomplete = new window.google.maps.places.Autocomplete(input, {
        types: ['address']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) onChange(place.formatted_address);
      });
    };

    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = initAutocomplete;
      document.head.appendChild(script);
    } else {
      initAutocomplete();
    }
  }, [onChange]);

  return (
    <Input
      id="address-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Start typing your address..."
    />
  );
};

// Order Summary
const OrderSummary = ({ items, onUpdate, onRemove }: {
  items: CartItem[];
  onUpdate: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 10;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            {item.image && <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />}
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => onUpdate(item.id, parseInt(e.target.value) || 1)}
                className="w-16"
              />
              <Button variant="ghost" size="icon" onClick={() => onRemove(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// API
const createCheckout = async (data: { items: CartItem[]; form: CheckoutForm }) => {
  const { data: result, error } = await supabase.functions.invoke('create-checkout-session', {
    body: {
      items: data.items,
      email: data.form.email,
      metadata: {
        name: data.form.name,
        address: data.form.address,
        city: data.form.city,
        zip: data.form.zip,
        guestCheckout: data.form.guestCheckout
      },
      successUrl: `${window.location.origin}/checkout/success`,
      cancelUrl: `${window.location.origin}/checkout`
    }
  });
  
  if (error) throw error;
  return result;
};

// Main Component
export const CheckoutFlow = () => {
  const { items, updateQuantity, removeItem, total } = useCart();
  const [form, setForm] = useState<CheckoutForm>({
    email: '',
    name: '',
    address: '',
    city: '',
    zip: '',
    guestCheckout: false
  });

  const checkout = useMutation({
    mutationFn: createCheckout,
    onSuccess: (data) => {
      if (data?.url) window.location.href = data.url;
    },
    onError: () => toast.error('Checkout failed. Please try again.')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    checkout.mutate({ items, form });
  };

  if (items.length === 0) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <Button onClick={() => window.location.href = '/shop'}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="guest"
                  checked={form.guestCheckout}
                  onCheckedChange={(checked) => setForm({ ...form, guestCheckout: !!checked })}
                />
                <Label htmlFor="guest">Checkout as guest</Label>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <AddressInput
                  value={form.address}
                  onChange={(val) => setForm({ ...form, address: val })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
                    id="zip"
                    required
                    value={form.zip}
                    onChange={(e) => setForm({ ...form, zip: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <OrderSummary items={items} onUpdate={updateQuantity} onRemove={removeItem} />
          
          <Button type="submit" className="w-full" size="lg" disabled={checkout.isPending}>
            {checkout.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              `Pay $${total.toFixed(2)}`
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

// Success Page
export const CheckoutSuccess = () => {
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    
    if (sessionId) {
      supabase.functions.invoke('get-order-details', { body: { sessionId } })
        .then(({ data }) => setOrderDetails(data))
        .catch(() => toast.error('Failed to load order details'));
    }
    
    localStorage.removeItem('cart');
  }, []);

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12 text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground">Thank you for your purchase</p>
      </div>

      {orderDetails && (
        <Card className="text-left mb-6">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Order #{orderDetails.id}</p>
            <p className="text-sm text-muted-foreground">Confirmation email sent to {orderDetails.email}</p>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-4 justify-center">
        <Button onClick={() => window.location.href = '/orders'}>View Orders</Button>
        <Button variant="outline" onClick={() => window.location.href = '/shop'}>Continue Shopping</Button>
      </div>
    </div>
  );
};
