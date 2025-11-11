export interface Factura {
  id: string;
  total: number;
  metodo_pago: string;
  id_orden: string;
  fecha_registro: string;
  fecha_actualizacion?: string | null;
  id_usuario: string;
  id_usuario_mod?: string | null;
}