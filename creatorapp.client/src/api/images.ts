import api from '../lib/api';

export async function listImages(): Promise<string[]> {
  const res = await api.get('/Image/ListImages');
  return res.data || [];
}

export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  const res = await api.post('/Image/UploadImage', form);
  const url = res.data?.url ?? res.data;
  return url as string;
}
