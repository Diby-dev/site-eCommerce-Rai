export interface Client {
  id_client: string; // UUID
  nom_client: string;
  email_client: string;
  contact_client: string;
  created_at?: string;
}

export interface AuthFormData {
  email: string;
  password?: string;
  nom_client?: string;
  contact_client?: string;
}