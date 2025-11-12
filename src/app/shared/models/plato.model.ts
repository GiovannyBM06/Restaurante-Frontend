import { Categoria } from './categoria.model';

export interface Plato {
  id: string;
  nombre: string;
  precio_unidad: number;
  descripcion?: string | null;
  id_categoria: string;
  fecha_registro?: Date;
  fecha_actualizacion?: Date | null;
  id_usuario?: string;
  id_usuario_mod?: string | null;

  // relación opcional
  categoria?: Categoria;
}
