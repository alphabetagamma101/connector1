// src/validators/invokeValidator.ts
interface InvokeRequest {
  content: string;
  url: string;
}

interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateInvokeRequest(body: any): ValidationResult {
  if (!body.content) {
    return { valid: false, error: 'content is required' };
  }

  if (!body.url) {
    return { valid: false, error: 'url is required' };
  }

  return { valid: true };
}