import { axiosConfig } from '@/utils/axios-config';

export interface PasswordResetResponse {
  message: string;
}

export async function requestPasswordReset(email: string): Promise<PasswordResetResponse> {
  const response = await axiosConfig.post<PasswordResetResponse>('/auth/forgot-password', {
    email: email.trim().toLowerCase(),
  });
  return response.data;
}

export async function resetPassword(token: string, newPassword: string): Promise<PasswordResetResponse> {
  const response = await axiosConfig.post<PasswordResetResponse>('/auth/reset-password', {
    token,
    newPassword,
  });
  return response.data;
}

export function getPasswordResetError(error: unknown, fallback: string): string {
  const body = (error as {
    response?: { data?: { message?: string | string[]; errors?: string[] } };
    message?: string;
  })?.response?.data;

  if (Array.isArray(body?.errors)) return body.errors.join(' ');
  if (Array.isArray(body?.message)) return body.message.join(' ');
  return body?.message || (error as { message?: string })?.message || fallback;
}
