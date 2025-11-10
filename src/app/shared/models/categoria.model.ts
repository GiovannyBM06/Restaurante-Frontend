export interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
  fecha_registro?: Date;
  fecha_actualizacion?: Date | null;
  id_usuario?: string;
  id_usuario_mod?: string | null;
}