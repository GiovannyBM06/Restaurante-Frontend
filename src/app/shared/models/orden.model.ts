export interface Orden {
  id: string;
  estado: string;
  id_mesa: string;
  id_empleado: string;
  fecha_registro: string;
  fecha_actualizacion?: string;
  id_usuario: string;
  id_usuario_mod?: string;
}
