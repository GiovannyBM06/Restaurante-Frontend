import { Cliente } from './cliente.model';
import { Mesa } from './mesa.model';

export interface Reserva {
  id_cliente: string;
  id_mesa: string;
  cantidad_personas: number;
  fecha_Hora: string;
  Estado: boolean;
  fecha_registro?: string;
  fecha_actualizacion?: string | null;
  id_usuario?: string;
  id_usuario_mod?: string | null;

  cliente?: Cliente;
  mesa?: Mesa;
}