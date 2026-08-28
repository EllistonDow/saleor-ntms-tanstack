import { describe, expect, it } from 'vitest';
import { isNtmsCheckoutAddressValid, validateNtmsCheckoutAddress } from './ntms-checkout-address';

describe('Checkout address and validation logic', () => {
  it('validates required address fields accurately', () => {
    const invalidValues = {
      city: '',
      companyName: '',
      country: 'US',
      countryArea: '',
      email: 'invalid-email',
      firstName: '',
      lastName: '',
      phone: '',
      postalCode: '',
      streetAddress1: '',
      streetAddress2: '',
    };
    const errors = validateNtmsCheckoutAddress(invalidValues);
    expect(isNtmsCheckoutAddressValid(errors)).toBe(false);
    expect(errors.email).toBeDefined();
    expect(errors.firstName).toBeDefined();
    expect(errors.lastName).toBeDefined();
    expect(errors.streetAddress1).toBeDefined();
    expect(errors.city).toBeDefined();
    expect(errors.countryArea).toBeDefined();
    expect(errors.postalCode).toBeDefined();
  });

  it('passes when valid address values are provided', () => {
    const validValues = {
      city: 'Tampa',
      companyName: 'Nuclear Inc',
      country: 'US',
      countryArea: 'FL',
      email: 'customer@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
      phone: '8135551234',
      postalCode: '33602',
      streetAddress1: '100 Main St',
      streetAddress2: 'Apt 4B',
    };
    const errors = validateNtmsCheckoutAddress(validValues);
    expect(isNtmsCheckoutAddressValid(errors)).toBe(true);
  });
});
