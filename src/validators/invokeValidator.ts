// src/validators/invokeValidator.ts
interface InvokeRequest {
  content: string;
  url?: string;
  flavor?: string;
}

interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateInvokeRequest(body: any): ValidationResult {
  if (!body.content) {
    return { valid: false, error: 'content is required' };
  }

  if (!body.url && !body.flavor) {
    return { valid: false, error: 'Either url or flavor must be provided' };
  }

  return { valid: true };
}