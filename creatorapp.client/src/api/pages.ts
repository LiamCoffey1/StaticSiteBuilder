import api from '../lib/api';
import type { JsonElement, BindingData } from '../types';

export interface PageDto {
  id: string;
  name: string;
  content: JsonElement;
  bindings: BindingData;
}

export async function listPages(): Promise<PageDto[]> {
  const res = await api.get('/Pages');
  return res.data || [];
}

export async function createPage(page: PageDto): Promise<PageDto> {
  const res = await api.post('/Pages', page);
  return res.data;
}

export async function updatePage(id: string, page: PageDto): Promise<PageDto> {
  const res = await api.put(`/Pages/${id}`, page);
  return res.data;
}

export async function deletePage(id: string): Promise<void> {
  await api.delete(`/Pages/${id}`);
}
