export interface PlatoOrden {
  id_orden: string;
  id_plato: string;
  cantidad: number;
  fecha_registro?: string;
  fecha_actualizacion?: string | null;
  id_usuario?: string;
  id_usuario_mod?: string | null;
}
