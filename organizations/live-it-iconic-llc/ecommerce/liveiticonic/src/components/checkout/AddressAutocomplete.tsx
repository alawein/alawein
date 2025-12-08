import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Google Maps types
type GoogleMapsAutocomplete = any;
type GoogleMapsPlace = any;

interface AddressComponents {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface AddressAutocompleteProps {
  onAddressSelect: (address: AddressComponents) => void;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
}

export function AddressAutocomplete({
  onAddressSelect,
  value,
  onChange,
  label = 'Street Address',
  required = true,
  placeholder = 'Start typing your address...',
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<GoogleMapsAutocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if ((window as any).google?.maps?.places) {
      setIsGoogleLoaded(true);
      return;
    }

    // Load Google Maps script
    const script = document.createElement('script');
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.warn('Google Maps API key not found. Address autocomplete will not work.');
      return;
    }

    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsGoogleLoaded(true);
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (!isGoogleLoaded || !inputRef.current) return;

    // Initialize autocomplete
    const google = (window as any).google;
    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      componentRestrictions: { country: ['us', 'ca'] }, // Restrict to US and Canada
      fields: ['address_components', 'formatted_address'],
    });

    // Handle place selection
    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      
      if (!place || !place.address_components) {
        return;
      }

      setIsLoading(true);

      // Parse address components
      const addressComponents: AddressComponents = {
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      };

      let streetNumber = '';
      let route = '';

      place.address_components.forEach((component: any) => {
        const types = component.types;

        if (types.includes('street_number')) {
          streetNumber = component.long_name;
        }
        if (types.includes('route')) {
          route = component.long_name;
        }
        if (types.includes('locality')) {
          addressComponents.city = component.long_name;
        }
        if (types.includes('administrative_area_level_1')) {
          addressComponents.state = component.short_name;
        }
        if (types.includes('postal_code')) {
          addressComponents.zipCode = component.long_name;
        }
        if (types.includes('country')) {
          addressComponents.country = component.long_name;
        }
      });

      // Combine street number and route
      addressComponents.address = `${streetNumber} ${route}`.trim();

      // Update input value
      onChange(addressComponents.address);

      // Call callback with parsed address
      onAddressSelect(addressComponents);

      setIsLoading(false);
    });

    return () => {
      if (autocompleteRef.current && (window as any).google) {
        (window as any).google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isGoogleLoaded, onAddressSelect, onChange]);

  return (
    <div className="relative">
      <Label htmlFor="address" className="text-lii-ash">
        {label} {required && '*'}
      </Label>
      <div className="relative">
        <Input
          ref={inputRef}
          id="address"
          type="text"
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-lii-charcoal/20 border-lii-gold/20 text-lii-cloud placeholder:text-lii-ash/50 pl-10"
          disabled={isLoading}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-lii-gold animate-spin" />
          ) : (
            <MapPin className="w-4 h-4 text-lii-gold" />
          )}
        </div>
      </div>
      {!isGoogleLoaded && (
        <p className="text-xs text-lii-ash/70 mt-1">
          Loading address autocomplete...
        </p>
      )}
    </div>
  );
}
