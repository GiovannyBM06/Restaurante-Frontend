export interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
  fecha_registro?: string;
  fecha_actualizacion?: string | null;
  id_usuario?: string;
  id_usuario_mod?: string | null;
}