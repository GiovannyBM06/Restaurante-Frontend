export interface Mesa {
  id: string;
  capacidad: number;
  fecha_registro: string;
  fecha_actualizacion?: string | null;
  id_usuario: string;
  id_usuario_mod?: string | null;
}
