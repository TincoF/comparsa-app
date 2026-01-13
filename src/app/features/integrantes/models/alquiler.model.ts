import { Integrante } from "./integrante.model";

export interface Alquiler {
  garante: Integrante | string | null;
  dni: string;
  detalles?: string | null;
  direccion: string | null;
}
