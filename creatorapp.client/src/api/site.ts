import api from '../lib/api';
import type { JsonElement } from '../types';

export interface PageWrapper {
  pages: Array<{ id: string; name: string; content: JsonElement }>;
}

export async function publishSite(payload: PageWrapper): Promise<any> {
  const res = await api.post('/Generator/PublishSite', payload);
  return res.data;
}
