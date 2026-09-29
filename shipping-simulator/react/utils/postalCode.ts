export const sanitizePostalCode = (value: string): string =>
  value.replace(/\D/g, '').slice(0, 8)

export const formatPostalCode = (digits: string): string =>
  digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits

export const isValidPostalCode = (digits: string): boolean =>
  /^\d{8}$/.test(digits) && digits !== '00000000'