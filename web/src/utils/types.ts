export interface Project {
  id: number;
  decrypted_api_key?: string;
  name: string;
  supabase_url?: string;
  connected_at?: string;
}

export interface Bucket {
  id: string;
  name: string;
  public: boolean;
}

