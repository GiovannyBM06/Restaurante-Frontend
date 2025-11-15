export interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  Email: string;
  telefono: string;
  fecha_registro?: Date;
  fecha_actualizacion?: Date | null;
  id_usuario?: string;
  id_usuario_mod?: string | null;
}