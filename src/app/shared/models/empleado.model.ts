export interface Empleado {
  id: string;
  nombre: string;
  apellido: string;
  rol: string;
  salario: number;
  fecha_registro: string;
  fecha_actualizacion?: string | null;
  id_usuario: string;
  id_usuario_mod?: string | null;
}