export interface Cliente {
  id: number;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  pedidos?: string[];
}