import React, { useState } from 'react';
import type { OrderCreate } from '../../types/order';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { validateRequired } from '../../utils/validators';

interface CheckoutFormProps {
  onSubmit: (data: OrderCreate) => void;
  isSubmitting?: boolean;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState<OrderCreate>({
    shipping_address_line1: '',
    shipping_address_line2: '',
    shipping_city: '',
    shipping_state: '',
    shipping_zip: '',
    shipping_country: 'US',
  });
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const handleChange = (field: keyof OrderCreate) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string | null> = {
      shipping_address_line1: validateRequired(formData.shipping_address_line1, 'Street address'),
      shipping_city: validateRequired(formData.shipping_city, 'City'),
      shipping_state: validateRequired(formData.shipping_state, 'State'),
      shipping_zip: validateRequired(formData.shipping_zip, 'ZIP code'),
      shipping_country: validateRequired(formData.shipping_country, 'Country'),
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((err) => err !== null);
    if (!hasErrors) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
      <Input
        label="Street Address"
        value={formData.shipping_address_line1}
        onChange={handleChange('shipping_address_line1')}
        error={errors.shipping_address_line1}
        placeholder="123 Main St"
      />
      <Input
        label="Address Line 2 (Optional)"
        value={formData.shipping_address_line2 || ''}
        onChange={handleChange('shipping_address_line2')}
        placeholder="Apt 4B"
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="City"
          value={formData.shipping_city}
          onChange={handleChange('shipping_city')}
          error={errors.shipping_city}
          placeholder="New York"
        />
        <Input
          label="State"
          value={formData.shipping_state}
          onChange={handleChange('shipping_state')}
          error={errors.shipping_state}
          placeholder="NY"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="ZIP Code"
          value={formData.shipping_zip}
          onChange={handleChange('shipping_zip')}
          error={errors.shipping_zip}
          placeholder="10001"
        />
        <Input
          label="Country"
          value={formData.shipping_country}
          onChange={handleChange('shipping_country')}
          error={errors.shipping_country}
          placeholder="US"
        />
      </div>
      <Button type="submit" isLoading={isSubmitting} className="w-full" size="lg">
        Place Order
      </Button>
    </form>
  );
};

export default CheckoutForm;