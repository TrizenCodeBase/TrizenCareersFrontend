import { API_CONFIG } from '@/config/api';

export async function uploadApplicationFile(file: File, token: string): Promise<string> {
  const formData = new FormData();
  formData.append('resume', file);

  const response = await fetch(API_CONFIG.ENDPOINTS.APPLICATIONS_UPLOAD_RESUME!, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });

  const data = await response.json();
  if (!response.ok || !data.data?.url) {
    throw new Error(data.error || 'Failed to upload file. Please try again.');
  }

  return data.data.url;
}
