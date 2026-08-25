export interface CreateClientFormData {
  name: string;
  cpf?: string;
  rg?: string;
  birthDate?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  address?: string;
  number?: string;
  complement?: string;
  district?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notes?: string;
}

export interface Client {
  id: string;
  name: string;
  cpf?: string;
  rg?: string;
  birthDate?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  district?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientSuggestion {
  id: string;
  name: string;
}
